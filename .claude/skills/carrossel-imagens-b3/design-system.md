# Design system: carrossel-imagens-b3

Fonte da verdade: `css/template.css`. Este arquivo explica os tokens.

## Canvas
- `--canvas-w: 1080px; --canvas-h: 1440px;` padding 92px vertical, 84px horizontal.
- Export em 2x: 2160x2880.

## Cores
| Token | Hex | Uso |
|---|---|---|
| `--tinta` | `#0F1419` | texto principal, barras de gráfico |
| `--cinza-handle` | `#536471` | @handle, rótulos secundários, assinatura |
| `--cinza-num` | `#B0B7BC` | contador N/total |
| `--cinza-fonte` | `#9AA0A6` | selo de fonte no rodapé |
| `--linha` | `#E1E8ED` | borda da imagem, eixos |
| `--amarelo` | `#FFE95C` | destaque `<mark>` e barra/nó principal. Um por slide |
| `--azul-selo` | `#1D9BF0` | selo de verificado |
| `--vermelho-queda` | `#C8102E` | só pra queda em gráfico |
| `--inv-fundo` | `#0D0D0D` | fundo do slide `virada` |
| `--inv-texto` | `#F2F2F2` | texto do slide `virada` |
| `--inv-linha` | `#2A2A2A` | borda da imagem no `virada` |

## Tipografia
- Inter 400 (corpo), 600 (destaque e contador), 700 (nome e `**negrito**`).
- `line-height: 1.41`, `letter-spacing: -0.005em`, espaço entre frases 0.55em.
- Nome 38px, handle 30px, contador 26px, fonte/atribuição 24px (única exceção abaixo de 36px).
- Itálico proibido. `<em>` é neutralizado no CSS.

## Destaque
`mark`: fundo amarelo, padding 0 8px, raio 6px, peso 600, `box-decoration-break: clone` pra quebrar linha sem perder o fundo.

## Imagem
`.foto`: largura total, raio 24px, borda 2px `--linha`, `object-fit: cover` com `object-position` vindo do roteiro (`imagem_pos`). `.foto.contain` pra gráfico e diagrama (fundo branco, sem corte).

## Gráficos e diagramas
SVG 1824x1280 (2x de 912x640), Inter, título 60px bold, valores 52px bold, rótulos 48px `--cinza-handle`. Sem grade, sem legenda flutuante, sem spine superior/direita. Número no padrão brasileiro (3,2 / 1.234). Rasterizar com `_svg2png.js`.
