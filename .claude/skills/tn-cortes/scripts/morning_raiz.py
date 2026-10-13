"""Card "Antes de clicar" das 08:30, versão RAIZ: post do X do Rodrigo, com o placar do dia anterior.

Uso: python3 morning_raiz.py <dia-qg.json> <dia-anterior-qg.json|-> <historico-qg.json|-> <saida.png>
  dia-qg.json           dias/<hoje> do painel do QG (rotina QG1, ~08:13)
  dia-anterior-qg.json  dias/<último pregão> do QG (a leitura que ele fez ontem, pro placar); "-" = sem placar
  historico-qg.json     historico/<último pregão> (fechamento oficial da B3 e pontos do WIN p/ o gráfico); "-" = sem gráfico
Tudo sai do que o QG já publicou no WhatsApp e dos números da B3: nenhum dado é inventado aqui.
Imprime JSON com o placar, o gancho e a legenda. Gera PNG 1080x1350 (converter p/ JPEG antes do Metricool).
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
DIA_NOME = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"]


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


def br(v):
    return f"{v:,.0f}".replace(",", ".")


def placar(ontem, hist):
    """Confere a leitura de ontem. Usa o resultado gravado pelo QG; se faltar, aplica o critério ao fechamento da B3."""
    lei = (ontem or {}).get("leitura") or {}
    if not lei.get("texto"):
        return None
    w = (hist or {}).get("WIN") or {}
    res = lei.get("resultado")
    fech = w.get("fech")
    if not res and fech:
        m = re.search(r"(maior|menor) (?:ou igual )?(?:que|a) ([\d.]+)", lei.get("criterio", ""))
        if m and w.get("ticker", "") in lei.get("criterio", ""):
            alvo = float(m.group(2).replace(".", ""))
            ok = fech > alvo if m.group(1) == "maior" else fech < alvo
            res = "ACERTEI" if ok else "ERREI"
    if res not in ("ACERTEI", "ERREI", "MEIO A MEIO"):
        return None
    return {"resultado": res, "leitura": lei["texto"], "fech": fech, "data": w.get("data") or ontem.get("data")}


def grafico_svg(hist):
    w = (hist or {}).get("WIN") or {}
    ys = [p[1] for p in w.get("pontos") or []]
    if len(ys) < 10:
        return ""
    W, H, LW = 886, 300, 230
    niv = [("MÁX", w["max"], "#00A36C", "7 6"), ("FECH", w["fech"], "#0F1419", ""),
           ("VWAP", w.get("vwap"), "#1D9BF0", ""), ("MÍN", w["min"], "#F4212E", "7 6")]
    niv = [n for n in niv if n[1]]
    lo, hi = min(ys + [n[1] for n in niv]), max(ys + [n[1] for n in niv])
    pad = (hi - lo) * 0.08 or 50
    lo, hi = lo - pad, hi + pad
    X = lambda i: 20 + i * (W - LW - 30) / (len(ys) - 1)
    Y = lambda v: 40 + (hi - v) * (H - 60) / (hi - lo)
    d = "M" + " L".join(f"{X(i):.1f},{Y(v):.1f}" for i, v in enumerate(ys))
    g = "".join(f'<line x1="20" x2="{W-LW}" y1="{Y(v):.1f}" y2="{Y(v):.1f}" stroke="{c}" stroke-width="2.5" stroke-dasharray="{ds}"/>'
                for _, v, c, ds in niv)
    prev, rot = -99, ""
    for y, n, v, c in sorted((Y(v), n, v, c) for n, v, c, _ in niv):
        y = max(y, prev + 30)
        prev = y
        rot += f'<text x="{W-LW+14}" y="{y+9:.1f}" fill="{c}" font-size="25" font-weight="700">{n} {br(v)}</text>'
    dia = dt.date.fromisoformat(w["data"]).strftime("%d/%m") if w.get("data") else ""
    titulo = f'<text x="20" y="26" fill="#536471" font-size="22" font-weight="600">{html.escape(w.get("ticker",""))} · pregão {dia} · fonte B3</text>'
    return (f'<svg class="f" viewBox="0 0 {W} {H}" width="{W}" height="{H}">{titulo}{g}'
            f'<path d="{d}" fill="none" stroke="#0F1419" stroke-width="3" stroke-linejoin="round"/>{rot}</svg>')


CSS = """@font-face{font-family:I;src:url(file://ASSETS/inter-latin-wght-normal.woff2) format('woff2');font-weight:100 900}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1350px;background:#fff}
body{font-family:I,Arial,sans-serif;color:#0F1419;display:flex;flex-direction:column;justify-content:center;padding:0 96px}
.h{display:flex;align-items:center;gap:24px;margin-bottom:34px}.h img{width:104px;height:104px;border-radius:50%}
.n{font-weight:800;font-size:40px;line-height:1.15}.u{font-weight:400;font-size:34px;color:#536471}
.t p{font-size:FSpx;line-height:1.3;font-weight:450;margin-bottom:26px;letter-spacing:-.005em}.t p:first-child{font-weight:750}
.t b{font-weight:750}.ok{color:#00A36C}.no{color:#F4212E}
.f{width:100%;height:auto;border-radius:24px;border:1px solid #CFD9DE;margin-top:4px;background:#fff}
.d{font-size:24px;color:#8B98A5;margin-top:22px}"""


def main():
    hoje_doc, ontem_doc, hist = doc(sys.argv[1]), doc(sys.argv[2]), doc(sys.argv[3])
    saida = sys.argv[4]
    msg = next(m for m in hoje_doc["mensagens"] if m.get("slot") == "manha")
    manchete, sec = secoes(msg["texto"])
    manchete = re.sub(r"[.!]?\s*Sala abre.*$", "", manchete, flags=re.I).strip()

    agenda = pega(sec, "AGENDA")
    forte = next((a for a in agenda if "🚨" in a), agenda[0] if agenda else "")
    forte = re.sub(r"\s*🚨+|\s*\(horário eu confirmo na sala\)", "", forte).strip()
    cen = " ".join(l for l in pega(sec, "MEU CENÁRIO") if not re.match(r"^Às 17h|^_", l))
    cen = re.sub(r"^Eu leio (o )?", "", cen).strip()
    w = (hist or {}).get("WIN") or {}

    p = placar(ontem_doc, hist)
    paras = []
    if p:
        quando = DIA_NOME[dt.date.fromisoformat(p["data"]).weekday()] if p.get("data") else "ontem"
        cor = "ok" if p["resultado"] == "ACERTEI" else "no"
        palavra = {"ACERTEI": "Acertei.", "ERREI": "Errei.", "MEIO A MEIO": "Meio a meio."}[p["resultado"]]
        leitura = re.sub(r"\s*\([^)]*\)", "", p["leitura"]).rstrip(".")
        leitura = re.sub(r"^WIN fecha(?: hoje)?", "o WIN fechava", leitura)
        fech = f" Fechou em {br(p['fech'])}." if p.get("fech") else ""
        gancho = f"{quando.capitalize()} eu disse que {leitura}.{fech} <span class=\"{cor}\">{palavra}</span>"
        paras.append(gancho)
    else:
        gancho = html.escape(manchete) + "."
        paras.append(gancho)
    linhas = []
    if p:
        linhas.append(html.escape(manchete) + ".")
    if forte:
        linhas.append("Agenda: " + html.escape(forte) + ".")
    if w.get("vwap"):
        linhas.append(f"WIN de {DIA_NOME[dt.date.fromisoformat(w['data']).weekday()]}: VWAP {br(w['vwap'])}, máx {br(w['max'])}, mín {br(w['min'])}.")
    paras.append("Antes de clicar hoje:\n" + "\n".join(linhas))
    if cen:
        paras.append("<b>Meu cenário:</b> " + html.escape(cen[0].upper() + cen[1:]) + " Às 17h eu conto aqui se acertei.")
    paras.append("Sala ao vivo às 8h30. Link na bio.")

    texto = "".join("<p>" + x.replace("\n", "<br>") + "</p>" for x in paras)
    n = len(re.sub("<[^>]+>", "", texto))
    fs = 40 if n < 420 else 36 if n < 520 else 33
    graf = grafico_svg(hist)
    page = (f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS.replace("ASSETS", ASSETS).replace("FS", str(fs))}</style></head>'
            f'<body><div class="h"><img src="file://{ASSETS}/avatar-rodrigo.jpg"><div><div class="n">Rodrigo Cohen</div>'
            f'<div class="u">@rodrigocohenoficial</div></div></div><div class="t">{texto}</div>{graf}'
            f'<p class="d">Conteúdo educacional. Não é recomendação.</p></body></html>')
    tmp = saida + ".html"
    open(tmp, "w").write(page)
    subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files",
                    "--hide-scrollbars", "--window-size=1080,1450", f"--screenshot={saida}.full.png", "file://" + os.path.abspath(tmp)],
                   check=True, capture_output=True, timeout=90)
    # o headless corta ~90 px do fim da janela: renderiza mais alto e recorta 1080x1350
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{saida}.full.png", "-vf", "crop=1080:1350:0:0", saida],
                   check=True, timeout=60)
    os.remove(f"{saida}.full.png")
    limpo = re.sub("<[^>]+>", "", gancho)
    legenda = (f"{limpo}\n"
               f"Todo dia útil eu mostro aqui a leitura do dia e, no dia seguinte, se acertei ou errei. Sem esconder.\n"
               f"Sala ao vivo às 8h30, link na bio. Conteúdo educacional, não é recomendação.")
    print(json.dumps({"placar": p, "gancho": limpo, "legenda": legenda, "png": saida}, ensure_ascii=False))


if __name__ == "__main__":
    main()
