"""Card "Panorama 8h30" da @tradernationoficial: panorama do mercado + probabilidade estatística do dia.

Uso: python3 panorama.py <dia-qg.json> <historico-qg.json|-> <ibov-yahoo.json> <saida.png>
  dia-qg.json        dias/<hoje> do painel do QG (rotina QG1, ~08:13): manchete, lá fora, agenda
  historico-qg.json  historico/<último pregão> do QG: fechamento e VWAP do WIN (B3); "-" = usa só o Ibov
  ibov-yahoo.json    https://query1.finance.yahoo.com/v8/finance/chart/%5EBVSP?range=10y&interval=1d (curl -A 'Mozilla/5.0')

A probabilidade NÃO é opinião: é a faixa de 1 desvio-padrão da volatilidade dos últimos 20 pregões do Ibov,
aplicada ao fechamento do último pregão. Em 10 anos de Ibov esse intervalo conteve o fechamento do dia seguinte
em ~68% das vezes (o script recalcula e imprime a taxa real de acerto). Nada é inventado: sem dado, o bloco some.
"""
import datetime as dt
import html
import json
import os
import re
import statistics as st
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.abspath(os.path.join(AQUI, "..", "assets"))
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
DIAS = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"]
MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"]


def doc(caminho):
    if caminho == "-":
        return {}
    d = json.load(open(caminho))
    return d["data"] if isinstance(d.get("data"), dict) else d


def secoes(texto):
    linhas = [l.strip() for l in texto.splitlines()]
    manchete = re.sub(r"^\*|\*$", "", linhas[0]).strip()
    out, atual = {}, None
    for l in linhas[1:]:
        m = re.match(r"^([A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 ]{3,40}):\s*$", l)
        if m:
            atual = m.group(1).strip()
            out[atual] = []
        elif atual and l:
            out[atual].append(l)
    return manchete, out


def pega(sec, *nomes):
    for n in nomes:
        for k in sec:
            if k.startswith(n):
                return sec[k]
    return []


br = lambda v: f"{v:,.0f}".replace(",", ".")
pct = lambda v: f"{v:+.1f}%".replace(".", ",").replace("-", "−")


def estatistica(yahoo, hoje):
    """Volatilidade de 20 pregões do Ibov (até o último pregão antes de hoje) e a taxa histórica de acerto da faixa de 1σ."""
    r = yahoo["chart"]["result"][0]
    q = r["indicators"]["quote"][0]
    rows = [(dt.datetime.fromtimestamp(t, dt.timezone(dt.timedelta(hours=-3))).date(), c)
            for t, c in zip(r["timestamp"], q["close"]) if c]
    rows = [x for x in rows if x[0] < hoje]
    ret = [rows[i][1] / rows[i - 1][1] - 1 for i in range(1, len(rows))]
    if len(ret) < 300:
        return None
    hit = n = 0
    for i in range(20, len(ret)):
        s = st.pstdev(ret[i - 20:i])
        hit += abs(ret[i]) <= s
        n += 1
    s20 = st.pstdev(ret[-20:])
    s250 = st.pstdev(ret[-250:])
    termo = "ALTA" if s20 > 1.25 * s250 else "BAIXA" if s20 < 0.8 * s250 else "NORMAL"
    return {"sigma20": s20, "sigma250": s250, "acerto": hit / n, "amostra": n, "termometro": termo,
            "ultimo": rows[-1][0].isoformat()}


def main():
    hoje_doc, hist = doc(sys.argv[1]), doc(sys.argv[2])
    yahoo = json.load(open(sys.argv[3]))
    saida = sys.argv[4]
    hoje = dt.date.fromisoformat(hoje_doc["data"])
    msg = next(m for m in hoje_doc["mensagens"] if m.get("slot") == "manha")
    manchete, sec = secoes(msg["texto"])
    manchete = re.sub(r"[.!]?\s*Sala abre.*$", "", manchete, flags=re.I).strip()

    fora = []
    for l in pega(sec, "LÁ FORA")[:4]:
        m = re.match(r"^(.*?)\s+([+\-−]\d[\d.,]*%)(.*)$", l)
        if m:
            v = m.group(2)
            fora.append((m.group(1).strip(), v, "dn" if v[0] in "-−" else "up"))
    agenda = []
    for a in pega(sec, "AGENDA")[:4]:
        forte = "🚨" in a
        a = re.sub(r"\s*🚨+|\s*\(horário eu confirmo na sala\)", "", a).strip()
        m = re.match(r"^(\d{1,2}h\d{0,2})\s+(.*)$", a)
        agenda.append((m.group(1) if m else "hoje", m.group(2) if m else a, forte))

    est = estatistica(yahoo, hoje)
    w = (hist or {}).get("WIN") or {}
    prob = ""
    if est and w.get("fech"):
        ref, s = w["fech"], est["sigma20"]
        lo, hi = round(ref * (1 - s) / 5) * 5, round(ref * (1 + s) / 5) * 5
        cor = {"ALTA": "#E5322D", "NORMAL": "#F2A900", "BAIXA": "#12B76A"}[est["termometro"]]
        prob = f"""<div class="prob">
  <div class="ph"><span>PROBABILIDADE DO DIA</span><b style="background:{cor}">VOLATILIDADE {est['termometro']}</b></div>
  <p class="big">{round(est['acerto']*100)}% de chance de o WIN fechar entre <em>{br(lo)}</em> e <em>{br(hi)}</em></p>
  <div class="bar"><i></i><span class="l">{br(lo)}</span><span class="m">{br(ref)}<small>fech {dt.date.fromisoformat(w['data']).strftime('%d/%m')}</small></span><span class="r">{br(hi)}</span></div>
  <p class="nota">Volatilidade dos últimos 20 pregões: {str(round(s*100,1)).replace('.',',')}% ao dia (no ano: {str(round(est['sigma250']*100,1)).replace('.',',')}%). Estatística de {est['amostra']} pregões do Ibov, não palpite.</p>
</div>"""

    chips = "".join(f'<span class="chip {c}">{html.escape(n)} <b>{html.escape(v.replace("-", "−"))}</b></span>' for n, v, c in fora)
    ag = "".join(f'<li class="{"forte" if f else ""}"><span>{html.escape(h)}</span>{html.escape(e)}</li>' for h, e, f in agenda)
    data_txt = f"{DIAS[hoje.weekday()]}, {hoje.day:02d} {MESES[hoje.month-1]}"
    page = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:I;src:url(file://{ASSETS}/inter-latin-wght-normal.woff2) format('woff2');font-weight:100 900}}
{open(os.path.join(AQUI, 'panorama.css')).read()}</style></head><body>
<section class="topo">
  <div class="txt"><span class="kicker">PANORAMA 8H30 · {data_txt}</span><h1>{html.escape(manchete)}</h1></div>
  <div class="foto"><img src="file://{ASSETS}/foto-mc.jpg"><span class="vivo">● AO VIVO 8H30</span></div>
</section>
<section class="card">
  {'<h2>Lá fora</h2><div class="chips">' + chips + '</div>' if chips else ''}
  {'<h2>Agenda de hoje</h2><ul class="ag">' + ag + '</ul>' if ag else ''}
  {prob}
</section>
<footer><div class="cta"><img src="file://{ASSETS}/logo-tn.jpg">Sala ao vivo com Rodrigo Cohen · link na bio</div>
<p>Conteúdo educacional. Não é recomendação. Dados: B3 e Yahoo Finance.</p></footer>
</body></html>"""
    tmp = saida + ".html"
    open(tmp, "w").write(page)
    subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files",
                    "--hide-scrollbars", "--window-size=1080,1450", f"--screenshot={saida}.full.png", "file://" + os.path.abspath(tmp)],
                   check=True, capture_output=True, timeout=90)
    # o headless corta ~90 px do fim da janela: renderiza mais alto e recorta 1080x1350
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{saida}.full.png", "-vf", "crop=1080:1350:0:0", saida],
                   check=True, timeout=60)
    os.remove(f"{saida}.full.png")
    legenda = (f"{manchete}.\n"
               f"Panorama do dia antes da abertura: o que mexe lá fora, a agenda e a faixa estatística do WIN.\n"
               f"A leitura completa é ao vivo, às 8h30. Link na bio.\n"
               f"Conteúdo educacional, não é recomendação.")
    print(json.dumps({"manchete": manchete, "legenda": legenda, "estatistica": est, "png": saida}, ensure_ascii=False))


if __name__ == "__main__":
    main()
