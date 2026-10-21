#!/usr/bin/env python3
"""Gráfico de barras em SVG no padrão visual da skill (custo zero, sem matplotlib).

Uso: python3 grafico_svg.py dados.json saida.svg
dados.json:
{
  "titulo": "Investidores pessoa física na B3 (milhões)",
  "barras": [["2019", 1.7], ["2020", 3.2]],
  "destaque": "2020",          // barra em amarelo (a que importa)
  "formato": "{:.1f} mi",      // rótulo de valor (sai como 3,2 mi)
  "queda": []                  // rótulos de barras em vermelho (só pra queda)
}
Só use número conferido em fonte primária. Nunca invente ponto pra curva ficar bonita.
Proporção 912x640 (largura útil do slide). Depois rode _svg2png.js: SVG dentro de <img> não carrega a Inter.
"""
import html
import json
import sys

W, H = 1824, 1280  # 2x de 912x640
M_TOP, M_BOT, M_X = 190, 140, 60

d = json.load(open(sys.argv[1], encoding='utf-8'))
barras = d['barras']
vmax = max(v for _, v in barras) * 1.12
n = len(barras)
gap = 36
bw = (W - 2 * M_X - gap * (n - 1)) / n
area = H - M_TOP - M_BOT
fmt = d.get('formato', '{}')


def br(v):
    # padrão brasileiro: 1.234,5
    return fmt.format(v).translate(str.maketrans(',.', '.,'))

partes = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
          '<style>text{font-family:Inter,sans-serif;fill:#0F1419}</style>',
          f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>',
          f'<text x="{M_X}" y="96" font-size="60" font-weight="700">{html.escape(d["titulo"])}</text>',
          f'<line x1="{M_X}" y1="{H - M_BOT}" x2="{W - M_X}" y2="{H - M_BOT}" stroke="#E1E8ED" stroke-width="4"/>']
for i, (rot, v) in enumerate(barras):
    x = M_X + i * (bw + gap)
    h = area * v / vmax
    y = H - M_BOT - h
    cor = '#FFE95C' if rot == d.get('destaque') else ('#C8102E' if rot in d.get('queda', []) else '#0F1419')
    partes.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw:.1f}" height="{h:.1f}" rx="12" fill="{cor}"'
                  + (' stroke="#0F1419" stroke-width="4"' if cor == '#FFE95C' else '') + '/>')
    partes.append(f'<text x="{x + bw / 2:.1f}" y="{y - 22:.1f}" font-size="52" font-weight="700" text-anchor="middle">'
                  f'{html.escape(br(v))}</text>')
    partes.append(f'<text x="{x + bw / 2:.1f}" y="{H - M_BOT + 70}" font-size="48" fill="#536471" text-anchor="middle">'
                  f'{html.escape(str(rot))}</text>')
partes.append('</svg>')
open(sys.argv[2], 'w', encoding='utf-8').write('\n'.join(partes))
print('OK:', sys.argv[2])
