---
name: carrossel-imagens-b3
description: Diagrama o carrossel semanal da parceria Rodrigo Cohen x B3 (@rodrigocohenoficial, terça 19h) no estilo tweet-mock dele (fundo branco, Inter, avatar + selo azul + @handle, um destaque amarelo por slide, um slide preto de virada), com imagem em todos os slides, checagem de número em fonte primária, compliance de publi B3 e PNGs 1080x1440 validados. Use quando a copy do carrossel B3 estiver aprovada e for hora de gerar os slides, ou quando Rodrigo pedir "faz os slides da B3", "diagrama o carrossel da B3", "monta o carrossel da parceria".
---

# carrossel-imagens-b3

Transforma a copy aprovada do carrossel da parceria B3 em PNGs prontos pra postar. Rodrigo posta manualmente; esta skill **não agenda nem publica nada**.

A copy vem antes, da skill `carrossel-instagram`. Aqui o trabalho é: conferir os números, escolher as imagens, diagramar, validar e escrever a legenda.

Arquivos desta skill (caminhos relativos ao "Base directory" informado quando a skill carrega):

- `workflow.md`: os 8 passos, com comandos. **Siga na ordem.**
- `archetypes.md`: os 5 arquétipos de slide e quando usar cada um.
- `design-system.md`: tokens visuais. `css/template.css` é a fonte da verdade.
- `identidade-derivada.md`: de onde veio cada decisão visual.
- `scaffold/`: `build.py`, `_export.js`, `validate.py`, `_print.js`, `_svg2png.js`, `grafico_svg.py`, `roteiro-exemplo.md`, `preview.html`.
- `assets/`: `avatar-circular.png` (Rodrigo), `foto-estudio.jpg`, `selo.svg`.
- `tests/`: `roteiro-dummy.md` + `expected-slides/` (referência de regressão).

## Regras que não se negociam

### Canvas e render
- Canvas único 1080x1440 (3:4). PNG final 2160x2880 (`deviceScaleFactor: 2`).
- Playwright via CLI/Node, nunca via MCP. Sequência: `networkidle` → `document.fonts.ready` → `waitForTimeout(1000)`.
- Inter via `@import` no topo do CSS. Se a Inter não carregar, o export falha de propósito.
- Se `require('playwright')` falhar: `NODE_PATH="$(npm root -g)" node ...`. Se não houver Playwright global: `npm i playwright` numa pasta de trabalho fora do Drive e use o Chromium já instalado.

### Texto
- **Em-dash proibido** em slide, legenda e fonte. Ponto, vírgula ou dois-pontos. `build.py` aborta se achar.
- **Itálico proibido** em qualquer texto de slide.
- **Uma frase por parágrafo.** Todo `.`, `?`, `!` vira um `<p>`. Abreviações (`Sr.`, `etc.`) não quebram.
- **Um destaque `==...==` por slide**, dentro de uma frase só. Lidos em sequência, os destaques contam o carrossel inteiro.
- **Fonte mínima de corpo 36px.** Abaixo de 44px, avise o Rodrigo. Ele já reclamou: "as fontes não ficaram grandes".
- **Fidelidade ao roteiro.** O renderer só formata. Nunca reescreve, resume ou expande a copy aprovada. Se o texto não cabe, devolva pro Rodrigo com sugestão de corte; não corte sozinho.

### Imagem em todos os slides
Ordem de preferência obrigatória:
1. **Foto real do Rodrigo** (eventos, B3, bastidor). Pergunte antes se ele tem foto do assunto.
2. **Print de fonte oficial** (b3.com.br, Bora Investir, bcb.gov.br) com `_print.js`.
3. **Gráfico com dado real** conferido na fonte primária (`grafico_svg.py`).
4. **Diagrama** (SVG escrito à mão). Último recurso.

Sem imagem de IA. Slide sem imagem só com justificativa explícita na entrega.

**Altura mínima da imagem: foto 420px, print/gráfico/diagrama 360px.** Abaixo disso a foto vira faixa e corta cabeça ou logo (já aconteceu: logo da B3 no púlpito cortado pela metade num slide de CTA). Se o texto não deixa espaço, o export falha. A saída é cortar texto com o Rodrigo ou dividir o slide, nunca espremer a foto.

**Recorte da foto:** depois do export, abra cada slide com foto e confira que a pessoa e o logo da B3 (púlpito, telão, parede) aparecem inteiros. Logo da B3 cortado num post pago da B3 não sai. Ajuste `imagem_pos` ou `imagem_altura` e gere nova versão.

**Todo print e todo gráfico é aberto com Read antes de entrar no slide.** Site da B3 já devolveu página cheia de erro de PHP e banner de cookies. Varra também CPF, conta, saldo, nome de terceiro e logo de concorrente; corte e avise.

### Números
- Todo percentual, valor, data ou estatística passa por fonte primária antes da arte (b3.com.br, borainvestir.b3.com.br, bcb.gov.br, tesourodireto.com.br, IBGE).
- Pico não é nível atual. Estudo do ano passado não é deste ano. Dado de mercado envelhece em dias: prefira o fato que não vence.
- A copy diz "hoje" e o post sai terça? Ajuste.
- Aritmética conferível no celular. Conta simples primeiro.
- Correções vão numa tabela curta (copy vs oficial) antes dos slides.

### Compliance da parceria B3
- B3 = melhor amiga do trader, instituição séria, educação e transparência. **Nunca** associar a cassino, jogo, aposta ou especulação.
- Publi: `#publi` na legenda + lembrar o Rodrigo de ativar "parceria paga" com a B3 no Instagram + alinhar com o compliance da B3 antes de postar.
- Nada de recomendação de compra/venda ou promessa de ganho. "Muda o seu processo", não "muda o seu resultado".
- Disclaimer na **legenda** (não no slide; o rodapé `fonte:` é só pra fonte de dado) sempre que citar ativo ou produto: `Rodrigo Cohen, Analista CNPI. Conteúdo educacional, não é recomendação de investimento.`
- Não reproduzir logo da B3 como elemento gráfico da arte. Logo só aparece se estiver dentro de um print oficial.
- Nome de terceiro, parceiro não anunciado ou concorrente: só com autorização explícita.

### Editorial
- Capa com dissonância cognitiva. Sem apresentação, sem jargão.
- Voz unificada do começo ao fim.
- Um slide `virada` (preto) no ponto de virada do argumento.
- Momento íntimo (família, fé, homenagem) não leva destaque amarelo.

### Legenda
- **Nunca copia os slides.** Traz cena, bastidor ou dado que não está na arte.
- Estrutura: abertura forte → o que não cabia no slide → pergunta que puxa comentário → CTA (o CTA emocional mora aqui, não no slide).
- Fecha com disclaimer CNPI (quando cabível), `#publi` e poucas hashtags do assunto.

### Output
- Pasta: `<diretório de trabalho>/carrosseis-b3/<YYYY-MM-DD>-<slug>/vN/`. N = próxima versão livre.
- **Nunca sobrescrever `vN/` existente.** Toda correção vira `v(N+1)`.
- Idempotente: imagem que já existe em disco não é recapturada.

## Entrega (sempre nesta ordem)
1. Tabela de números corrigidos (se houve).
2. PNGs via `SendUserFile`, numerados na ordem de postagem.
3. `legenda.txt` via `SendUserFile`.
4. O que você mudou por conta própria e por quê.
5. Riscos editoriais ou de compliance que sobraram, uma linha cada.
6. Lembrete: postar terça 19h, ativar parceria paga com a B3.
7. Fontes em links.
