#!/usr/bin/env python3
"""Robô do Zero — diagnóstico a partir do resumo do backtest.

Usa só os números do resumo (o que aparece no print) para mostrar onde o
robô vaza dinheiro: margem sobre o empate, peso dos custos e velocidade das
perdas. Serve para decidir o que testar na fase "Melhorar meu robô".

Exemplos:
  python diagnostico.py --operacoes 234 --acerto 30.34 --ganho-medio 90.28 --perda-media 39.82
  python diagnostico.py --operacoes 234 --acerto 30.34 --ganho-medio 90.28 --perda-media 39.82 \\
      --custo 1 --slippage 1 --tempo-ganho 17.5 --tempo-perda 8.6 --maior-perda 40
"""
import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from metricas import brl, num  # noqa: E402


def diagnosticar(a):
    acerto = a.acerto / 100
    g, p = a.ganho_medio, abs(a.perda_media)
    custo_op = a.custo + a.slippage
    r = {
        "operacoes": a.operacoes,
        "acerto_pct": a.acerto,
        "payoff": g / p if p else None,
        "acerto_empate_pct": p / (g + p) * 100 if (g + p) else None,
        "expectativa_bruta": acerto * g - (1 - acerto) * p,
        "custo_por_operacao": custo_op,
    }
    r["margem_sobre_empate_pp"] = a.acerto - r["acerto_empate_pct"] if r["acerto_empate_pct"] is not None else None
    r["expectativa_liquida"] = r["expectativa_bruta"] - custo_op
    r["resultado_bruto_projetado"] = r["expectativa_bruta"] * a.operacoes
    r["resultado_liquido_projetado"] = r["expectativa_liquida"] * a.operacoes
    g_liq, p_liq = g - custo_op, p + custo_op
    r["acerto_empate_com_custos_pct"] = p_liq / (g_liq + p_liq) * 100 if (g_liq + p_liq) > 0 else None
    r["custo_sobre_ganho_medio_pct"] = custo_op / g * 100 if g else None
    if a.tempo_ganho and a.tempo_perda:
        r["tempo_perda_sobre_ganho"] = a.tempo_perda / a.tempo_ganho

    sinais = []
    if r["expectativa_liquida"] <= 0:
        sinais.append(("vazamento", "Expectativa negativa depois dos custos: o robô perde dinheiro em média."))
    elif custo_op and r["expectativa_liquida"] < 2 * custo_op:
        sinais.append(("custo", "A vantagem por operação é menor que 2x o custo. Qualquer piora no real zera o robô."))
    if r["margem_sobre_empate_pp"] is not None and abs(r["margem_sobre_empate_pp"]) < 3:
        sinais.append(("empate", f"Acerto a {num(abs(r['margem_sobre_empate_pp']), 1)} ponto(s) percentual(is) do empate. O robô está no fio da navalha."))
    if r.get("tempo_perda_sobre_ganho") is not None and r["tempo_perda_sobre_ganho"] < 0.6:
        sinais.append(("entrada_cedo", "As perdas acontecem bem mais rápido que os ganhos. O robô está entrando cedo demais ou contra um movimento forte."))
    if a.maior_perda and abs(a.maior_perda) and p / abs(a.maior_perda) > 0.9:
        sinais.append(("stop_cheio", "Quase toda perda é o stop cheio. O preço vai direto contra a entrada, sem dar chance."))
    if r["custo_sobre_ganho_medio_pct"] is not None and r["custo_sobre_ganho_medio_pct"] > 10:
        sinais.append(("custo_alto", f"O custo come {num(r['custo_sobre_ganho_medio_pct'], 0)}% do ganho médio. Menos operações e alvos maiores ajudam."))
    if a.operacoes < 200:
        sinais.append(("amostra", f"Só {a.operacoes} operações. Qualquer melhora pode ser sorte."))
    if r["payoff"] is not None and r["payoff"] < 1 and a.acerto < 55:
        sinais.append(("payoff", "Ganha pouco quando acerta e acerta pouco. Alvo curto demais ou stop longo demais."))
    r["sinais"] = [{"codigo": c, "texto": t} for c, t in sinais]
    return r


def main():
    p = argparse.ArgumentParser(description="Diagnóstico do Robô do Zero a partir do resumo do backtest.")
    p.add_argument("--operacoes", type=int, required=True)
    p.add_argument("--acerto", type=float, required=True, help="taxa de acerto em %%")
    p.add_argument("--ganho-medio", type=float, required=True, help="R$ por operação vencedora")
    p.add_argument("--perda-media", type=float, required=True, help="R$ por operação perdedora (positivo ou negativo)")
    p.add_argument("--custo", type=float, default=0.0, help="corretagem + taxas por operação em R$ (0 se o backtest já descontou)")
    p.add_argument("--slippage", type=float, default=0.0, help="escorregão por operação em R$ (0 se o backtest já descontou)")
    p.add_argument("--tempo-ganho", type=float, help="tempo médio das vencedoras, em minutos")
    p.add_argument("--tempo-perda", type=float, help="tempo médio das perdedoras, em minutos")
    p.add_argument("--maior-perda", type=float, help="maior operação perdedora em R$")
    p.add_argument("--json", action="store_true")
    a = p.parse_args()

    r = diagnosticar(a)
    if a.json:
        print(json.dumps(r, ensure_ascii=False, indent=2))
        return

    def f(v, casas=2):
        return "—" if v is None else num(v, casas)

    print("ROBÔ DO ZERO — DIAGNÓSTICO")
    print(f"Acerto atual .................... {f(r['acerto_pct'], 1)}%")
    print(f"Acerto para empatar ............. {f(r['acerto_empate_pct'], 1)}%")
    print(f"Acerto para empatar com custos .. {f(r['acerto_empate_com_custos_pct'], 1)}%")
    print(f"Payoff .......................... {f(r['payoff'])}")
    print(f"Expectativa por operação ........ {brl(r['expectativa_bruta'])} bruta · {brl(r['expectativa_liquida'])} com custos")
    print(f"Resultado no período ............ {brl(r['resultado_bruto_projetado'])} bruto · {brl(r['resultado_liquido_projetado'])} com custos")
    if r["custo_sobre_ganho_medio_pct"] is not None and r["custo_por_operacao"]:
        print(f"Custo sobre o ganho médio ....... {f(r['custo_sobre_ganho_medio_pct'], 0)}%")
    if r.get("tempo_perda_sobre_ganho") is not None:
        print(f"Perdas duram .................... {f(r['tempo_perda_sobre_ganho'] * 100, 0)}% do tempo dos ganhos")
    print()
    if r["sinais"]:
        print("ONDE O ROBÔ VAZA")
        for s in r["sinais"]:
            print(f"- [{s['codigo']}] {s['texto']}")
    else:
        print("Nenhum vazamento óbvio no resumo. Confirme no período de prova e no risco de quebra.")
    print("\nNúmeros do resumo do backtest. Resultado passado não garante resultado futuro.")


if __name__ == "__main__":
    main()
