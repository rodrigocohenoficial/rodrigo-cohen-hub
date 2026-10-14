#!/usr/bin/env python3
"""Gera vN/carrossel.html a partir de roteiro.md (carrossel-imagens-b3).

Uso: python3 build.py <roteiro.md> <pasta-vN>

O renderer só formata. Nunca reescreve, resume ou expande o texto do roteiro.
"""
import html
import json
import re
import shutil
import sys
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
ARQUETIPOS = {
    # nome: (fonte max, fonte min, altura padrão da imagem, prioridade quando não cabe)
    # prioridade 'texto': a imagem encolhe primeiro (até 360px), a fonte só depois.
    # prioridade 'imagem': a fonte encolhe primeiro (gráfico precisa ser legível).
    'capa': (68, 52, 560, 'texto'),
    'conteudo': (54, 44, 480, 'texto'),
    'conteudo-grafico': (48, 40, 640, 'imagem'),
    'virada': (60, 46, 420, 'texto'),
    'cta': (54, 44, 520, 'texto'),
}
FONTE_MINIMA = 36
ABREVIACOES = ('Sr.', 'Sra.', 'Dr.', 'Dra.', 'etc.', 'Inc.', 'nº.', 'p.ex.', 'vs.')
CHAVES_SLIDE = {'arquetipo', 'imagem', 'imagem_tipo', 'imagem_altura', 'imagem_pos',
                'imagem_fit', 'fonte', 'tamanho', 'assinatura'}


def erro(msg):
    sys.exit(f'ERRO: {msg}')


def parse_roteiro(txt):
    meta, corpo = {}, txt
    m = re.match(r'^---\n(.*?)\n---\n', txt, re.S)
    if m:
        for linha in m.group(1).splitlines():
            if ':' in linha and not linha.startswith(' '):
                k, v = linha.split(':', 1)
                meta[k.strip()] = v.strip().strip('"')
        corpo = txt[m.end():]
    blocos = re.split(r'^## Slide (\d+)\s*$', corpo, flags=re.M)
    slides = []
    for i in range(1, len(blocos), 2):
        n, bloco = int(blocos[i]), blocos[i + 1]
        s, texto, em_texto = {'n': n}, [], False
        for linha in bloco.splitlines():
            if em_texto:
                texto.append(linha)
                continue
            if linha.strip() == 'texto:':
                em_texto = True
                continue
            mk = re.match(r'^([a-z_]+):\s*(.*)$', linha)
            if mk and mk.group(1) in CHAVES_SLIDE:
                s[mk.group(1)] = mk.group(2).strip().strip('"')
        s['texto'] = '\n'.join(texto).strip()
        slides.append(s)
    return meta, slides


def frases(t):
    """Uma frase por parágrafo. Linha em branco também separa parágrafo."""
    out = []
    for bloco in re.split(r'\n\s*\n', t.strip()):
        bloco = ' '.join(bloco.split())
        protegido = bloco
        for i, ab in enumerate(ABREVIACOES):
            protegido = protegido.replace(ab, f'\x00{i}\x00')
        partes = re.split(r'(?<=[.!?])\s+', protegido)
        for p in partes:
            for i, ab in enumerate(ABREVIACOES):
                p = p.replace(f'\x00{i}\x00', ab)
            if p:
                out.append(p)
    return out


def P(t, n):
    if '\u2014' in t:
        erro(f'slide {n:02d} tem em-dash (\u2014). Troque por ponto, vírgula ou dois-pontos.')
    out = []
    for p in frases(t):
        if p.count('==') % 2:
            erro(f'slide {n:02d}: destaque ==...== atravessa duas frases ou ficou aberto: "{p}"')
        p = html.escape(p, quote=False)
        p = re.sub(r'==(.+?)==', r'<mark>\1</mark>', p)
        p = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', p)
        out.append(f'<p>{p}</p>')
    return '\n      '.join(out)


def main():
    if len(sys.argv) != 3:
        erro('uso: python3 build.py <roteiro.md> <pasta-vN>')
    roteiro, vn = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
    meta, slides = parse_roteiro(roteiro.read_text(encoding='utf-8'))
    if not slides:
        erro('nenhum "## Slide NN" no roteiro')
    (vn / 'imagens').mkdir(parents=True, exist_ok=True)
    shutil.copy(SKILL / 'css' / 'template.css', vn / 'template.css')
    shutil.copy(SKILL / 'assets' / 'avatar-circular.png', vn / 'imagens' / 'avatar-circular.png')
    selo = (SKILL / 'assets' / 'selo.svg').read_text().replace('<svg ', '<svg class="selo" ', 1)
    nome = meta.get('nome', 'Rodrigo Cohen')
    handle = meta.get('perfil', '@rodrigocohenoficial')
    total = len(slides)

    secoes, avisos, config = [], [], []
    for idx, s in enumerate(slides, 1):
        n = s['n']
        if n != idx:
            erro(f'slides fora de ordem: esperado {idx:02d}, veio {n:02d}')
        arq = s.get('arquetipo', 'conteudo')
        if arq not in ARQUETIPOS:
            erro(f'slide {n:02d}: arquetipo "{arq}" inválido. Use: {", ".join(ARQUETIPOS)}')
        fmax, fmin, alt, prio = ARQUETIPOS[arq]
        if s.get('tamanho'):
            fmax = int(s['tamanho'])
        if fmin < FONTE_MINIMA or fmax < FONTE_MINIMA:
            erro(f'slide {n:02d}: fonte abaixo de {FONTE_MINIMA}px')
        if not s['texto']:
            erro(f'slide {n:02d} sem texto')
        img = s.get('imagem', '')
        img_html = ''
        if img and not img.startswith('nenhuma'):
            src = (roteiro.parent / img) if not Path(img).is_absolute() else Path(img)
            if not src.exists():
                erro(f'slide {n:02d}: imagem não encontrada: {src}')
            destino = vn / 'imagens' / src.name
            if src.resolve() != destino.resolve():
                shutil.copy(src, destino)
            alt = int(s.get('imagem_altura', alt))
            fit = ' contain' if s.get('imagem_fit') == 'contain' else ''
            pos = s.get('imagem_pos', '50% 35%')
            img_html = (f'<img class="foto{fit}" src="imagens/{html.escape(src.name)}" '
                        f'style="height:{alt}px;object-position:{pos}" alt="">')
        else:
            avisos.append(f'slide {n:02d} sem imagem ({img or "campo vazio"}). Regra: imagem em todos os slides.')
        fonte = s.get('fonte', '')
        if s.get('imagem_tipo') in ('print', 'grafico') and not fonte:
            avisos.append(f'slide {n:02d}: {s["imagem_tipo"]} sem "fonte:". Dado de terceiro precisa de selo de fonte.')
        if '\u2014' in fonte:
            erro(f'slide {n:02d}: em-dash na fonte')
        classes = ['slide', arq] + (['inv'] if arq == 'virada' else [])
        assinatura = ''
        if arq == 'cta' and s.get('assinatura'):
            assinatura = f'<div class="assinatura">{html.escape(s["assinatura"])}</div>'
        secoes.append(f'''<section class="{' '.join(classes)}" id="s{n:02d}">
    <div class="topo">
      <img class="avatar" src="imagens/avatar-circular.png" alt="">
      <div class="idblock">
        <div class="nome">{html.escape(nome)} {selo}</div>
        <div class="handle">{html.escape(handle)}</div>
      </div>
    </div>
    <div class="num">{n}/{total}</div>
    <div class="texto">
      {P(s['texto'], n)}
    </div>
    {img_html}
    {assinatura}
    {f'<div class="fonte">{html.escape(fonte)}</div>' if fonte else ''}
  </section>''')
        config.append({'id': f's{n:02d}', 'fmax': fmax, 'fmin': fmin, 'prio': prio})

    doc = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>{html.escape(meta.get('titulo', 'Carrossel B3'))}</title>
<link rel="stylesheet" href="template.css">
</head><body>
  {chr(10).join(secoes)}
<script>
// Ajuste de tamanho: sempre começa do máximo do arquétipo (a fonte nunca encolhe de rodada em rodada).
const CONFIG = {json.dumps(config)};
window.__fit = (async () => {{
  await document.fonts.ready;
  const imgs = [...document.images];
  await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => {{ i.onload = i.onerror = r; }})));
  const rel = [];
  for (const c of CONFIG) {{
    const s = document.getElementById(c.id);
    const tx = s.querySelector('.texto');
    const img = s.querySelector('.foto');
    const fonte = s.querySelector('.fonte');
    const top = () => s.getBoundingClientRect().top;
    const limite = () => fonte ? fonte.getBoundingClientRect().top - top() - 24 : s.clientHeight - 92;
    const fundo = () => Math.max(...[...s.children].filter(e => !e.classList.contains('fonte') && !e.classList.contains('num'))
      .map(e => e.getBoundingClientRect().bottom - top()));
    let f = c.fmax, h = img ? parseInt(img.style.height) : 0;
    const set = () => {{ tx.querySelectorAll('p').forEach(p => p.style.fontSize = f + 'px'); if (img) img.style.height = h + 'px'; }};
    set();
    if (c.prio === 'texto') while (img && fundo() > limite() && h > 360) {{ h -= 20; set(); }}
    while (fundo() > limite() && f > c.fmin) {{ f -= 2; set(); }}
    while (img && fundo() > limite() && h > 300) {{ h -= 20; set(); }}
    while (img && fundo() / s.clientHeight < 0.84 && h < 760) {{ h += 10; set(); if (fundo() > limite()) {{ h -= 10; set(); break; }} }}
    const overflow = fundo() > limite();
    if (overflow) s.dataset.overflow = '1';
    rel.push({{ slide: c.id, fonte_px: f, imagem_px: h, ocupacao: +(fundo() / s.clientHeight).toFixed(3), overflow }});
  }}
  const fontesOk = document.fonts.check('400 40px Inter') && document.fonts.check('700 40px Inter');
  return {{ slides: rel, fontesOk }};
}})();
</script>
</body></html>
'''
    if '==' in re.sub(r'<script>.*?</script>', '', doc, flags=re.S):
        erro('sobrou "==" cru no HTML. Algum destaque não fechou.')
    (vn / 'carrossel.html').write_text(doc, encoding='utf-8')
    print(f'OK: {vn / "carrossel.html"} ({total} slides)')
    for a in avisos:
        print('AVISO:', a)


if __name__ == '__main__':
    main()
