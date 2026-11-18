# Workflow: carrossel-imagens-b3 (8 passos)

`$SKILL` = Base directory da skill. `$OUT` = `<diretório de trabalho>/carrosseis-b3/<YYYY-MM-DD>-<slug>`.
Comandos Node usam `NODE_PATH="$(npm root -g)"` quando o Playwright é global.

## Passo 1: Ler e validar o roteiro

Monte `$OUT/roteiro.md` a partir da copy aprovada, no formato de `scaffold/roteiro-exemplo.md`:

```
---
titulo: ...
slug: ...
data_post: 2026-10-20
perfil: @rodrigocohenoficial
---

## Slide 01
arquetipo: capa | conteudo | conteudo-grafico | virada | cta
imagem: imagens/s01.jpg
imagem_tipo: foto | print | grafico | diagrama
imagem_pos: 50% 30%        (opcional, enquadramento do recorte)
imagem_fit: contain        (opcional, pra gráfico/diagrama não cortar)
imagem_altura: 520         (opcional, ponto de partida; o ajuste automático refina)
imagem_min: 480            (opcional, sobe o piso; padrão foto 420, demais 360. Nunca abaixo do padrão)
tamanho: 64                (opcional, fonte máxima deste slide)
fonte: Fonte: B3, ...      (obrigatório em print e gráfico)
assinatura: ...            (só no cta)
texto:
Frase um. Frase dois com ==destaque==.
```

Validar: sem em-dash, um `==destaque==` por slide dentro de uma frase, todo número com fonte primária anotada, 5 a 10 slides, exatamente um `virada`, último slide `cta`.

## Passo 2: Sugerir imagem por slide e persistir no roteiro

Para cada slide, proponha a imagem seguindo `foto > print > grafico > diagrama`. Pergunte ao Rodrigo se ele tem foto do assunto antes de partir pra print/gráfico. Liste numa tabela (slide | tipo | o quê | fonte) e espere o OK.

Depois do OK, escreva `imagem:`/`imagem_tipo:`/`fonte:` em cada `## Slide NN`. Altere só o bloco do slide afetado; o resto do arquivo fica byte a byte igual.

## Passo 3: Preparar a pasta vN

```bash
N=1; while [ -d "$OUT/v$N" ]; do N=$((N+1)); done; mkdir -p "$OUT/v$N/imagens" "$OUT/imagens"
```
Imagens brutas ficam em `$OUT/imagens/` (compartilhadas entre versões). `build.py` copia CSS, avatar e imagens pra dentro de `vN/`.

## Passo 4: Assets especiais

- Avatar: já vem em `$SKILL/assets/avatar-circular.png`. Não refaça.
- Foto de estúdio padrão (CTA ou capa sem foto do assunto): `$SKILL/assets/foto-estudio.jpg`.
- Foto que o Rodrigo mandar: abra com Read, escolha `imagem_pos` pra não cortar pessoa ao meio nem mostrar nome de terceiro no telão. Ou a pessoa inteira, ou nenhuma.

## Passo 5: Gerar/capturar imagens (pule as que já existem em disco)

**Print oficial:**
```bash
node $SKILL/scaffold/_print.js "<url>" $OUT/imagens/s02.png ["seletor-css"] [largura] [altura]
```
Abra o PNG com Read. Erro de PHP, banner, login wall, página vazia → tente seletor, outra URL ou troque o tipo.

**Gráfico com dado real:**
```bash
python3 $SKILL/scaffold/grafico_svg.py dados.json $OUT/imagens/s03.svg
node $SKILL/scaffold/_svg2png.js $OUT/imagens/s03.svg $OUT/imagens/s03.png
```
Destaque em amarelo só a barra que importa. Vermelho só pra queda. Use `imagem_fit: contain` e preencha `fonte:`.

**Diagrama:** escreva o SVG à mão (1824x1280, Inter, fills sólidos, raio 24-36, stroke 4-6, `#FFE95C` só no nó principal, labels curtos) e rasterize com `_svg2png.js`. SVG dentro de `<img>` não carrega a Inter: sempre rasterize.

Abra todo PNG gerado com Read. Pra conferir vários, monte uma folha de contato e leia uma imagem só.

## Passo 6: Gerar carrossel.html

```bash
python3 $SKILL/scaffold/build.py $OUT/roteiro.md $OUT/vN
```
Aborta em em-dash, destaque quebrado, imagem inexistente ou arquétipo inválido. Leia os AVISOS.

O ajuste de tamanho roda no navegador e **sempre começa do máximo do arquétipo**, então a fonte não encolhe de uma rodada pra outra. Arquétipos com prioridade `texto` encolhem a imagem primeiro.

## Passo 7: preview.html

```bash
cp $SKILL/scaffold/preview.html $OUT/vN/preview.html
```
Grade com os PNGs pra revisão rápida no navegador.

## Passo 8: Exportar, validar, entregar

```bash
node $SKILL/scaffold/_export.js $OUT/vN
python3 $SKILL/scaffold/validate.py $OUT/vN
```
O export falha se a Inter não carregar ou se algum slide não couber sem espremer a imagem abaixo do mínimo (corte texto com o Rodrigo ou divida o slide). O validate confere: nº de PNGs = nº de slides, 2160x2880, > 50KB, amarelo presente, virada escura, fonte ≥ 44px, ocupação vertical 78% a 94%.

Monte a folha de contato, abra com Read e olhe slide por slide antes de entregar. Escreva `$OUT/vN/legenda.txt`. Entregue conforme a seção **Entrega** do SKILL.md.

Correção pedida → `v(N+1)`, nunca sobrescreva.

## Regressão
Mudou CSS ou script? Rode o roteiro de teste e compare com `tests/expected-slides/`:
```bash
python3 $SKILL/scaffold/build.py $SKILL/tests/roteiro-dummy.md /tmp/smoke-b3/v1 && node $SKILL/scaffold/_export.js /tmp/smoke-b3/v1 && python3 $SKILL/scaffold/validate.py /tmp/smoke-b3/v1
```
