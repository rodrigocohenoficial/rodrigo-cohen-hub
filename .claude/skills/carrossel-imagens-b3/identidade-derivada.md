# Identidade derivada: carrossel-imagens-b3

Base: skill `carrossel-cohen` (estilo tweet-mock do Rodrigo Cohen), escolhida pelo próprio Rodrigo como referência visual. Gerada com `gerador-skills-carrosseis`, cuja canônica é a da ibe.IA. Esta tabela registra o diff contra as duas.

| Aspecto | Canônica ibe.IA | carrossel-cohen | Neste template | Razão |
|---|---|---|---|---|
| Estilo macro | glassmorphism | tweet-mock | tweet-mock | Pedido do Rodrigo: "o que está gravado na skill estilo X" |
| Paleta | laranja/roxo/azul | branco + tinta + amarelo | igual à carrossel-cohen | Identidade pessoal do Rodrigo no feed |
| Fontes | Sora + Plus Jakarta | Inter | Inter (via `@import`) | Idem. `@import` em vez de `@font-face` local pra não depender de arquivo de fonte no container |
| Letter-spacing | -0.07em display / -0.02em corpo | -0.005em | -0.005em | Tweet-mock usa tracking quase neutro. Desvio documentado |
| Header | nenhum | avatar + nome + selo + handle | igual à carrossel-cohen | Autoridade pessoal quando o post é compartilhado |
| Imagens | print > svg > ai | foto > print > gráfico > diagrama | foto > print > gráfico > diagrama, sem IA | Prova real vale mais que ilustração. Sem chave de IA no ambiente |
| Render | Playwright | WeasyPrint + pdftoppm | Playwright | Hard rule do gerador. Permite `object-fit: cover` e ajuste automático de fonte |
| Recorte de foto | n/a | PIL na proporção exata, `object-fit: fill` | `object-fit: cover` + `imagem_pos` | Elimina a distorção que o Rodrigo já apontou, sem recorte manual a cada mudança de altura |
| Ajuste de fonte | manual | loop anti-overflow manual | automático no navegador, sempre a partir do máximo | Resolve "a fonte vai minguando a cada rodada" |
| Canvas | 1080x1440 | 1080x1440 | 1080x1440 | Sem desvio |
| Compliance | n/a | CNPI + publi | CNPI + publi B3 + B3 nunca como cassino/especulação | Parceria paga B3 |
