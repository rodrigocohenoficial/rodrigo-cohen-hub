# Ferramenta 3 — Ler o backtest

## Coletar os dados

Peça o relatório de operações (lista de trades), não só o resumo.

- **Profit:** no Editor de Estratégias, depois do backtest, aba de operações. A pessoa pode copiar a tabela ou exportar.
- **MT5:** Testador de Estratégia → aba "Backtest" ou "Relatório" → clique direito → exportar. Ou copiar a lista de negócios.

Extraia **o resultado líquido de cada operação** (em R$, ou em pontos) e salve um por linha:

```
-30
60
60
-30
...
```

Se vier em pontos, use `--valor-ponto` (0.20 no WIN, 10 no WDO) e `--contratos`.

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

## Testes que o script não faz e você deve pedir

- **Fora da amostra:** a pessoa ajustou os parâmetros num período? Então teste num período que ficou de fora. Se o resultado desaba, a estratégia foi ajustada ao passado.
- **Robustez dos parâmetros:** mude cada parâmetro um pouco (stop 150 → 130 e 170). Estratégia boa continua de pé. Estratégia frágil só funciona no número exato.
- **Regimes diferentes:** o período cobre mercado de alta, de baixa e lateral? Pelo menos 2 anos.

## Entrega

1. Resumo em 3 linhas: o robô se sustenta, está no limite ou não se sustenta.
2. Tabela com as métricas e a leitura de cada uma.
3. Sinais de alerta.
4. Próximo passo: Ferramenta 4 (risco de quebra).
