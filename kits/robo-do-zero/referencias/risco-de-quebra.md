# Ferramenta 4 — Risco de quebra

## A ideia

O backtest é **uma** ordem de operações que aconteceu. O futuro vai embaralhar essa ordem. O script sorteia 10 mil sequências possíveis a partir das operações do backtest e conta em quantas a conta quebra.

"Quebrar" aqui é perder um percentual do capital que tira a pessoa do jogo. O padrão é **50%**: depois de perder metade, é preciso dobrar o que sobrou só para voltar ao zero, e quase ninguém mantém a disciplina.

## Rodar

Com as operações do backtest (melhor):

```bash
python scripts/quebra.py --arquivo operacoes.txt --capital 5000
```

Só com o resumo (quando não há lista de operações):

```bash
python scripts/quebra.py --acerto 45 --ganho-medio 60 --perda-media 30 --capital 5000
```

Opções úteis:

- `--operacoes 250` — quantas operações cada simulação tem. Padrão: o mesmo número do backtest (ou 250 no modo resumo).
- `--quebra 50` — perda (% do capital) que conta como quebra.
- `--escala 2` — multiplica o resultado de cada operação. Use para simular 2 contratos em vez de 1.
- `--buscar-escala` — testa escalas de 1 a 10 e mostra até onde dá para aumentar a mão com risco de quebra abaixo de 5%.
- `--custo 1.0` — custo por operação em R$, se ainda não estiver descontado.
- `--semente 42` — fixa o sorteio para o resultado sair igual se rodar de novo.

## Como apresentar

1. **A frase principal:** "Em X de cada 100 futuros possíveis, sua conta perde metade antes de terminar as N operações."
2. **Os três cenários do capital final:** ruim (5% piores), típico (mediana) e bom (5% melhores).
3. **O drawdown que a pessoa deve esperar:** o típico e o ruim. Pergunte: "Você aguenta ver sua conta cair isso sem desligar o robô?"
4. **A maior sequência de perdas** no cenário ruim.
5. **Se o risco passar de 5%:** rode `--buscar-escala` ou sugira menos contratos ou mais capital. Mostre os números de novo.

## Limites honestos

Diga à pessoa:

- A simulação assume que o futuro se parece com o backtest. Se o mercado mudar, os números mudam.
- Operações reais costumam ser piores que o backtest (slippage, falhas de conexão, ordem não executada).
- Risco de quebra baixo não significa lucro garantido.
