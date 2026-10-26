"""O Brasil lá fora antes da abertura: EWZ, ADRs e S&P futuro no Yahoo Finance (pré-mercado de Nova York).

Uso: python3 fora.py <saida.json>
Grava {"hora": "07:48", "itens": [{"nome", "simbolo", "ultimo", "ref", "var", "quando"}]}.
`var` é a variação em % do último negócio contra o último fechamento regular (ações/ETF) ou o ajuste anterior (futuro).
Ativo sem negócio hoje fica de fora: nada é inventado.
"""
import datetime as dt
import json
import subprocess
import sys

ATIVOS = [("EWZ", "EWZ · Brasil em NY"), ("PBR", "Petrobras (ADR)"), ("ITUB", "Itaú (ADR)"),
          ("VALE", "Vale (ADR)"), ("ES=F", "S&P 500 futuro")]
BRT = dt.timezone(dt.timedelta(hours=-3))


def cotacao(simbolo):
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{simbolo}?range=1d&interval=5m&includePrePost=true"
    out = subprocess.run(["curl", "-sS", "-m", "30", "-A", "Mozilla/5.0", url], capture_output=True, text=True, check=True).stdout
    r = json.loads(out)["chart"]["result"][0]
    m = r["meta"]
    pontos = [(t, c) for t, c in zip(r.get("timestamp") or [], r["indicators"]["quote"][0].get("close") or []) if c is not None]
    if not pontos:
        return None
    t, ultimo = pontos[-1]
    hoje = dt.datetime.fromtimestamp(t, BRT).date()
    if m.get("instrumentType") == "FUTURE":
        ref = m.get("previousClose") or m.get("chartPreviousClose")
    else:
        # antes do pregão regular de hoje, a referência é o último fechamento (regularMarketPrice ainda é o de ontem)
        reg = dt.datetime.fromtimestamp(m["regularMarketTime"], BRT).date()
        ref = m["regularMarketPrice"] if reg < hoje else (m.get("previousClose") or m.get("chartPreviousClose"))
    if not ref:
        return None
    return {"ultimo": round(ultimo, 2), "ref": round(ref, 2), "var": round((ultimo / ref - 1) * 100, 1),
            "quando": dt.datetime.fromtimestamp(t, BRT).strftime("%H:%M")}


def main():
    itens = []
    for simbolo, nome in ATIVOS:
        try:
            c = cotacao(simbolo)
        except Exception as e:  # um ativo fora do ar não derruba os outros
            print(f"{simbolo}: {e}", file=sys.stderr)
            continue
        if c:
            itens.append({"nome": nome, "simbolo": simbolo, **c})
    hora = max((i["quando"] for i in itens), default="")
    json.dump({"hora": hora, "itens": itens}, open(sys.argv[1], "w"), ensure_ascii=False, indent=1)
    print(json.dumps({"hora": hora, "itens": itens}, ensure_ascii=False))


if __name__ == "__main__":
    main()
