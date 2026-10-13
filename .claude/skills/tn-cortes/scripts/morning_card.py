"""Card "Morning Call" das 08:30: chama pra sala ao vivo com os destaques do dia.

Uso: python3 morning_card.py <dia-qg.json> <historico-qg.json|-> <saida.png>
  dia-qg.json       documento dias/<hoje> do painel do QG (rotina QG1, pronto ~08:13)
  historico-qg.json documento historico/<último pregão> do QG (pontos do WIN p/ o gráfico); "-" = sem gráfico
Tudo sai do que o QG1 já publicou no WhatsApp: nenhum número é inventado aqui.
Imprime JSON com manchete e legenda sugerida. Gera PNG 1080x1350 (converter p/ JPEG antes do Metricool).
"""
import datetime as dt
import html
import json
import os
import re
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(AQUI, "..", "assets")
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
DIAS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"]


def secoes(texto):
    """Quebra a mensagem do QG em {CABEÇALHO: [linhas]}; a 1ª linha (*negrito*) é a manchete."""
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
                return k, sec[k]
    return None, []


def esc(s):
    return html.escape(s, quote=False)


def num_cor(s):
    """Pinta +x% de verde e -x% de vermelho."""
    s = esc(s)
    s = re.sub(r"(\+\d[\d.,]*%)", r'<b class="up">\1</b>', s)
    s = re.sub(r"((?:-|−)\d[\d.,]*%)", r'<b class="dn">\1</b>', s)
    return s


def grafico(hist):
    w = hist.get("WIN") or {}
    ys = [p[1] for p in w.get("pontos") or []]
    if len(ys) < 10:
        return ""
    W, H, LW = 1000, 165, 250
    niv = [("MÁX", w["max"], "#2EE59D", "7 6"), ("FECH", w["fech"], "#F2C14E", ""),
           ("VWAP", w.get("vwap"), "#5AB0FF", ""), ("MÍN", w["min"], "#FF5C5C", "7 6")]
    niv = [n for n in niv if n[1]]
    lo, hi = min(ys + [n[1] for n in niv]), max(ys + [n[1] for n in niv])
    pad = (hi - lo) * 0.08 or 50
    lo, hi = lo - pad, hi + pad
    X = lambda i: 6 + i * (W - LW - 16) / (len(ys) - 1)
    Y = lambda v: 10 + (hi - v) * (H - 20) / (hi - lo)
    fmt = lambda v: f"{v:,.0f}".replace(",", ".")
    d = "M" + " L".join(f"{X(i):.1f},{Y(v):.1f}" for i, v in enumerate(ys))
    g = "".join(f'<line x1="6" x2="{W-LW}" y1="{Y(v):.1f}" y2="{Y(v):.1f}" stroke="{c}" stroke-width="2.5" stroke-dasharray="{ds}"/>'
                for _, v, c, ds in niv)
    prev, rot = -99, ""
    for y, n, v, c in sorted((Y(v), n, v, c) for n, v, c, _ in niv):
        y = max(y, prev + 30)
        prev = y
        rot += f'<text x="{W-LW+12}" y="{y+9:.1f}" fill="{c}" font-size="25" font-weight="800">{n} {fmt(v)}</text>'
    data = dt.date.fromisoformat(w["data"]).strftime("%d/%m") if w.get("data") else ""
    return (f'<div class="graf"><p>{esc(w.get("ticker",""))} · pregão {data} · fonte B3</p>'
            f'<svg width="{W}" height="{H}">{g}<path d="{d}" fill="none" stroke="#2EE59D" stroke-width="3.5" stroke-linejoin="round"/>{rot}</svg></div>')


def main():
    dia = json.load(open(sys.argv[1]))
    dia = dia.get("data", dia) if isinstance(dia.get("data"), dict) else dia
    hist = json.load(open(sys.argv[2])) if sys.argv[2] != "-" else {}
    saida = sys.argv[3]
    msg = next(m for m in dia["mensagens"] if m.get("slot") == "manha")
    manchete, sec = secoes(msg["texto"])
    manchete = re.sub(r"[.!]?\s*Sala abre.*$", "", manchete, flags=re.I).strip()
    hoje = dt.date.fromisoformat(dia["data"])

    _, ontem = pega(sec, "ONTEM", "SEXTA", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA")
    rot_ontem, _ = pega(sec, "ONTEM", "SEXTA", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA")
    _, fora = pega(sec, "LÁ FORA")
    _, agenda = pega(sec, "AGENDA")
    _, cen = pega(sec, "MEU CENÁRIO")
    cen = [l for l in cen if not re.match(r"^Às 17h|^_", l)]

    li = lambda xs, n: "".join(f"<li>{num_cor(x)}</li>" for x in xs[:n])
    ag = ""
    for a in agenda[:4]:
        forte = "🚨" in a
        a = re.sub(r"\s*🚨+", "", a)
        a = re.sub(r"\s*\(horário eu confirmo na sala\)", "", a)
        m = re.match(r"^(\d{1,2}h\d{0,2})\s+(.*)$", a)
        hora, ev = (m.group(1), m.group(2)) if m else ("", a)
        ag += f'<li class="{"forte" if forte else ""}"><span>{esc(hora)}</span>{esc(ev)}</li>'

    css = open(os.path.join(AQUI, "morning_card.css")).read()
    corpo = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:Inter;src:url(file://{os.path.abspath(ASSETS)}/inter-latin-wght-normal.woff2)}}{css}</style></head><body>
<header><span class="tag"><img src="file://{os.path.abspath(ASSETS)}/logo-tn.jpg">MORNING CALL · {DIAS[hoje.weekday()]} {hoje.strftime('%d.%m')}</span>
<span class="vivo">● AO VIVO 8H30</span></header>
<h1>{esc(manchete)}</h1>
<div class="meio">
  <div class="foto"><img src="file://{os.path.abspath(ASSETS)}/foto-mc.jpg"><span>Rodrigo Cohen<br><i>analisa ao vivo</i></span></div>
  <div class="col">
    <div class="box"><h2>{esc((rot_ontem or 'ONTEM').title())}</h2><ul>{li(ontem, 2)}</ul></div>
    <div class="box"><h2>Lá fora</h2><ul>{li(fora, 4)}</ul></div>
  </div>
</div>
<div class="box ag"><h2>Agenda de hoje</h2><ul>{ag}</ul></div>
{grafico(hist)}
{'<div class="cen"><b>Meu cenário:</b> ' + esc(' '.join(cen)) + '</div>' if cen else ''}
<footer><div class="cta">Entra na sala ao vivo · link na bio</div><p>Conteúdo educacional. Não é recomendação.</p></footer>
</body></html>"""
    tmp = saida + ".html"
    open(tmp, "w").write(corpo)
    subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files",
                    "--hide-scrollbars", "--window-size=1080,1450", f"--screenshot={saida}.full.png", "file://" + os.path.abspath(tmp)],
                   check=True, capture_output=True, timeout=90)
    # o headless corta ~90 px do fim da janela: renderiza mais alto e recorta 1080x1350
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{saida}.full.png", "-vf", "crop=1080:1350:0:0", saida],
                   check=True, timeout=60)
    os.remove(f"{saida}.full.png")
    legenda = (f"{manchete}.\n"
               f"Os níveis, a agenda e o meu cenário do dia estão no card. O resto eu analiso ao vivo, a partir das 8h30.\n"
               f"Link da sala na bio. Conteúdo educacional, não é recomendação.")
    print(json.dumps({"manchete": manchete, "legenda": legenda, "png": saida}, ensure_ascii=False))


if __name__ == "__main__":
    main()
