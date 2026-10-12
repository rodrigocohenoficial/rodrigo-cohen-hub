#!/usr/bin/env python3
"""Gera slides/cards no formato de post do X (1080x1350 PNG), com a foto e o @ do Rodrigo.

Uso: python3 slides.py roteiro.json pasta-de-saida
roteiro.json: {"slides": ["texto do slide 1\\n\\nsegundo parágrafo", {"texto": "slide com foto", "imagem": "/caminho/foto.jpg"}, "..."]}
Cada slide pode ser texto puro ou {"texto", "imagem"}: a foto entra embaixo do texto, como tweet com imagem anexada.
Primeiro parágrafo de cada slide sai em negrito. Numeração 1/N aparece em carrosséis.
Renderiza com o Chromium headless do ambiente (/opt/pw-browsers).
"""
import glob, html, json, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")
CHROME = (glob.glob("/opt/pw-browsers/chromium-*/chrome-linux/chrome") or ["chromium"])[0]
CSS = """@font-face{font-family:I;src:url(inter-latin-wght-normal.woff2) format('woff2');font-weight:100 900}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1350px;background:#fff}
body{font-family:I,Arial,sans-serif;color:#0F1419;display:flex;flex-direction:column;justify-content:center;padding:0 96px;position:relative}
.h{display:flex;align-items:center;gap:26px;margin-bottom:44px}.h img{width:118px;height:118px;border-radius:50%}
.n{font-weight:800;font-size:44px;line-height:1.15}.u{font-weight:400;font-size:38px;color:#536471}
.t p{font-size:FSpx;line-height:1.32;font-weight:450;margin-bottom:40px;letter-spacing:-.005em}.t p:first-child{font-weight:700}
.c{position:absolute;right:72px;bottom:60px;font-size:30px;color:#8B98A5;font-weight:500}
.f{width:100%;height:FHpx;object-fit:cover;border-radius:28px;border:1px solid #CFD9DE;margin-top:6px}"""

def main():
    roteiro, out = sys.argv[1], sys.argv[2]
    slides = json.load(open(roteiro))["slides"]
    os.makedirs(out, exist_ok=True)
    tmp = tempfile.mkdtemp()
    for f in ("avatar-rodrigo.jpg", "inter-latin-wght-normal.woff2"):
        os.symlink(os.path.abspath(os.path.join(ASSETS, f)), os.path.join(tmp, f))
    files = []
    for i, item in enumerate(slides, 1):
        txt, foto = (item, None) if isinstance(item, str) else (item.get("texto", ""), item.get("imagem"))
        size = 66 if len(txt) < 110 else 58 if len(txt) < 170 else 52
        img_html = ""
        if foto:
            size = min(size, 50 if len(txt) < 110 else 44)
            ext = os.path.splitext(foto)[1] or ".jpg"
            nome = f"foto{i}{ext}"
            os.symlink(os.path.abspath(foto), os.path.join(tmp, nome))
            alt = 620 if len(txt) < 110 else 520
            img_html = f'<img class="f" src="{nome}">'.replace("FH", str(alt))
        paras = "".join("<p>" + html.escape(p).replace("\n", "<br>") + "</p>" for p in txt.split("\n\n"))
        cnt = f'<div class="c">{i}/{len(slides)}</div>' if len(slides) > 1 else ""
        page = (f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS.replace("FS", str(size)).replace("FH", str(alt if foto else 600))}</style></head>'
                f'<body><div class="h"><img src="avatar-rodrigo.jpg"><div><div class="n">Rodrigo Cohen</div>'
                f'<div class="u">@rodrigocohenoficial</div></div></div><div class="t">{paras}</div>{img_html}{cnt}</body></html>')
        src = os.path.join(tmp, f"s{i}.html")
        open(src, "w").write(page)
        png = os.path.abspath(os.path.join(out, f"{i:02d}.png"))
        subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
                        "--force-device-scale-factor=1", "--window-size=1080,1350", "--virtual-time-budget=2000",
                        f"--screenshot={png}", src], capture_output=True, check=False)
        files.append(png)
    print(json.dumps({"slides": files}))

if __name__ == "__main__":
    main()
