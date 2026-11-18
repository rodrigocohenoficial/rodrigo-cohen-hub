#!/usr/bin/env python3
"""Validação obrigatória dos PNGs exportados (carrossel-imagens-b3).

Uso: python3 validate.py <pasta-vN>
Sai com código 1 se algum erro bloqueante aparecer.
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image

vn = Path(sys.argv[1]).resolve()
html = (vn / 'carrossel.html').read_text(encoding='utf-8')
secoes = re.findall(r'<section class="([^"]+)" id="s(\d+)">(.*?)</section>', html, re.S)
pngs = sorted(vn.glob('slide-*.png'))
fit = json.loads((vn / 'fit-report.json').read_text())['slides']
erros, avisos = [], []

if len(pngs) != len(secoes):
    erros.append(f'{len(pngs)} PNGs para {len(secoes)} slides')
for png, (classes, n, corpo), r in zip(pngs, secoes, fit):
    im = Image.open(png).convert('RGB')
    if im.size != (2160, 2880):
        erros.append(f'{png.name}: tamanho {im.size}, esperado 2160x2880')
    if png.stat().st_size < 50_000:
        erros.append(f'{png.name}: {png.stat().st_size // 1024}KB. PNG vazio ou fonte não carregou')
    pequeno = im.resize((540, 720))
    px = list(pequeno.get_flattened_data()) if hasattr(pequeno, 'get_flattened_data') else list(pequeno.getdata())
    amarelo = sum(1 for (r_, g, b) in px if r_ > 215 and g > 195 and b < 150) * 16
    if '<mark>' in corpo and amarelo < 20_000:
        avisos.append(f'{png.name}: tem destaque no HTML mas pouco amarelo no PNG ({amarelo}px)')
    if '<mark>' not in corpo:
        avisos.append(f'{png.name}: sem destaque amarelo. Ok só em momento íntimo ou CTA limpo.')
    if 'inv' in classes.split():
        escuro = sum(1 for p in px if sum(p) < 90) / len(px)
        if escuro < 0.5:
            erros.append(f'{png.name}: slide de virada não está escuro ({escuro:.0%})')
    if 'class="foto' not in corpo:
        avisos.append(f'{png.name}: sem imagem')
    if r['fonte_px'] < 44:
        avisos.append(f'{png.name}: fonte {r["fonte_px"]}px, abaixo de 44px. Avise o Rodrigo ou corte texto.')
    if not 0.78 <= r['ocupacao'] <= 0.94:
        avisos.append(f'{png.name}: ocupação vertical {r["ocupacao"]:.0%} (alvo 78% a 94%)')
    print(f'{png.name}: ok  {png.stat().st_size // 1024}KB  fonte {r["fonte_px"]}px  ocupação {r["ocupacao"]:.0%}')

for a in avisos:
    print('AVISO:', a)
for e in erros:
    print('ERRO:', e)
print('RESULTADO:', 'REPROVADO' if erros else 'APROVADO')
sys.exit(1 if erros else 0)
