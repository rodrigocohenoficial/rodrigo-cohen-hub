# Raio-X do Trader — Mentoria Trader 360

Diagnóstico de mindset da aula inaugural. Projeto Vercel próprio (`raiox-trader360`), independente do hub.

- `/` — formulário do aluno + resultado na hora (`/?r=<id>` reabre o resultado).
- `/painel?k=<PAINEL_KEY>` — painel ao vivo da turma (atualiza a cada 10 s).
- Respostas ficam no Vercel Blob privado `raiox-trader360-respostas`, uma por aluno em `respostas/<id>.json`.

## Editar textos
Tudo que o aluno lê está em `conteudo.js` (afirmações, padrões, devolutivas, forças, perguntas).

## Áudios
Suba os arquivos em `audios/` e preencha os caminhos em `RAIOX.audios` no `conteudo.js`. O player aparece sozinho.
