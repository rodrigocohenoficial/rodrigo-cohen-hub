#!/usr/bin/env python3
"""Robô do Zero — risco de quebra com 10 mil simulações.

Sorteia sequências de operações a partir do backtest (com reposição) e conta
em quantas a conta perde o percentual definido como quebra.

Exemplos:
  python quebra.py --arquivo operacoes.txt --capital 5000
  python quebra.py --acerto 45 --ganho-medio 60 --perda-media 30 --capital 5000
  python quebra.py --arquivo operacoes.txt --capital 5000 --buscar-escala
"""
import argparse
import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from metricas import ler_operacoes, brl, num  # noqa: E402


def percentil(ordenados, p):
    if not ordenados:
        return 0.0
    k = (len(ordenados) - 1) * p / 100
    i = int(k)
    j = min(i + 1, len(ordenados) - 1)
    return ordenados[i] + (ordenados[j] - ordenados[i]) * (k - i)


def simular(ops, capital, n_ops, sims, quebra_pct, escala, semente):
    rng = random.Random(semente)
    limite = capital * (1 - quebra_pct / 100)
    quebras = 0
    finais, dds, seqs = [], [], []
    escolhas = [x * escala for x in ops]
    for _ in range(sims):
        saldo = capital
        pico = capital
        dd = 0.0
        seq = seq_max = 0
        quebrou = False
        for x in rng.choices(escolhas, k=n_ops):
            saldo += x
            if saldo > pico:
                pico = saldo
            if (pico - saldo) / pico > dd:
                dd = (pico - saldo) / pico
            if x < 0:
                seq += 1
                if seq > seq_max:
                    seq_max = seq
            else:
                seq = 0
            if saldo <= limite:
                quebrou = True
                break
        if quebrou:
            quebras += 1
        finais.append(saldo)
        dds.append(dd * 100)
        seqs.append(seq_max)
    finais.sort()
    dds.sort()
    seqs.sort()
    return {
        "simulacoes": sims,
        "operacoes_por_simulacao": n_ops,
        "capital": capital,
        "escala": escala,
        "quebra_definida_pct": quebra_pct,
        "chance_quebra_pct": quebras / sims * 100,
        "chance_terminar_no_prejuizo_pct": sum(1 for f in finais if f < capital) / sims * 100,
        "capital_final_ruim_p5": percentil(finais, 5),
        "capital_final_tipico_p50": percentil(finais, 50),
        "capital_final_bom_p95": percentil(finais, 95),
        "drawdown_tipico_pct_p50": percentil(dds, 50),
        "drawdown_ruim_pct_p95": percentil(dds, 95),
        "seq_perdas_tipica_p50": percentil(seqs, 50),
        "seq_perdas_ruim_p95": percentil(seqs, 95),
    }


def main():
    p = argparse.ArgumentParser(description="Risco de quebra do Robô do Zero (Monte Carlo).")
    p.add_argument("--arquivo", help="resultado de cada operação em R$, um por linha")
    p.add_argument("--coluna", type=int)
    p.add_argument("--sep")
    p.add_argument("--decimal", choices=["auto", "virgula", "ponto"], default="auto")
    p.add_argument("--acerto", type=float, help="taxa de acerto em %% (modo resumo)")
    p.add_argument("--ganho-medio", type=float, help="ganho médio por operação vencedora em R$ (modo resumo)")
    p.add_argument("--perda-media", type=float, help="perda média por operação perdedora em R$, número positivo (modo resumo)")
    p.add_argument("--capital", type=float, required=True)
    p.add_argument("--operacoes", type=int, help="operações por simulação")
    p.add_argument("--simulacoes", type=int, default=10000)
    p.add_argument("--quebra", type=float, default=50.0, help="perda em %% do capital que conta como quebra")
    p.add_argument("--escala", type=float, default=1.0, help="multiplica cada operação (ex.: 2 contratos = 2)")
    p.add_argument("--custo", type=float, default=0.0, help="custo por operação em R$, se não estiver descontado")
    p.add_argument("--buscar-escala", action="store_true", help="testa escalas de 1 a 10 e mostra o limite com risco abaixo de 5%%")
    p.add_argument("--semente", type=int, default=42)
    p.add_argument("--json", action="store_true")
    a = p.parse_args()

    if a.arquivo:
        ops, _ = ler_operacoes(a.arquivo, a.coluna, a.sep, a.decimal)
        if len(ops) < 30:
            print(f"Aviso: só {len(ops)} operações. A simulação herda a fragilidade da amostra.\n")
        n_ops = a.operacoes or len(ops)
    elif None not in (a.acerto, a.ganho_medio, a.perda_media):
        # Modo resumo: monta 100 operações com a mesma taxa de acerto
        vencedoras = round(a.acerto)
        ops = [a.ganho_medio] * vencedoras + [-abs(a.perda_media)] * (100 - vencedoras)
        n_ops = a.operacoes or 250
    else:
        sys.exit("Informe --arquivo ou o trio --acerto --ganho-medio --perda-media.")
    if not ops:
        sys.exit("Nenhuma operação encontrada.")
    ops = [x - a.custo for x in ops]
    if sum(ops) / len(ops) <= 0:
        print("Atenção: a expectativa por operação é zero ou negativa. Com isso, quebrar é questão de tempo.\n")

    if a.buscar_escala:
        linhas = []
        for e in range(1, 11):
            r = simular(ops, a.capital, n_ops, a.simulacoes, a.quebra, e, a.semente)
            linhas.append(r)
        if a.json:
            print(json.dumps(linhas, ensure_ascii=False, indent=2))
            return
        print(f"ROBÔ DO ZERO — ATÉ ONDE DÁ PARA AUMENTAR A MÃO (capital {brl(a.capital)}, quebra = perder {a.quebra:.0f}%)")
        print("Escala | Chance de quebra | Capital final típico | Drawdown ruim")
        limite = None
        for r in linhas:
            ok = r["chance_quebra_pct"] < 5
            if ok:
                limite = r["escala"]
            print(f"{r['escala']:>5.0f}x | {num(r['chance_quebra_pct'], 1):>15}% | {brl(r['capital_final_tipico_p50']):>20} | {num(r['drawdown_ruim_pct_p95'], 1):>12}%")
        print()
        if limite:
            print(f"Maior escala com risco de quebra abaixo de 5%: {limite:.0f}x.")
        else:
            print("Nem com 1x o risco fica abaixo de 5%. Reduza a mão ou aumente o capital.")
        return

    r = simular(ops, a.capital, n_ops, a.simulacoes, a.quebra, a.escala, a.semente)
    if a.json:
        print(json.dumps(r, ensure_ascii=False, indent=2))
        return

    def pct(v):
        return num(v, 1) + "%"

    print("ROBÔ DO ZERO — RISCO DE QUEBRA")
    sims = f"{r['simulacoes']:,}".replace(",", ".")
    print(f"{sims} simulações de {r['operacoes_por_simulacao']} operações · capital {brl(a.capital)} · escala {num(a.escala, 1)}x")
    print(f"Quebra = perder {a.quebra:.0f}% do capital\n")
    print(f"Chance de quebrar ............. {pct(r['chance_quebra_pct'])}")
    print(f"Chance de terminar no prejuízo  {pct(r['chance_terminar_no_prejuizo_pct'])}")
    print(f"Capital final — ruim (5%) ..... {brl(r['capital_final_ruim_p5'])}")
    print(f"Capital final — típico ........ {brl(r['capital_final_tipico_p50'])}")
    print(f"Capital final — bom (95%) ..... {brl(r['capital_final_bom_p95'])}")
    print(f"Drawdown típico ............... {pct(r['drawdown_tipico_pct_p50'])}")
    print(f"Drawdown ruim (5% piores) ..... {pct(r['drawdown_ruim_pct_p95'])}")
    print(f"Perdas seguidas — típico / ruim {r['seq_perdas_tipica_p50']:.0f} / {r['seq_perdas_ruim_p95']:.0f}")
    print()
    if r["chance_quebra_pct"] >= 5:
        print("Risco acima de 5%. Rode com --buscar-escala ou reduza a mão.")
    print("Simulação baseada no backtest. Resultado passado não garante resultado futuro.")


if __name__ == "__main__":
    main()
