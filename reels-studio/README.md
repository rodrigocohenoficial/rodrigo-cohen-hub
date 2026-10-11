# Reels Studio

Animações sincronizadas com a fala para os Reels do Rodrigo Cohen.
Tela dividida: animação em cima, gravação embaixo, legenda palavra por palavra no meio.
Paleta e fontes do rodrigocohen.com.br.

Projeto separado do site (fora do build do Next e do deploy da Vercel).

## O fluxo

| # | Etapa | Quem faz | Como |
|---|-------|----------|------|
| 1 | Gravar | Rodrigo | Celular na vertical, rosto no terço de cima, microfone de lapela |
| 2 | Preparar | Claude | `npm run novo -- <id> <video>`: normaliza o vídeo, transcreve palavra por palavra e tira quadros a cada 2s |
| 3 | Plano de cenas | Claude | Lê a transcrição e os quadros e escreve `src/reels/<id>/plano.md` |
| 4 | **Aprovação** | Rodrigo | Nada é renderizado antes do "ok" no plano |
| 5 | Cenas | Claude | Escreve `src/reels/<id>/Scenes.tsx` com o kit e registra em `src/reels/index.ts` |
| 6 | Prévia | Claude | `npm run preview -- <id> 2 8 15`: quadros nos segundos pedidos, para conferir |
| 7 | Render | Claude | `npm run render -- <id>` gera `out/<id>.mp4` (1080x1920, 30 fps, com áudio) |

## Três estilos

| Estilo | Visual | Quando usar |
|--------|--------|-------------|
| `split` (padrão) | Animação de marca em cima, vídeo embaixo | Conteúdo explicativo: macro, conceito, como funciona o robô |
| `raiz` | Vídeo em tela cheia, legenda grossa branca/amarela, intervenções pontuais | Resultado, opinião, polêmica, bastidor: onde a prova e o rosto são o conteúdo |
| `jornal` | Vídeo em tela cheia, cartão de manchete fixo com marca-texto, legenda em frase | Macro e notícia (Copom, juros, payroll, dólar, cripto), com o ângulo "o que muda no WIN/WDO" |

No `raiz` (`src/raiz`): `zooms` no ReelDef dão zoom no vídeo (com `freeze: true` o quadro congela e o áudio segue),
`Scribble` risca um círculo vermelho em volta do número, `Pop` estoura um número/texto, `TopText` é a faixa do gancho,
`StampRaiz` é o carimbo e `DisclaimerRaiz` o aviso. O mesmo vídeo pode ter as duas versões (`media` aponta para a pasta da gravação).

No `jornal` (`src/jornal`): `manchetes` no ReelDef define o cartão (`*trecho*` sai marcado de amarelo; várias manchetes
trocam no segundo `from`). Zooms e peças do raiz também funcionam aqui. Exemplo: `exemplo-jornal`.

## Kit de animações do split (`src/kit`)

Tudo recebe `at` = o segundo da fala em que o elemento entra (vem da transcrição).

| Peça | Para quê |
|------|----------|
| `Scene` | Bloco da metade de cima, de `from` até `to` segundos |
| `Headline` | Frase grande; `*palavra*` sai em dourado |
| `Stamp` | Carimbo batendo na tela ("NUNCA", "SEM ORDEM") |
| `Counter` | Número contando (R$, %, anos, alunos) |
| `Card` | Rótulo + valor ("STOP" / "150 pts") |
| `CandleChart` | Candles sendo desenhados + linhas de entrada, stop e alvo no tempo da fala |
| `GateCard` | Caixa de decisão ("Executar a ordem? 1. Sim 2. Ajustar") |
| `Checklist` | Itens com ✓ ou ✕ entrando um a um |
| `Terminal` | Linhas digitadas, estilo log de robô ou plataforma |

## Comandos

```bash
npm install
npm run studio                      # editor visual no navegador
npm run novo -- reel-01 gravacao.mp4
npm run preview -- reel-01 2 8 15
npm run render -- reel-01
```

O Whisper roda local: `pip install faster-whisper numpy`. Modelo padrão `large-v3-turbo` (acerta termos de mercado); `WHISPER_MODEL=small` é mais rápido e erra mais.

## Pastas

- `public/reels/<id>/`: `video.mp4` (fora do git) e `transcript.json`
- `work/<id>/`: áudio, `transcript.txt` legível e quadros (fora do git)
- `out/`: renders (fora do git)
- `public/fonts/`: Fraunces e Inter locais, para o render sair igual em qualquer máquina
