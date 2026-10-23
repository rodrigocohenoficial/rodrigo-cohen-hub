# Ferramenta 3 — Ler o backtest

## Coletar os dados

A pessoa manda **prints**. Peça nesta ordem:

1. Print do **resumo** do backtest (resultado, número de operações, taxa de acerto, drawdown). Onde achar: `passo-a-passo-plataformas.md`.
2. Print da **lista de operações**, se for curta o bastante para caber em poucos prints. Se for longa, o resumo basta.

Se a pessoa souber exportar a lista para arquivo (Excel ou CSV) e anexar aqui, melhor ainda. Não exija isso.

Confira com a pessoa os números que você leu do print antes de rodar qualquer coisa: "Li 312 operações, 41% de acerto e drawdown de R$ 820. Confere?"

**Quem monta o arquivo é você.** Com a lista de operações em mãos, extraia o resultado líquido de cada operação (em R$, ou em pontos) e salve um por linha:

```
-30
60
60
-30
...
```

Se vier em pontos, use `--valor-ponto` (0.20 no WIN, 10 no WDO) e `--contratos`.

**Só com o resumo:** pule `metricas.py`, use os números do print e vá direto para a ferramenta 4 no modo resumo (`--acerto --ganho-medio --perda-media`). Avise que sem a lista de operações não dá para medir concentração nem sequência de perdas real.

## Rodar

```bash
python scripts/metricas.py operacoes.txt --capital 5000 --custo 1.0
python scripts/metricas.py operacoes.txt --valor-ponto 0.2 --contratos 1 --capital 5000
python scripts/metricas.py --help
```

- `--custo` é o custo por operação completa em R$ (corretagem + taxas). Se a pessoa já configurou custo na plataforma, não desconte de novo.
- `--slippage-pontos` desconta escorregão por operação (em pontos, precisa de `--valor-ponto`).
- `--dias` informa quantos pregões o backtest cobriu, para calcular operações por dia.

## Como explicar cada número

| Métrica | O que é | Referência prática |
|---|---|---|
| Operações | Quantos trades o backtest tem | Menos de 100: amostra pequena, conclusão fraca. 200+ é o mínimo para levar a sério. |
| Taxa de acerto | % de operações no lucro | Sozinha não diz nada. Precisa olhar junto com o payoff. |
| Payoff | Ganho médio ÷ perda média | Acerto de 35% funciona com payoff acima de 2. Acerto de 70% funciona com payoff perto de 0,6. |
| Expectativa | Quanto o robô ganha, em média, por operação | Tem que ser positiva **depois** dos custos. |
| Fator de lucro | Soma dos ganhos ÷ soma das perdas | Abaixo de 1,2: margem fina, o custo real come. Acima de 3: desconfie de ajuste demais ao passado. |
| Drawdown máximo | Maior queda do pico ao fundo | Compare com o capital. Se a pessoa não aguenta ver essa queda, vai desligar o robô na pior hora. |
| Maior sequência de perdas | Quantos stops seguidos | Prepare a pessoa: no real costuma vir uma sequência maior que a do backtest. |
| Concentração | % do lucro que veio dos 5 melhores trades | Acima de 50%: o resultado depende de poucos dias de sorte. |

## Testes que o script não faz e você deve propor

Explique cada teste como um passo simples na plataforma (mudar o período ou um parâmetro e rodar de novo) e peça o print do novo resultado.

- **Fora da amostra:** a pessoa ajustou os parâmetros num período? Então teste num período que ficou de fora. Se o resultado desaba, a estratégia foi ajustada ao passado.
- **Robustez dos parâmetros:** mude cada parâmetro um pouco (stop 150 → 130 e 170). Estratégia boa continua de pé. Estratégia frágil só funciona no número exato.
- **Regimes diferentes:** o período cobre mercado de alta, de baixa e lateral? Pelo menos 2 anos.

## Entrega

1. Resumo em 3 linhas: o robô se sustenta, está no limite ou não se sustenta.
2. Tabela com as métricas e a leitura de cada uma.
3. Sinais de alerta.
4. Próximo passo: Ferramenta 4 (risco de quebra).
