# Ativos da B3 — o que o robô precisa saber

Confira sempre os valores vigentes no site da B3 (b3.com.br). Contrato, horário e custo mudam.

## Mini Índice (WIN)

- **Variação mínima (tick):** 5 pontos. Todo preço de ordem tem que ser múltiplo de 5.
- **Valor do ponto:** R$ 0,20 por contrato. Um stop de 150 pontos com 1 contrato = R$ 30.
- **Código:** muda a cada vencimento (ex.: WINZ26). Nas plataformas existe a série contínua (ex.: `WIN$` ou `WIN$N`) para backtest.
- **Vencimento:** a cada dois meses (meses pares), na quarta-feira mais próxima do dia 15.

## Mini Dólar (WDO)

- **Variação mínima (tick):** 0,5 ponto.
- **Valor do ponto:** R$ 10,00 por contrato. Um stop de 5 pontos com 1 contrato = R$ 50.
- **Código:** muda todo mês (ex.: WDOX26). Série contínua para backtest (ex.: `WDO$` ou `WDO$N`).
- **Vencimento:** primeiro dia útil do mês.

## Ações

- **Variação mínima:** R$ 0,01.
- **Resultado:** quantidade de ações × variação do preço.
- Lote padrão de 100 ações. Fracionário tem código com "F" no final e liquidez menor.

## Horário

- O pregão de WIN e WDO abre de manhã e fecha no fim da tarde. O horário exato muda quando os Estados Unidos entram ou saem do horário de verão. **Pergunte à pessoa ou mande conferir no site da B3** antes de fixar o horário de zeragem.
- Sugestão padrão de zeragem: **30 minutos antes do fechamento**. Os minutos finais têm spread maior e o call de fechamento.
- Evite operar nos primeiros minutos do pregão no começo. O preço costuma ser mais instável.

## Custos que entram no backtest

- **Corretagem:** depende da corretora. Pergunte. Se a pessoa não souber, use R$ 0.
- **Emolumentos e taxas da B3:** peça o valor à pessoa (sai na nota de corretagem). Sem esse dado, use R$ 0,50 por contrato por lado (R$ 1,00 por operação completa) e avise que é uma estimativa conservadora.
- **Slippage (escorregão):** a diferença entre o preço da ordem e o preço executado em stops e ordens a mercado. Use **1 tick por lado** como padrão (5 pontos no WIN, 0,5 ponto no WDO).
- **Imposto:** day trade paga 20% sobre o lucro líquido do mês. O backtest normalmente não desconta isso. Lembre a pessoa.

## Margem

Cada corretora define a margem de garantia por contrato no day trade. Pergunte o valor quando a pessoa disser quantos contratos quer operar. O capital tem que cobrir margem **e** o pior drawdown da simulação.
