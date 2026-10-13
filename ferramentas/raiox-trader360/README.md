# Raio-X do Trader — Mentoria Trader 360

Endereço: https://raiox.tradernation.com.br (CNAME `raiox` → `cname.vercel-dns.com` no Registro.br). Os endereços `*.vercel.app` do projeto redirecionam para ele.

Diagnóstico de mindset da aula inaugural. Projeto Vercel próprio (`raiox-trader360`), independente do hub.

- `/` — formulário do aluno + resultado na hora (`/?r=<id>` reabre o resultado).
- `/painel?k=<PAINEL_KEY>` — painel ao vivo da turma (atualiza a cada 10 s).
- Respostas ficam no Vercel Blob privado `raiox-trader360-respostas`, uma por aluno em `respostas/<id>.json`.

## Editar textos
Tudo que o aluno lê está em `conteudo.js` (afirmações, padrões, devolutivas, forças, perguntas).

## Áudios
Suba os arquivos em `audios/` e preencha os caminhos em `RAIOX.audios` no `conteudo.js`. O player aparece sozinho.

## Diagnóstico público (captação)
- `/diagnostico` — mesma ferramenta, aberta ao público, com WhatsApp obrigatório, aceite de contato e chamada para a Trader 360 no fim.
- Contatos ficam em `leads/` (separados da turma). Painel: `/painel?k=<PAINEL_KEY>&v=leads`, com botão de planilha (CSV).
- Textos da chamada final, links e encontros por padrão: `RAIOX.publico` no `conteudo.js`.

## Pontos cegos
Regras de contradição entre respostas em `window.pontosCegos` (`conteudo.js`).
