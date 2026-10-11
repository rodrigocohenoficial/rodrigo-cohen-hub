---
name: videos-insta-virais
description: Edita Reels virais do Rodrigo Cohen a partir de um vídeo gravado (anexo ou Google Drive), em 3 estilos com animações sincronizadas palavra por palavra com a fala — raiz (tela cheia, legenda grossa, círculo e zoom na prova), jornal (manchete fixa com marca-texto, para macro e notícia) e design (animação de marca em cima, vídeo embaixo) — e também Reels da Dra. Flávia Cohen no tema dela. Use sempre que o Rodrigo mandar um vídeo para editar, pedir Reel, corte, legenda animada, "deixar viral", "versão raiz", "estilo jornal", "tela dividida", teste A/B de Reel, ou pedir para editar um vídeo da Flávia — mesmo sem falar em skill, Remotion ou edição.
compatibility: Claude Code (web ou desktop) com Node 18+, ffmpeg e Python 3. Internet na primeira vez (npm e pip).
---

# Vídeos Insta Virais — estúdio de Reels do Rodrigo Cohen

Transforma uma gravação em Reel 1080×1920 com animações em código (Remotion), sincronizadas com a transcrição
palavra por palavra (Whisper). Três estilos para o Rodrigo, mais o tema da Dra. Flávia.

Antes do primeiro Reel da conversa, leia `references/marca-rodrigo.md` (voz, compliance, parceiros) e
`references/estilos.md` (como cada estilo funciona). Para vídeos da Flávia, leia `references/flavia.md`.

## Primeira vez na conversa: preparar o estúdio

```bash
SKILL_DIR="<pasta desta skill>"
[ -d videos-insta-virais ] || cp -r "$SKILL_DIR/estudio" videos-insta-virais
cd videos-insta-virais && npm install && pip install faster-whisper numpy
npx tsc --noEmit && npm run preview -- demo 2.6 8.5 15     # teste: gera out/demo-preview.png
```

Se o repositório do usuário já tiver uma pasta `reels-studio/` com este estúdio, use ela em vez de copiar.

## Qual estilo usar

| Conteúdo | Estilo | Por quê |
|---|---|---|
| Resultado, opinião forte, polêmica, bastidor, oferta | **raiz** (padrão, ~70% dos Reels) | Formato que mais estoura no nicho de finanças: rosto + prova crua parecem reais; design muito produzido lê como anúncio |
| Notícia e macro (Copom, juros, payroll, dólar, cripto) | **jornal** (~20%) | Manchete fixa segura retenção: quem chega no meio entende o assunto. Ângulo obrigatório: "o que muda no WIN/WDO" |
| Explicativo: conceito, como funciona o robô, passo a passo | **design** (split, ~10%) | Quando o diagrama é a entrega |

Na dúvida, proponha raiz. Para testar estilo, faça duas versões do mesmo vídeo (mesmos cortes, mesmo áudio) e
sugira postar uma normal e a outra como "Reel de teste"; compare retenção dos 3s iniciais e comentários em 48h.
Dados da pesquisa de formatos virais em `references/viral.md`.

## O fluxo (sempre nesta ordem)

### 1. Receber o vídeo

- **Anexo**: salve em `input/`.
- **Google Drive**: baixe direto pelo ID (não passe vídeo pela conversa — são centenas de MB):
  ```bash
  curl -sSL --retry 4 -o input/<nome>.mov "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"
  ```
  Com conector do Drive, ache o ID pelo nome do arquivo. Se baixar HTML/erro, peça compartilhamento "qualquer pessoa com o link".
- **Vários vídeos para juntar**: normalize e concatene na ordem pedida (comando em `references/estilos.md`).

### 2. Definir antes de criar

Avatar-alvo (Frustrado / Iniciante / Empreendedor) e métrica-alvo (compartilhamento / salvamento / comentário / replay).
Pergunte o que não der para deduzir (ex: nome de produto, se é publi). Não pergunte o que o vídeo já responde.

### 3. Preparar e ler

```bash
npm run novo -- <id> input/<arquivo>          # vídeos da Flávia: WHISPER_VOCAB=flavia npm run novo -- ...
```

Leia `work/<id>/transcript.txt` inteiro e monte a folha de quadros
(`cd work/<id>/frames && ffmpeg -y -pattern_type glob -i 't*.jpg' -vf "scale=150:-2,tile=12x4" ../folha.jpg`).
Veja enquadramento, se é rosto ou tela da plataforma, e onde estão os números na tela.

**Corrija a transcrição** (a legenda mostra exatamente o que está no JSON): erros do Whisper ("ACAE" → "acerto"),
nomes de produto, e **valores juntos numa palavra só** (`"R"`, `"$2"`, `".823,"` → `"R$2.823,"`; `"96"`, `",3"`, `"%"` → `"96,3%"`),
com o `start` da primeira e o `end` da última. Confira os números contra a tela quando houver print/gravação da plataforma.

### 4. Cortes

- Gancho fraco no começo ("Bom, vamos lá…") → corte e abra na frase que provoca.
- Frase de promessa de ganho junto de oferta → proponha cortar (risco CNPI/CVM, ver marca).
- Pausas: `--pausas` encurta silêncios > 0,3s para 0,15s. `velocidade: 1.1` acelera sem mudar o tom (só no estilo design por enquanto).

```bash
npm run cortar -- <id> 0-6.05 75.62-80.72 [--pausas]   # segundos do vídeo original; sempre parte do bruto
```

Depois do corte os tempos mudam: planeje em cima do `transcript.json` novo.

### 5. Plano → aprovação

Escreva `src/reels/<id>/plano.md` e mostre como tabela (Tempo · Fala · Aparece na tela), com avatar, métrica,
cortes propostos e 4–8 quadros de prévia. **Não renderize antes do "ok"**: o render leva minutos e quem decide o
conteúdo é ele.

### 6. Montar

`src/reels/<id>/Scenes.tsx` + registro em `src/reels/index.ts`. Peças e opções de cada estilo em
`references/estilos.md`; Reels reais completos em `references/exemplos.md`. Todo tempo é **segundo da fala**.

### 7. Prévia, render, entrega

```bash
npx tsc --noEmit && npm run preview -- <id> 2 15 30 45 60   # segundos do vídeo final
npm run render -- <id>
```

Confira a prévia de verdade: texto estourando, cena vazia > 1,5s, rosto/boca cortados, número tapando o rosto,
círculo fora do número. Para mandar pela conversa (limite ~30 MB), comprima em 2 passadas a ~2,5 Mbps
(comando em `references/estilos.md`).

Entregue com a **[LEGENDA]** do post: 3–4 linhas, começa com a frase mais forte do vídeo, termina com CTA
alinhado à métrica-alvo, e "Resultado passado não garante resultado futuro." quando mostrar resultado.

## Regras que não se negociam

- Nada de "Oi, eu sou…" e nada de jargão nos primeiros 5s. Gancho para o scroll de um estranho.
- Resultado mostrado = aviso "Resultado passado não garante resultado futuro." na tela e na legenda.
- Nunca promessa de ganho, nunca "garantido", nunca associar Santander a custo/complexidade ou B3 a jogo/cassino.
- Os números da tela vêm da prova (print, plataforma), não só da fala.
- Vídeos da Flávia: só o tema dela, regras de conteúdo médico dela (`references/flavia.md`).
- O estilo de um não contamina o outro: o tema é por Reel (`tema: "flavia"`), o padrão é o do Rodrigo.

## Problemas comuns

| Sintoma | Solução |
|---|---|
| Peça não aparece dentro de uma cena | Relógio local da cena: use `useSeconds()` (segundo global) de `src/kit/time.tsx` |
| Fontes falham no render (erro de certificado) | Use as fontes locais de `public/fonts` (já configurado); não use Google Fonts |
| Círculo/zoom fora do número na gravação de tela | A câmera mexe: use `freeze: true` no zoom e marque o ponto no quadro congelado com grade (`drawgrid`) |
| Pausas não detectadas | Gravação com ruído: o corte usa -24 dB com filtro de grave; ajuste testando `silencedetect` |
| "Ficou sem áudio" | `ffmpeg -i out/<id>.mp4 -af volumedetect -f null -`. Com volume, é player mudo/iPhone no silencioso |
| Render baixa navegador e falha | Na nuvem o `remotion.config.ts` usa o Chromium da máquina (`/opt/pw-browsers`) |
