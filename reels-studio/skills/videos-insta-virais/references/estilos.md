# Estilos e peças

Todo `at`, `from`, `to` = **segundo da fala** (do `transcript.json` já cortado). Registro de cada Reel em
`src/reels/index.ts` como `ReelDef`.

## Opções do ReelDef

| Campo | Uso |
|---|---|
| `id` | minúsculas com hífen, igual à pasta em `public/reels/<id>` |
| `style` | `"split"` (padrão, design), `"raiz"` ou `"jornal"` |
| `tema` | `"rodrigo"` (padrão) ou `"flavia"` |
| `Scenes` | componente com as cenas/peças |
| `tag` | etiqueta pequena no topo (split), ex: `"Rodrigo Cohen · Resultado do dia"` |
| `media` | pasta da gravação quando difere do id (ex: versão raiz do mesmo vídeo: `media: "reel-01"`) |
| `faceSegments` | split: enquadramento da metade de baixo por trecho, ex: `[{from:0,position:"50% 45%"},{from:47.4,position:"50% 26%"}]` |
| `zooms` | raiz/jornal: `[{from,to,scale,x,y,freeze?,slow?}]`, x/y em % do quadro |
| `manchetes` | jornal: `[{from, text}]`, `*trecho*` sai marcado de amarelo |
| `velocidade` | split: ex `1.1` |

## Raiz (`src/raiz`)

Vídeo em tela cheia, legenda branca grossa com contorno preto e palavra falada em amarelo (altura do peito, y=1300).
Intervenções curtas — 3 a 6 por Reel. Peças (posicionadas por tempo, fora de Scene):

| Peça | Uso |
|---|---|
| `<TopText from to text />` | Faixa branca de gancho no topo. `"8 OPERAÇÕES.\n8 ACERTOS."` (use `\n` para quebrar) |
| `zooms` com `freeze: true` + `<Scribble from to x y w h />` | Congela o quadro, dá zoom e risca círculo vermelho no número da tela (prova). x/y em px do quadro 1080×1920 |
| `<Pop from to text sub color y size />` | Número/texto estourando. Na parte do rosto use `y≈220–250` (acima da cabeça) para não tapar o rosto |
| `<StampRaiz from to text />` | Carimbo vermelho ("SEM PREÇO MÉDIO") |
| `<DisclaimerRaiz from to />` | Aviso de resultado passado no topo |
| `zooms` sem freeze | Punch-in no rosto em frase forte (`scale 1.15–1.2`) ou zoom lento (`slow: true`) em gráfico |

Marcar um ponto na gravação de tela: extraia o quadro do momento com grade e leia a posição.
```bash
ffmpeg -ss <t> -i public/reels/<id>/video.mp4 -frames:v 1 -vf "scale=540:960,drawgrid=w=54:h=48:t=1:c=yellow@0.6" work/<id>/z.jpg
```
Cada célula = 10% na horizontal e 5% na vertical. Ponto em % → `zooms.x/y`; em px (×10,8 e ×19,2) → `Scribble`.
Com zoom de escala S no ponto P, o elemento fica S× maior e P parado: dimensione o círculo em `w×S`, `h×S`.

## Jornal (`src/jornal`)

Vídeo em tela cheia + cartão branco de manchete fixo no topo (troca quando o assunto muda) + legenda em frase
amarela. Peças do raiz também funcionam. A manchete é o gancho: traga o ângulo de trader
(`"*Juros nos EUA dispararam:* o que muda no seu mini índice amanhã?"`).
Variação ainda não construída: print de notícia real no topo em vez do cartão (é o que mais estoura em macro) — construa
quando aparecer o primeiro vídeo de notícia, como uma peça `PrintNoticia` com imagem em `public/reels/<id>/`.

## Design / split (`src/kit` + `src/layout`)

Metade de cima com animação de marca, metade de baixo com o vídeo, legenda palavra por palavra na divisa.
Cada bloco é uma `<Scene from to>` (conteúdo centralizado em coluna, fade de entrada/saída).

| Peça | Uso |
|---|---|
| `Headline at text size serif` | Frase grande; `*palavra*` em destaque |
| `Counter at from to prefix suffix decimals plain label labelPosition` | Número contando (R$, %, ano com `plain`) |
| `Card at label value width valueSize tone` | Rótulo + valor |
| `Stamp at text tone rotate size` | Carimbo |
| `Checklist title titleAt items` | Itens entrando com ✓/✕ |
| `TradeDots at count losses stagger` | Uma bolinha por operação (verde gain, vermelha loss) |
| `CandleChart at drawFor closes levels` | Candles + linhas de entrada/stop/alvo no tempo da fala |
| `EquityCurve at drawFor values label` | Curva de patrimônio em degraus |
| `GateCard at question options choose chooseAt` | Caixa de decisão ("Executar a ordem?") |
| `Terminal at lines` | Linhas digitadas estilo log |
| `Disclaimer` | Aviso de resultado passado no pé da animação |

Se a gravação de cima for tela da plataforma, a metade de baixo mostra a prova: `faceSegments` com `"50% 45%"`.
Pessoa muito perto da câmera: priorize boca visível (corta o topo da cabeça).

## Comandos úteis

Juntar vídeos (gira e padroniza):
```bash
ffmpeg -i input/v1.mov -i input/v2.mov -filter_complex "[0:v:0]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,fps=30,setsar=1[v0];[1:v:0]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,fps=30,setsar=1[v1];[0:a:0]aresample=48000[a0];[1:a:0]aresample=48000[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -c:a aac input/junto.mp4
```

Comprimir para mandar na conversa (< 30 MB):
```bash
cd out && ffmpeg -y -i <id>.mp4 -c:v libx264 -preset slow -b:v 2500k -pass 1 -an -f null /dev/null && \
ffmpeg -y -i <id>.mp4 -c:v libx264 -preset slow -b:v 2500k -pass 2 -c:a aac -b:a 160k -movflags +faststart <id>-envio.mp4
```
