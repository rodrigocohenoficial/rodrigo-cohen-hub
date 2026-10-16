"""Carrossel "Panorama 8h30" da @tradernationoficial (7 slides, visual escuro do card Panorama).

Uso: python3 panorama_carrossel.py <dia-qg.json> <historico-qg.json> <ibov-yahoo.json> <pasta-saida> [fluxo.json|-]
  dia-qg.json        dias/<hoje> do painel do QG (mensagem "manha": manchete, ontem, juros, lá fora, agenda, antes de clicar)
  historico-qg.json  historico/<último pregão> do QG: WIN e WDO com máx, mín, fech, abertura, VWAP, POC, VAH, VAL, pontos
  ibov-yahoo.json    https://query1.finance.yahoo.com/v8/finance/chart/%5EBVSP?range=10y&interval=1d (curl -A 'Mozilla/5.0')
  fluxo.json         opcional: {"data": "AAAA-MM-DD", "fonte": "B3", "linhas": [{"nome": "Estrangeiro", "valor": "+R$ 1,2 bi"}, ...]}
                     sem arquivo, o slide do fluxo sai marcado como "fonte em validação" e sem número

Slides: 1 gancho (estatística de sequência do Ibov ou a manchete do QG) · 2 rehook (rompimento da máx/mín de ontem)
        3 mapa do WIN · 4 mapa do WDO · 5 lá fora e juros · 6 fluxo · 7 agenda + sala ao vivo.
Toda probabilidade sai de 10 anos de Ibovespa (Yahoo), recalculada a cada rodada. Nada é inventado: sem dado, o bloco some.
"""
import datetime as dt
import html
import json
import os
import re
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.abspath(os.path.join(AQUI, "..", "assets"))
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
DIAS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"]
esc = lambda s: html.escape(str(s), quote=False)
br = lambda v: f"{v:,.0f}".replace(",", ".")
br1 = lambda v: f"{v:,.1f}".replace(",", "X").replace(".", ",").replace("X", ".")


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


def ibov(yahoo, hoje):
    """Estatísticas práticas de 10 anos de Ibov, só com pregões anteriores a hoje."""
    r = yahoo["chart"]["result"][0]
    q = r["indicators"]["quote"][0]
    tz = dt.timezone(dt.timedelta(hours=-3))
    rows = [(dt.datetime.fromtimestamp(t, tz).date(), h, l, c)
            for t, h, l, c in zip(r["timestamp"], q["high"], q["low"], q["close"]) if None not in (h, l, c) and h > l]
    rows = [x for x in rows if x[0] < hoje]
    n = len(rows) - 1
    hi = lo = ambos = 0
    for i in range(1, len(rows)):
        a, b = rows[i][1] > rows[i - 1][1], rows[i][2] < rows[i - 1][2]
        hi, lo, ambos = hi + a, lo + b, ambos + (a and b)
    # sequência atual de fechamentos na mesma direção
    seq, dirc = 0, 0
    for i in range(len(rows) - 1, 0, -1):
        d = 1 if rows[i][3] > rows[i - 1][3] else -1
        if dirc in (0, d):
            dirc, seq = d, seq + 1
        else:
            break
    casos = sobe = 0
    if seq >= 3:
        for i in range(seq + 1, len(rows)):
            if all((rows[i - k][3] > rows[i - k - 1][3]) == (dirc > 0) for k in range(1, seq + 1)):
                casos += 1
                sobe += rows[i][3] > rows[i - 1][3]
    amp20 = sum((rows[i][1] - rows[i][2]) / rows[i - 1][3] for i in range(len(rows) - 20, len(rows))) / 20
    return {"pregoes": n, "rompe_um": (hi + lo - ambos) / n, "rompe_ambos": ambos / n, "amp20": amp20,
            "seq": seq, "dir": dirc, "casos": casos, "sobe": (sobe / casos) if casos else None,
            "ultimo": rows[-1][0].isoformat()}


def mapa_svg(w, W=920, H=540):
    """Pregão de ontem com os níveis do mapa da sala: máx, mín, VWAP, POC, VAH e VAL."""
    ys = [p[1] for p in w.get("pontos") or []]
    if len(ys) < 10:
        return ""
    niv = [("MÁX", w.get("max"), "#2EE59D", "6 6"), ("VAH", w.get("vah"), "#B98CFF", "3 6"),
           ("POC", w.get("poc"), "#F2C14E", ""), ("VWAP", w.get("vwap"), "#5AB0FF", "6 6"),
           ("VAL", w.get("val"), "#B98CFF", "3 6"), ("MÍN", w.get("min"), "#FF5C5C", "6 6")]
    niv = [x for x in niv if x[1]]
    top = max(ys + [x[1] for x in niv])
    bot = min(ys + [x[1] for x in niv])
    pad = (top - bot) * 0.06
    top, bot = top + pad, bot - pad
    xr = W - 250  # coluna da direita é dos rótulos
    X = lambda i: 8 + i * (xr - 16) / (len(ys) - 1)
    Y = lambda v: 10 + (top - v) * (H - 20) / (top - bot)
    d = "M" + " L".join(f"{X(i):.1f},{Y(v):.1f}" for i, v in enumerate(ys))
    cor = "#2EE59D" if w["fech"] >= w.get("ref_anterior", w["fech"]) else "#FF5C5C"
    area = d + f" L{X(len(ys)-1):.1f},{H} L{X(0):.1f},{H} Z"
    linhas, rot, prev = "", "", -99
    for y, n, v, c, ds in sorted((Y(v), n, v, c, ds) for n, v, c, ds in niv):
        linhas += f'<line x1="8" x2="{xr:.0f}" y1="{y:.1f}" y2="{y:.1f}" stroke="{c}" stroke-width="2.5" stroke-dasharray="{ds}" opacity=".9"/>'
        ty = max(y + 8, prev + 34)
        prev = ty
        rot += (f'<line x1="{xr:.0f}" x2="{xr+14:.0f}" y1="{y:.1f}" y2="{ty-8:.1f}" stroke="{c}" stroke-width="2"/>'
                f'<text x="{xr+20:.0f}" y="{ty:.1f}" fill="{c}" font-size="26" font-weight="900">{n} {br(v)}</text>')
    return (f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1">'
            f'<stop offset="0" stop-color="{cor}" stop-opacity=".30"/><stop offset="1" stop-color="{cor}" stop-opacity="0"/></linearGradient></defs>'
            f'{linhas}<path d="{area}" fill="url(#g)"/><path d="{d}" fill="none" stroke="{cor}" stroke-width="4" stroke-linejoin="round"/>{rot}</svg>')


def num(v, casas=0):
    return br(v) if casas == 0 else f"{v:,.{casas}f}".replace(",", "X").replace(".", ",").replace("X", ".")


def slide_mapa(w, nome, casas, n, total):
    if not w.get("fech"):
        return None
    dia = dt.date.fromisoformat(w["data"]).strftime("%d/%m")
    var = w["fech"] - w.get("ref_anterior", w["fech"])
    cls = "up" if var >= 0 else "dn"
    sinal = "+" if var >= 0 else "−"
    dados = [("Abertura", num(w["abertura"], casas)) if w.get("abertura") else None,
             ("Fechamento", f'{num(w["fech"], casas)} <b class="{cls}">{sinal}{num(abs(var), casas)}</b>'),
             ("Amplitude", f'{num(w["amplitude"], casas)} pts') if w.get("amplitude") else None,
             ("Tempo acima da VWAP", f'{w["pct_tempo_acima_vwap"]}%') if w.get("pct_tempo_acima_vwap") is not None else None]
    chips = "".join(f'<span class="dado"><i>{esc(a)}</i>{b}</span>' for a, b in [x for x in dados if x])
    return f"""<span class="tag">{esc(nome)} · MAPA DO DIA</span>
<h1 class="h1m">Os níveis de ontem do <mark>{esc(w.get("ticker", nome))}</mark></h1>
<div class="painel mapa"><p class="gt">pregão {dia} · fonte B3</p>{mapa_svg(w)}</div>
<div class="dados">{chips}</div>
<p class="glos"><b>POC</b> preço mais negociado · <b>VAH/VAL</b> limites da área de valor (70% do volume) · <b>VWAP</b> preço médio ponderado</p>
<span class="pag">{n}/{total}</span>"""


def main():
    hoje_doc, hist = doc(sys.argv[1]), doc(sys.argv[2])
    yahoo = json.load(open(sys.argv[3]))
    pasta = sys.argv[4]
    fluxo = doc(sys.argv[5]) if len(sys.argv) > 5 else {}
    os.makedirs(pasta, exist_ok=True)
    hoje = dt.date.fromisoformat(hoje_doc["data"])
    msg = next(m for m in hoje_doc["mensagens"] if m.get("slot") == "manha")
    manchete, sec = secoes(msg["texto"])
    manchete = re.sub(r"[.!]?\s*Sala abre.*$", "", manchete, flags=re.I).strip()
    data_txt = f"{DIAS[hoje.weekday()]} {hoje.strftime('%d/%m')}"
    est = ibov(yahoo, hoje)
    win, wdo = hist.get("WIN") or {}, hist.get("WDO") or {}
    total = 7

    # 1. Gancho: sequência do Ibov (3+ dias na mesma direção) com a estatística real; senão, a manchete do QG
    if est["seq"] >= 3 and est["sobe"] is not None:
        verbo = "caiu" if est["dir"] < 0 else "subiu"
        p = round(est["sobe"] * 100)
        gancho = f'O Ibov {verbo} <mark>{est["seq"]} dias seguidos.</mark>'
        sub = (f'Em 10 anos, depois de {est["seq"]} {"quedas" if est["dir"] < 0 else "altas"} seguidas, '
               f'o dia seguinte subiu em <b>{p}%</b> das vezes. {"Quase cara ou coroa." if 45 <= p <= 55 else ""}')
        rodape = f'{est["casos"]} casos desde 2016 · base: Ibovespa'
    else:
        gancho, sub, rodape = esc(manchete) + ".", "O que mexe no mercado antes da abertura.", ""
    s1 = f"""<span class="tag"><img src="file://{ASSETS}/logo-tn.jpg">PANORAMA 8H30 · {data_txt}</span>
<h1 class="hook">{gancho}</h1>
<p class="sub">{sub}</p>
<div class="foto f1"><img src="file://{ASSETS}/foto-mc.jpg"><span class="vivo">● AO VIVO 8H30</span></div>
<p class="rod">{esc(rodape)}</p>
<span class="arrasta">ARRASTA →</span>"""

    # 2. Rehook: rompimento da máxima ou mínima de ontem, com os níveis do WIN
    r1, r2 = round(est["rompe_um"] * 100), round(est["rompe_ambos"] * 100)
    niveis = ""
    if win.get("max"):
        niveis = (f'<div class="duo"><div class="lvl up"><i>MÁXIMA DE ONTEM</i>{br(win["max"])}</div>'
                  f'<div class="lvl dn"><i>MÍNIMA DE ONTEM</i>{br(win["min"])}</div></div>'
                  f'<p class="q">Qual dos dois o {esc(win.get("ticker", "WIN"))} rompe primeiro?</p>')
    s2 = f"""<span class="tag">O NÚMERO DO DIA</span>
<h1 class="h1m">Mas tem um número que acerta quase sempre.</h1>
<div class="painel big"><p class="mega">{r1}%</p>
<p class="exp">dos pregões rompem a <b class="up">máxima</b> ou a <b class="dn">mínima</b> do dia anterior. Só <b>{r2}%</b> rompem as duas.</p></div>
{niveis}
<p class="rod">{est["pregoes"]} pregões do Ibovespa (10 anos, Yahoo Finance). Estatística, não é palpite.</p>
<span class="pag">2/{total}</span>"""

    s3 = slide_mapa(win, "WIN", 0, 3, total)
    s4 = slide_mapa(wdo, "WDO", 1, 4, total)

    # 5. Lá fora e juros (texto do QG)
    fora = []
    for l in pega(sec, "LÁ FORA")[:4]:
        m = re.match(r"^(.*?)\s+([+\-−]\d[\d.,]*%)(.*)$", l)
        if m:
            v = m.group(2).replace("-", "−")
            fora.append(f'<span class="chip">{esc(m.group(1))} <b class="{"dn" if v[0]=="−" else "up"}">{esc(v)}</b>{esc(m.group(3))}</span>')
        else:
            fora.append(f'<span class="chip">{esc(l)}</span>')
    juros = "".join(f"<p>{esc(l)}</p>" for l in pega(sec, "JUROS")[:2])
    ontem = "".join(f"<p>{esc(l)}</p>" for l in pega(sec, "ONTEM", "SEXTA", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA")[:2])
    s5 = f"""<span class="tag">LÁ FORA E JUROS</span>
<h1 class="h1m">{esc(manchete)}.</h1>
<div class="painel lista"><h2>Ontem aqui</h2>{ontem}</div>
<div class="chips">{"".join(fora)}</div>
<div class="painel lista j"><h2>Juros</h2>{juros}</div>
<span class="pag">5/{total}</span>"""

    # 6. Fluxo dos investidores (B3). Sem fonte confirmada, o slide vira "quanto o mercado anda" (decisão do Rodrigo em 16/10)
    if fluxo.get("linhas"):
        linhas = "".join(f'<div class="fx"><i>{esc(x["nome"])}</i><b class="{"dn" if str(x["valor"]).strip()[0] in "-−" else "up"}">{esc(x["valor"])}</b></div>'
                         for x in fluxo["linhas"])
        nota = f'Fonte: {esc(fluxo.get("fonte", "B3"))} · dado de {dt.date.fromisoformat(fluxo["data"]).strftime("%d/%m")}'
        s6 = f"""<span class="tag">FLUXO DOS INVESTIDORES</span>
<h1 class="h1m">Quem comprou e quem vendeu.</h1>
<div class="painel fluxo">{linhas}</div>
<p class="rod">{nota}</p>
<span class="pag">6/{total}</span>"""
    else:
        a = est["amp20"]
        pts = f'≈ {br(round(a * win["fech"] / 5) * 5)} pts no {esc(win.get("ticker", "WIN"))}' if win.get("fech") else ""
        ontem = (f'<div class="fx"><i>Ontem no {esc(win.get("ticker", "WIN"))}</i><b>{br(win["amplitude"])} pts</b></div>'
                 if win.get("amplitude") else "")
        ante = (f'<div class="fx"><i>Anteontem</i><b>{br(win["amplitude_ant"])} pts</b></div>' if win.get("amplitude_ant") else "")
        s6 = f"""<span class="tag">QUANTO O MERCADO ANDA</span>
<h1 class="h1m">Da máxima à mínima, o Ibov anda em média:</h1>
<div class="painel big"><p class="mega">{str(round(a * 100, 1)).replace(".", ",")}%</p>
<p class="exp">por dia nos últimos 20 pregões. <b>{pts}</b></p></div>
<div class="painel fluxo f2">{ontem}{ante}</div>
<p class="rod">Amplitude = distância entre a máxima e a mínima do dia. Base: Ibovespa (Yahoo Finance) e WIN (B3).</p>
<span class="pag">6/{total}</span>"""

    # 7. Agenda + antes de clicar + sala ao vivo
    ag = ""
    for a in pega(sec, "AGENDA")[:4]:
        forte = "🚨" in a
        a = re.sub(r"\s*🚨+|\s*\(horário eu confirmo na sala\)", "", a).strip()
        m = re.match(r"^(\d{1,2}h\d{0,2})\s+(.*)$", a)
        ag += f'<li class="{"forte" if forte else ""}"><span>{esc(m.group(1) if m else "hoje")}</span>{esc(m.group(2) if m else a)}</li>'
    antes = "".join(f"<li>{esc(re.sub(r'^\d+\.\s*', '', l))}</li>" for l in pega(sec, "ANTES DE CLICAR")[:3])
    s7 = f"""<span class="tag">AGENDA E SALA AO VIVO</span>
<div class="painel agenda7"><h2>Agenda de hoje</h2><ul>{ag}</ul></div>
<div class="painel antes"><h2>Antes de clicar</h2><ol>{antes}</ol></div>
<div class="foto f7"><img src="file://{ASSETS}/foto-mc.jpg"><span class="vivo">● AO VIVO 8H30</span></div>
<div class="cta">Sala ao vivo com Rodrigo Cohen · link na bio</div>
<p class="disc">Conteúdo educacional. Não é recomendação. Dados: B3, QG do Cohen e Yahoo Finance.</p>"""

    css = open(os.path.join(AQUI, "panorama.css")).read() + open(os.path.join(AQUI, "panorama_carrossel.css")).read()
    saidas = []
    for i, corpo in enumerate([s1, s2, s3, s4, s5, s6, s7], 1):
        if not corpo:
            continue
        page = (f'<!doctype html><html><head><meta charset="utf-8"><style>@font-face{{font-family:I;src:url(file://{ASSETS}/inter-latin-wght-normal.woff2) format("woff2");font-weight:100 900}}'
                f'{css}</style></head><body><div class="glow"></div>{corpo}</body></html>')
        base = os.path.join(pasta, f"{i:02d}")
        open(base + ".html", "w").write(page)
        subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files", "--hide-scrollbars",
                        "--window-size=1080,1450", f"--screenshot={base}.full.png", "file://" + os.path.abspath(base + ".html")],
                       check=True, capture_output=True, timeout=90)
        # o headless corta ~90 px do fim da janela: renderiza mais alto e recorta 1080x1350
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", base + ".full.png", "-vf", "crop=1080:1350:0:0", base + ".png"],
                       check=True, timeout=60)
        os.remove(base + ".full.png")
        saidas.append(base + ".png")
    gancho_txt = re.sub("<[^>]+>", "", gancho)
    legenda = (f"{gancho_txt} {re.sub('<[^>]+>', '', sub).strip()}\n"
               f"No carrossel: o número que mais se repete na abertura, o mapa do WIN e do WDO, lá fora, juros e a agenda.\n"
               f"A leitura completa é ao vivo, às 8h30. Link na bio.\n"
               f"Conteúdo educacional, não é recomendação.")
    print(json.dumps({"slides": saidas, "legenda": legenda, "ibov": est}, ensure_ascii=False))


if __name__ == "__main__":
    main()
