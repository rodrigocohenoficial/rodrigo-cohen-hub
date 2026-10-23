#!/usr/bin/env python3
"""Robô do Zero — métricas de backtest.

Lê o resultado de cada operação (um número por linha, ou uma coluna de CSV)
e calcula as métricas que importam, com sinais de alerta.

Exemplos:
  python metricas.py operacoes.txt --capital 5000
  python metricas.py operacoes.txt --valor-ponto 0.2 --contratos 1 --custo 1.0
  python metricas.py relatorio.csv --coluna 7 --sep ";"
"""
import argparse
import json
import re
import sys


def ler_numero(texto, decimal_virgula):
    t = texto.strip().replace("R$", "").replace(" ", "").replace(" ", "")
    if not t:
        return None
    negativo = t.startswith("(") and t.endswith(")")
    t = t.strip("()")
    if decimal_virgula:
        t = t.replace(".", "").replace(",", ".")
    else:
        t = t.replace(",", "")
    if not re.fullmatch(r"[+-]?\d+(\.\d+)?", t):
        return None
    valor = float(t)
    return -valor if negativo else valor


def ler_operacoes(caminho, coluna=None, sep=None, decimal="auto"):
    with open(caminho, encoding="utf-8-sig", errors="replace") as f:
        linhas = [l.rstrip("\n\r") for l in f if l.strip()]
    if not linhas:
        sys.exit("Arquivo vazio.")
    if coluna is not None:
        if sep is None:
            sep = ";" if ";" in linhas[0] else ("\t" if "\t" in linhas[0] else ",")
        campos = []
        for l in linhas:
            partes = l.split(sep)
            campos.append(partes[coluna - 1] if len(partes) >= coluna else "")
    else:
        campos = linhas
    if decimal == "auto":
        decimal_virgula = any("," in c for c in campos)
    else:
        decimal_virgula = decimal == "virgula"
    valores, ignoradas = [], 0
    for c in campos:
        v = ler_numero(c, decimal_virgula)
        if v is None:
            ignoradas += 1
        else:
            valores.append(v)
    return valores, ignoradas


def calcular(ops, capital=None, dias=None):
    n = len(ops)
    ganhos = [x for x in ops if x > 0]
    perdas = [x for x in ops if x < 0]
    soma_g = sum(ganhos)
    soma_p = -sum(perdas)
    total = sum(ops)
    ganho_medio = soma_g / len(ganhos) if ganhos else 0.0
    perda_media = soma_p / len(perdas) if perdas else 0.0

    pico = 0.0
    acumulado = 0.0
    dd_max = 0.0
    pico_no_dd = 0.0
    for x in ops:
        acumulado += x
        if acumulado > pico:
            pico = acumulado
        if pico - acumulado > dd_max:
            dd_max = pico - acumulado
            pico_no_dd = pico

    seq = seq_max = 0
    for x in ops:
        if x < 0:
            seq += 1
            seq_max = max(seq_max, seq)
        else:
            seq = 0

    top5 = sum(sorted(ganhos, reverse=True)[:5])
    concentracao = (top5 / total * 100) if total > 0 else None

    r = {
        "operacoes": n,
        "taxa_acerto_pct": len(ganhos) / n * 100 if n else 0.0,
        "ganho_medio": ganho_medio,
        "perda_media": perda_media,
        "payoff": (ganho_medio / perda_media) if perda_media else None,
        "fator_lucro": (soma_g / soma_p) if soma_p else None,
        "expectativa_por_operacao": total / n if n else 0.0,
        "resultado_liquido": total,
        "drawdown_maximo": dd_max,
        "maior_sequencia_perdas": seq_max,
        "concentracao_top5_pct": concentracao,
        "fator_recuperacao": (total / dd_max) if dd_max else None,
    }
    if capital:
        r["capital"] = capital
        r["retorno_sobre_capital_pct"] = total / capital * 100
        r["drawdown_maximo_pct_capital"] = dd_max / (capital + pico_no_dd) * 100
    if dias:
        r["pregoes"] = dias
        r["operacoes_por_dia"] = n / dias
    return r


def alertas(r):
    a = []
    n = r["operacoes"]
    if n < 100:
        a.append(f"Só {n} operações. Amostra pequena: qualquer conclusão é fraca.")
    elif n < 200:
        a.append(f"{n} operações. Dá para olhar, mas o mínimo para levar a sério é 200.")
    if r["expectativa_por_operacao"] <= 0:
        a.append("Expectativa zero ou negativa: o robô perde dinheiro em média.")
    fl = r["fator_lucro"]
    if fl is not None and 0 < fl < 1.2 and r["expectativa_por_operacao"] > 0:
        a.append(f"Fator de lucro de {num(fl)}. Margem fina: custo e slippage reais podem zerar.")
    if fl is not None and fl > 3:
        a.append(f"Fator de lucro de {num(fl)}. Bom demais: confira se os parâmetros não foram ajustados ao passado.")
    if fl is None and r["operacoes"] > 0:
        a.append("Nenhuma operação com perda. Isso não existe no mundo real: confira os dados ou o stop.")
    c = r["concentracao_top5_pct"]
    if c is not None and c > 50:
        a.append(f"Os 5 melhores trades fazem {c:.0f}% do lucro. O resultado depende de poucos dias.")
    if r.get("drawdown_maximo_pct_capital", 0) > 30:
        a.append(f"Drawdown de {r['drawdown_maximo_pct_capital']:.0f}% do capital. Pesado para quase todo mundo aguentar.")
    if r["maior_sequencia_perdas"] >= 8:
        a.append(f"Sequência de {r['maior_sequencia_perdas']} perdas seguidas no backtest. No real pode vir maior.")
    return a


def num(v, casas=2):
    return f"{v:.{casas}f}".replace(".", ",")


def brl(v):
    s = f"{abs(v):,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return ("-R$ " if v < 0 else "R$ ") + s


def main():
    p = argparse.ArgumentParser(description="Métricas de backtest do Robô do Zero.")
    p.add_argument("arquivo", help="arquivo com um resultado por linha (ou CSV com --coluna)")
    p.add_argument("--coluna", type=int, help="número da coluna no CSV (começa em 1)")
    p.add_argument("--sep", help="separador do CSV (padrão: detecta ; tab ou ,)")
    p.add_argument("--decimal", choices=["auto", "virgula", "ponto"], default="auto")
    p.add_argument("--valor-ponto", type=float, help="R$ por ponto por contrato (WIN 0.2, WDO 10). Use se os resultados estão em pontos")
    p.add_argument("--contratos", type=float, default=1.0)
    p.add_argument("--custo", type=float, default=0.0, help="custo por operação completa em R$")
    p.add_argument("--slippage-pontos", type=float, default=0.0, help="slippage por operação em pontos (exige --valor-ponto)")
    p.add_argument("--capital", type=float)
    p.add_argument("--dias", type=int, help="pregões cobertos pelo backtest")
    p.add_argument("--json", action="store_true", help="saída em JSON")
    a = p.parse_args()

    ops, ignoradas = ler_operacoes(a.arquivo, a.coluna, a.sep, a.decimal)
    if not ops:
        sys.exit("Nenhum número encontrado no arquivo.")
    if a.slippage_pontos and not a.valor_ponto:
        sys.exit("--slippage-pontos exige --valor-ponto.")
    if a.valor_ponto:
        ops = [(x - a.slippage_pontos) * a.valor_ponto * a.contratos for x in ops]
    ops = [x - a.custo for x in ops]

    r = calcular(ops, a.capital, a.dias)
    r["linhas_ignoradas"] = ignoradas
    r["alertas"] = alertas(r)

    if a.json:
        print(json.dumps(r, ensure_ascii=False, indent=2))
        return

    def fmt(v, casas=2):
        return "—" if v is None else f"{v:.{casas}f}".replace(".", ",")

    print("ROBÔ DO ZERO — MÉTRICAS DO BACKTEST")
    print(f"Operações ............... {r['operacoes']}" + (f"  ({ignoradas} linhas ignoradas)" if ignoradas else ""))
    print(f"Taxa de acerto .......... {fmt(r['taxa_acerto_pct'], 1)}%")
    print(f"Ganho médio ............. {brl(r['ganho_medio'])}")
    print(f"Perda média ............. {brl(r['perda_media'])}")
    print(f"Payoff .................. {fmt(r['payoff'])}")
    print(f"Fator de lucro .......... {fmt(r['fator_lucro'])}")
    print(f"Expectativa/operação .... {brl(r['expectativa_por_operacao'])}")
    print(f"Resultado líquido ....... {brl(r['resultado_liquido'])}")
    print(f"Drawdown máximo ......... {brl(r['drawdown_maximo'])}" +
          (f"  ({fmt(r['drawdown_maximo_pct_capital'], 1)}% do capital no pico)" if a.capital else ""))
    print(f"Fator de recuperação .... {fmt(r['fator_recuperacao'])}")
    print(f"Maior sequência de perdas {r['maior_sequencia_perdas']}")
    print(f"Concentração (top 5) .... {fmt(r['concentracao_top5_pct'], 0)}%")
    if a.capital:
        print(f"Retorno sobre o capital . {fmt(r['retorno_sobre_capital_pct'], 1)}%")
    if a.dias:
        print(f"Operações por pregão .... {fmt(r['operacoes_por_dia'])}")
    print()
    if r["alertas"]:
        print("SINAIS DE ALERTA")
        for x in r["alertas"]:
            print(f"- {x}")
    else:
        print("Nenhum sinal de alerta automático. Ainda faltam o teste fora da amostra e o risco de quebra.")


if __name__ == "__main__":
    main()
