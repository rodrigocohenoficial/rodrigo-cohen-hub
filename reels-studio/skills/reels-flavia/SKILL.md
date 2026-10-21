---
name: reels-flavia
description: Edita os Reels da Dra. Flávia Cohen (@flaviavcohen) no estilo dela — tela dividida com animações sincronizadas com a fala em cima e o vídeo embaixo, caixas de gancho amarela e branca, paleta rosé, legenda palavra por palavra com a palavra falada em amarelo, ingredientes ilustrados e marcação de publicidade discreta. Use sempre que a Flávia mandar um vídeo (anexo ou link do Google Drive) para editar, pedir para "deixar no meu estilo", legendar, cortar, acelerar, colocar textos/imagens/animações num Reel, fazer um Reel de publi com marca (como a Always Fit), ou pedir a legenda do post de um Reel — mesmo que ela não fale em "skill", "Remotion" ou "edição".
compatibility: Claude Code (web ou desktop) com Node 18+, ffmpeg e Python 3. Internet na primeira vez (npm e pip).
---

# Reels no estilo da Dra. Flávia Cohen

A Flávia é médica (infectologista por formação), fala com mulheres 40+ sobre menopausa, reposição hormonal,
emagrecimento, suplementação e biohacking. Tom acolhedor, direto, com o 🤍 como assinatura.
O guia completo da marca está em `references/marca.md` — leia antes do primeiro Reel da conversa.

O resultado é um Reel 1080×1920: **metade de cima** com animações no tom dela (títulos, cartões, checklist,
ingredientes ilustrados, foto do produto), **metade de baixo** com a gravação dela, e **legenda** na divisa,
palavra por palavra, sincronizada com a fala. Tudo é feito em código (Remotion), a partir da transcrição com o
tempo exato de cada palavra (Whisper). Por isso cada animação entra no segundo em que ela fala daquilo.

## Primeira vez na conversa: preparar o estúdio

O estúdio está em `estudio/`, dentro da pasta desta skill. Copie para a pasta de trabalho (uma vez só) e instale:

```bash
SKILL_DIR="<pasta desta skill>"
[ -d reels-flavia ] || cp -r "$SKILL_DIR/estudio" reels-flavia
cd reels-flavia && npm install && pip install faster-whisper numpy
npx tsc --noEmit && npm run preview -- demo 1.5 7.5 13   # teste: gera out/demo-preview.png
```

Se o teste gerar a prévia, está pronto. O primeiro `novo` baixa o modelo do Whisper (~1,5 GB), demora uns minutos.

## O fluxo (sempre nesta ordem)

### 1. Receber o vídeo

- **Anexo**: salve em `reels-flavia/input/`.
- **Link do Google Drive** (`/file/d/<ID>/`): baixe direto, sem passar o arquivo pela conversa (vídeos têm centenas de MB):
  ```bash
  curl -sSL --retry 4 -o input/<nome>.mov "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"
  ffprobe -v error -show_entries format=duration -of csv=p=0 input/<nome>.mov   # confere que é vídeo
  ```
  Se vier HTML ou erro de acesso, peça para ela compartilhar como "Qualquer pessoa com o link" ou anexar.
  Se só tiver o nome do arquivo e houver conector do Drive, procure o ID pelo nome.
- **Dois ou mais vídeos para juntar**: normalize e concatene na ordem que ela indicar (o `scale/pad` resolve vídeo girado):
  ```bash
  ffmpeg -i input/v1.mov -i input/v2.mov -filter_complex "[0:v:0]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,fps=30,setsar=1[v0];[1:v:0]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,fps=30,setsar=1[v1];[0:a:0]aresample=48000[a0];[1:a:0]aresample=48000[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -c:a aac input/junto.mp4
  ```

### 2. Perguntar só o que falta

Antes de editar, confirme o que não dá para deduzir: **é publi?** (de qual marca), **tem algo que ela quer destacar ou
evitar?** Não pergunte o que ela já disse nem o que você consegue ver no vídeo. Ela prefere **sem CRM/RQE no vídeo**
e a marcação de **"Publicidade" pequena** quando for publi.

### 3. Preparar e ler

```bash
npm run novo -- <id> input/<arquivo>      # id em minúsculas com hífen, ex: flavia-02
```

Gera `public/reels/<id>/video.mp4`, `transcript.json` e, em `work/<id>/`, `transcript.txt` (frases e palavra a palavra
com o segundo de cada uma) e quadros a cada 2s. Leia a transcrição inteira e monte uma folha de quadros para ver
enquadramento, quando ela muda de posição e quando mostra o produto:

```bash
cd work/<id>/frames && ffmpeg -y -pattern_type glob -i 't*.jpg' -vf "scale=150:-2,tile=12x4" ../folha.jpg
```

**Corrija a transcrição** antes de qualquer coisa: o Whisper erra nomes de marca e termos técnicos, e a legenda
mostra exatamente o que estiver no `transcript.json`. Corrija o texto da palavra (mantendo os tempos); para juntar
palavras quebradas (ex: "gama" + "-linolênico"), una as duas numa só com o `start` da primeira e o `end` da segunda.
Faça isso no `transcript-bruto.json` se já existir (o corte parte dele), senão no `transcript.json`.

### 4. Cortes e ritmo

A Flávia quer vídeos dinâmicos. Por padrão, proponha:

- tirar o silêncio do começo e a despedida solta do fim ("Tchau!");
- `--pausas`: encurta toda pausa maior que 0,3s para um respiro de 0,15s (detectado no áudio, não na transcrição);
- `velocidade: 1.1` no Reel (acelera sem mudar o tom da voz).

```bash
npm run cortar -- <id> 0-2.25 92.75-95.08 --pausas    # trechos em segundos do vídeo original
```

O corte sempre parte do original (`video-bruto.mp4`), então pode refazer com outros cortes. **Depois de cortar, os
tempos mudam**: monte o plano em cima da transcrição nova (`python3 -c` lendo `public/reels/<id>/transcript.json`).
Trechos com erro de fala, repetição ou frase que promete demais: proponha o corte no plano, ela decide.

### 5. Plano de cenas → aprovação dela

Escreva `src/reels/<id>/plano.md` e mostre na conversa como tabela curta:

| Tempo | Ela fala | Aparece em cima |
|---|---|---|

Divida o vídeo em cenas de 3 a 10s, uma ideia por cena, e escolha para cada uma a peça do kit que melhor ilustra
o que ela diz (catálogo em `references/kit.md`). O começo e o fim usam as **caixas de gancho** dela.
Gere 4 a 8 quadros de prévia (passo 7) e mande junto. **Não renderize o vídeo final antes do "ok" dela**: o render
leva minutos e o conteúdo é dela — ela pode querer outro gancho, outro corte ou tirar uma cena.

### 6. Escrever as cenas

- `src/reels/<id>/Scenes.tsx`: veja o exemplo completo em `references/exemplo-reel.md`.
- Registre em `src/reels/index.ts`:
  ```ts
  { id: "flavia-02", Scenes: Flavia02Scenes, tag: "@flaviavcohen", velocidade: 1.1,
    faceSegments: [{ from: 0, position: "50% 0%" }, { from: 20.4, position: "50% 8%" }] }
  ```
- Todo `at`/`from`/`to` é **segundo da fala** (do `transcript.json` já cortado), mesmo com `velocidade` — o estúdio converte.
- `faceSegments`: a metade de baixo mostra metade da altura do vídeo. Em pé e longe, `"50% 0%"`; sentada, `"50% 8%"`.
  Ajuste olhando a prévia: rosto inteiro visível, boca nunca cortada.
- Foto do produto: recorte do próprio vídeo, do arquivo original (mais resolução), no momento em que o produto está de frente:
  ```bash
  ffmpeg -ss <segundo> -i input/<original>.mov -frames:v 1 -vf "crop=iw*0.20:ih*0.17:iw*0.47:ih*0.37" public/reels/<id>/produto.png
  ```
  Ache a posição com um quadro com grade (`drawgrid`) e confira a imagem antes de usar.

### 7. Prévia, render e entrega

```bash
npx tsc --noEmit
npm run preview -- <id> 2 15 30 45 60      # segundos do VÍDEO FINAL (já acelerado); gera out/<id>-preview.png
npm run render -- <id>                     # out/<id>.mp4
```

Olhe a prévia de verdade antes de mostrar: texto estourando a largura, cena vazia em cima por mais de ~1,5s enquanto
ela fala, legenda cobrindo algo, rosto cortado, emoji 🤍 sobre fundo branco (some). Corrija e gere de novo.

Para mandar pela conversa (limite ~30 MB), comprima mantendo qualidade boa para Instagram:

```bash
cd out && ffmpeg -y -i <id>.mp4 -c:v libx264 -preset slow -b:v 2600k -pass 1 -an -f null /dev/null && \
ffmpeg -y -i <id>.mp4 -c:v libx264 -preset slow -b:v 2600k -pass 2 -c:a aac -b:a 160k -movflags +faststart <id>-envio.mp4
```

Entregue com: duração final, o que foi cortado/acelerado e a **legenda do post** no tom dela (formato em
`references/marca.md`). Se for publi, lembre de ativar a etiqueta "parceria paga" do Instagram e de conferir o @ da marca.

## Conteúdo de saúde: o que nunca fazer

As animações **ilustram o que ela fala**. Não acrescente promessa, número, efeito ou benefício que ela não disse —
em conteúdo médico e de suplemento isso cria risco ético e regulatório para ela. Detalhes em `references/conteudo-medico.md`.

## Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| Elemento não aparece dentro de uma cena | Peça usando o relógio local da cena. Use `useSeconds()` (segundo global da fala) de `src/kit/time.tsx` |
| Pausas não detectadas | Gravação externa com ruído. O `cortar` usa -24 dB com filtro de grave; se ainda falhar, teste o limiar com `silencedetect` |
| Palavras somem da legenda após corte | Não deveria (o corte encaixa a palavra na borda). Se acontecer, confira se a palavra estava inteira dentro de um corte |
| Legenda estoura a largura | Já quebra antes de palavra longa; se persistir, encurte a palavra na transcrição (ex: abreviação) |
| Render falha baixando navegador | Em Claude Code na nuvem o `remotion.config.ts` usa o Chromium da máquina; fora dela o Remotion baixa sozinho |
| "Ficou sem áudio" | Confira com `ffmpeg -i out/<id>.mp4 -af volumedetect -f null -`. Se tiver volume, é o player mudo/iPhone no silencioso |
