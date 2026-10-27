"""Carrossel "Monitor B3" da @tradernationoficial: como o Brasil está no meio do pregão (4 slides, visual do Panorama).

Uso: python3 monitor.py <pasta-saida> [--alerta "frase"] [--data AAAA-MM-DD]   (--data só pra testar o layout com outro pregão)
Busca no Yahoo Finance (atraso de até 15 min) o Ibovespa, o dólar à vista e as ações do Ibov, e gera:
  1 capa (Ibov e dólar agora) · 2 as 8 maiores quedas do Ibov · 3 as 8 maiores altas · 4 o Ibov no dia + sala ao vivo.
Variação de cada ação contra o fechamento do pregão anterior. Ação sem negócio hoje fica de fora: nada é inventado.
"""
import datetime as dt
import html
import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

AQUI = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.abspath(os.path.join(AQUI, "..", "assets"))
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
BRT = dt.timezone(dt.timedelta(hours=-3))
DIAS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"]
esc = lambda s: html.escape(str(s), quote=False)
br = lambda v: f"{v:,.0f}".replace(",", ".")
br1 = lambda v: f"{v:,.1f}".replace(",", "X").replace(".", ",").replace("X", ".")
br2 = lambda v: f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
pct = lambda v: ("+" if v >= 0 else "−") + br1(abs(v)) + "%"

# Ações do Ibovespa (as mais líquidas). Ticker que não existir mais no Yahoo é ignorado.
IBOV = {
    "PETR4": "Petrobras", "PETR3": "Petrobras ON", "VALE3": "Vale", "ITUB4": "Itaú", "BBDC4": "Bradesco", "BBDC3": "Bradesco ON",
    "BBAS3": "Banco do Brasil", "B3SA3": "B3", "ABEV3": "Ambev", "WEGE3": "WEG", "ITSA4": "Itaúsa", "BPAC11": "BTG Pactual",
    "SANB11": "Santander", "ELET3": "Eletrobras", "ELET6": "Eletrobras PNB", "SBSP3": "Sabesp", "RENT3": "Localiza",
    "SUZB3": "Suzano", "GGBR4": "Gerdau", "JBSS3": "JBS", "RDOR3": "Rede D'Or", "RADL3": "Raia Drogasil", "EQTL3": "Equatorial",
    "PRIO3": "PRIO", "VBBR3": "Vibra", "RAIL3": "Rumo", "UGPA3": "Ultrapar", "CSAN3": "Cosan", "BBSE3": "BB Seguridade",
    "CMIG4": "Cemig", "CPLE6": "Copel", "TIMS3": "TIM", "VIVT3": "Vivo", "HAPV3": "Hapvida", "LREN3": "Renner",
    "MGLU3": "Magazine Luiza", "EMBR3": "Embraer", "KLBN11": "Klabin", "CSNA3": "CSN", "USIM5": "Usiminas", "GOAU4": "Gerdau Met.",
    "BRFS3": "BRF", "CCRO3": "CCR", "TOTS3": "Totvs", "ENEV3": "Eneva", "EGIE3": "Engie", "TAEE11": "Taesa", "CPFE3": "CPFL",
    "SBFG3": "Grupo SBF", "AZZA3": "Azzas", "ASAI3": "Assaí", "CRFB3": "Carrefour", "NTCO3": "Natura", "MRVE3": "MRV",
    "CYRE3": "Cyrela", "MULT3": "Multiplan", "ALOS3": "Allos", "HYPE3": "Hypera", "FLRY3": "Fleury", "YDUQ3": "Yduqs",
    "COGN3": "Cogna", "CVCB3": "CVC", "AZUL4": "Azul", "PETZ3": "Petz", "BRAV3": "Brava", "RECV3": "PetroReconcavo",
    "SLCE3": "SLC Agrícola", "SMTO3": "São Martinho", "CMIN3": "CSN Mineração", "BRKM5": "Braskem", "IRBR3": "IRB",
    "CXSE3": "Caixa Seguridade", "PSSA3": "Porto Seguro", "ISAE4": "ISA Energia", "DIRR3": "Direcional", "VAMO3": "Vamos",
    "MRFG3": "Marfrig", "BEEF3": "Minerva", "POMO4": "Marcopolo", "STBP3": "Santos Brasil", "RAIZ4": "Raízen", "AURE3": "Auren",
}


DIA = None  # pregão a mostrar (hoje, salvo --data)
N = 8  # ações em cada ranking (preenche o painel do slide)


def chart(simbolo):
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{simbolo}?range=5d&interval=5m"
    try:
        out = subprocess.run(["curl", "-sS", "-m", "30", "-A", "Mozilla/5.0", url], capture_output=True, text=True, check=True).stdout
        r = json.loads(out)["chart"]["result"][0]
    except Exception:
        return None
    m, q = r["meta"], r["indicators"]["quote"][0]
    ts = r.get("timestamp") or []
    dias = [(dt.datetime.fromtimestamp(t, BRT).date(), c, h, l)
            for t, c, h, l in zip(ts, q.get("close") or [], q.get("high") or [], q.get("low") or []) if c is not None]
    pts = [(t, c, h, l) for (d, c, h, l), t in zip(dias, [t for t, c in zip(ts, q.get("close") or []) if c is not None]) if d == DIA]
    antes = [c for d, c, h, l in dias if d < DIA]
    # referência: último preço do pregão anterior a DIA (na série de 5 dias); sem ele, o previousClose do Yahoo
    ref = antes[-1] if antes else (m.get("previousClose") or m.get("chartPreviousClose"))
    if not pts or not ref:
        return None
    ultimo = pts[-1][1]
    return {"ultimo": ultimo, "ref": ref, "var": (ultimo / ref - 1) * 100,
            "max": max(p[2] for p in pts if p[2] is not None), "min": min(p[3] for p in pts if p[3] is not None),
            "hora": dt.datetime.fromtimestamp(pts[-1][0], BRT).strftime("%H:%M")}


def linhas(acoes):
    return "".join(f'<div class="fx"><i><b class="tk">{esc(a["tk"])}</b> {esc(a["nome"])}</i>'
                   f'<b class="{"dn" if a["var"] < 0 else "up"}">{pct(a["var"])}</b></div>' for a in acoes)


def main():
    args = sys.argv[1:]
    alerta = ""
    if "--alerta" in args:
        i = args.index("--alerta")
        alerta = args[i + 1].strip()
        del args[i:i + 2]
    global DIA
    DIA = dt.datetime.now(BRT).date()
    if "--data" in args:
        i = args.index("--data")
        DIA = dt.date.fromisoformat(args[i + 1])
        del args[i:i + 2]
    pasta = args[0]
    os.makedirs(pasta, exist_ok=True)

    with ThreadPoolExecutor(12) as ex:
        res = dict(zip(IBOV, ex.map(lambda t: chart(t + ".SA"), IBOV)))
        ibov, dolar = ex.map(chart, ["^BVSP", "BRL=X"])
    if not ibov:
        sys.exit("Ibovespa sem negócio hoje: monitor não sai.")
    # ação sem negócio nos 5 min antes do último preço do Ibov fica de fora (preço velho distorce o ranking)
    lim = (dt.datetime.combine(DIA, dt.time.fromisoformat(ibov["hora"])) - dt.timedelta(minutes=5)).strftime("%H:%M")
    velhas = sorted(t for t, c in res.items() if c and c["hora"] < lim)
    acoes = sorted(({"tk": t, "nome": IBOV[t], **c} for t, c in res.items() if c and c["hora"] >= lim), key=lambda a: a["var"])
    # PETR3/ELET6/BBDC3 repetem a empresa: ficam fora do ranking se a outra classe já está nele
    vistas, rank = set(), []
    for a in acoes:
        emp = a["nome"].split(" ")[0]
        if emp not in vistas:
            vistas.add(emp)
            rank.append(a)
    quedas = [a for a in rank if a["var"] < 0][:N]
    altas = [a for a in reversed(rank) if a["var"] > 0][:N]
    caem = sum(a["var"] < 0 for a in acoes)
    agora = dt.datetime.combine(DIA, dt.time(12), BRT)
    hora = ibov["hora"]
    hh = hora.replace(":", "h")
    data_txt = f"{DIAS[agora.weekday()]} {agora.strftime('%d/%m')}"
    verbo = "cai" if ibov["var"] < 0 else "sobe"
    # dólar só entra se tem negócio de hoje e não está parado (o Yahoo às vezes repete o último preço)
    dol = dolar if dolar and dolar["max"] != dolar["min"] else None

    sub = (f'Dólar à vista <b class="{"up" if dol["var"] >= 0 else "dn"}">R$ {br2(dol["ultimo"])} ({pct(dol["var"])})</b>. ' if dol else "") + \
          f'<b>{caem} de {len(acoes)}</b> ações do Ibov no vermelho.'
    if alerta:
        sub += f' <b class="alerta">{esc(alerta)}</b>'
    ind = []
    if quedas:
        ind.append(f'Maior queda: {esc(quedas[0]["nome"])} <b class="dn">{pct(quedas[0]["var"])}</b>')
    if altas:
        ind.append(f'Maior alta: {esc(altas[0]["nome"])} <b class="up">{pct(altas[0]["var"])}</b>')
    ind.append(f'Ibov <b class="up">{br(ibov["max"])}</b> · <b class="dn">{br(ibov["min"])}</b> até agora')
    s1 = f"""<span class="tag"><img src="file://{ASSETS}/logo-tn.jpg">MONITOR B3 · {data_txt} · {hh}</span>
<h1 class="hook{" cai" if ibov["var"] < 0 else ""}">O Ibovespa {verbo} <mark>{br1(abs(ibov["var"]))}%</mark> às {hh}.</h1>
<div class="col1"><p class="sub">{sub}</p>
<div class="painel indice"><h2>No carrossel</h2><ol>{"".join(f"<li>{x}</li>" for x in ind)}</ol></div></div>
<div class="foto f1"><img src="file://{ASSETS}/foto-mc.jpg"><span class="vivo">● AO VIVO</span></div>
<span class="arrasta">ARRASTA →</span>"""

    nota = f'Variação até {hora} contra o fechamento anterior. Yahoo Finance, atraso de até 15 min.'
    s2 = f"""<span class="tag">MAIORES QUEDAS DO IBOV</span>
<h1 class="h1m">{"As " + str(N) + " que mais caem" if len(quedas) == N else "As que caem"} até {hh}.</h1>
<div class="painel fluxo mon">{linhas(quedas)}</div>
<p class="rod">{esc(nota)}</p>
<span class="pag">2/4</span>""" if quedas else None
    s3 = f"""<span class="tag">MAIORES ALTAS DO IBOV</span>
<h1 class="h1m">{"As " + str(N) + " que mais sobem" if len(altas) == N else "As que sobem"} até {hh}.</h1>
<div class="painel fluxo mon">{linhas(altas)}</div>
<p class="rod">{esc(nota)}</p>
<span class="pag">3/4</span>""" if altas else None

    dol_fx = (f'<div class="fx"><i>Dólar à vista</i><b class="{"up" if dol["var"] >= 0 else "dn"}">R$ {br2(dol["ultimo"])}</b></div>'
              f'<div class="fx"><i>Máxima do dólar</i><b>R$ {br2(dol["max"])}</b></div>') if dol else ""
    s4 = f"""<span class="tag">O IBOV NO DIA</span>
<div class="painel big m4"><p class="mega {"dn" if ibov["var"] < 0 else "up"}">{pct(ibov["var"])}</p>
<p class="exp">Ibovespa às {hh}: <b>{br(ibov["ultimo"])}</b> pontos. Máxima <b class="up">{br(ibov["max"])}</b> · mínima <b class="dn">{br(ibov["min"])}</b>.</p></div>
<div class="painel fluxo f2 m4">{dol_fx}<div class="fx"><i>Ações do Ibov no vermelho</i><b class="dn">{caem} de {len(acoes)}</b></div></div>
<div class="cta">Sala ao vivo com Rodrigo Cohen · link na bio</div>
<p class="disc">Conteúdo educacional. Não é recomendação. Dados: Yahoo Finance (atraso de até 15 min).</p>"""

    extra = """.painel.fluxo.mon{gap:14px;top:300px}.painel.fluxo.mon .fx i{font-size:36px}.painel.fluxo.mon .fx b{font-size:50px}
.fx b.tk{font-size:30px;color:#F2C14E;margin-right:10px}.painel.big.m4{top:150px}.painel.fluxo.f2.m4{top:640px}
h1.cai mark{color:#fff}h1.cai mark::before{background:#E5322D}.mega.dn{color:#FF5C5C}.mega.up{color:#2EE59D}.sub b.alerta{display:block;margin-top:14px;color:#FF5C5C;font-weight:900}"""
    css = open(os.path.join(AQUI, "panorama.css")).read() + open(os.path.join(AQUI, "panorama_carrossel.css")).read() + extra
    saidas = []
    for i, corpo in enumerate([s1, s2, s3, s4], 1):
        if not corpo:
            continue
        page = (f'<!doctype html><html><head><meta charset="utf-8"><style>@font-face{{font-family:I;src:url(file://{ASSETS}/inter-latin-wght-normal.woff2) format("woff2");font-weight:100 900}}'
                f'{css}</style></head><body><div class="glow"></div>{corpo}</body></html>')
        base = os.path.join(pasta, f"{i:02d}")
        open(base + ".html", "w").write(page)
        subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files", "--hide-scrollbars",
                        "--window-size=1080,1450", f"--screenshot={base}.full.png", "file://" + os.path.abspath(base + ".html")],
                       check=True, capture_output=True, timeout=90)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", base + ".full.png", "-vf", "crop=1080:1350:0:0", base + ".png"],
                       check=True, timeout=60)
        os.remove(base + ".full.png")
        saidas.append(base + ".png")

    q1 = f'{quedas[0]["nome"]} {pct(quedas[0]["var"])}' if quedas else ""
    a1 = f'{altas[0]["nome"]} {pct(altas[0]["var"])}' if altas else ""
    legenda = (f'O Ibovespa {verbo} {br1(abs(ibov["var"]))}% às {hh}. {caem} de {len(acoes)} ações do Ibov no vermelho.\n'
               + (f"{alerta}\n" if alerta else "")
               + f'Maior queda: {q1}. Maior alta: {a1}. As {N} de cada lado no carrossel.\n'
               + "Salva pra comparar com o fechamento. Conteúdo educacional, não é recomendação.")
    print(json.dumps({"slides": saidas, "legenda": legenda, "hora": hora, "ibov": ibov, "dolar": dol,
                      "quedas": quedas, "altas": altas, "caem": caem, "total": len(acoes), "fora_por_preco_velho": velhas}, ensure_ascii=False))


if __name__ == "__main__":
    main()
