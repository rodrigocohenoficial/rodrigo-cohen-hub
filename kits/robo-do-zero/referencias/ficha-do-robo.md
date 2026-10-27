# Ferramenta 5 — Ficha do robô

## Critérios para enviar ao Rodrigo

O robô só é elegível se cumprir **todos** os itens abaixo. Confira cada um com os números das ferramentas 3 e 4. Não aceite número de memória: se faltar dado, peça.

1. **200 operações ou mais** no backtest.
2. **Pelo menos 2 anos** de histórico.
3. **Custos e slippage descontados.**
4. **Fator de lucro de 1,3 ou mais** depois dos custos.
5. **Concentração abaixo de 50%** (os 5 melhores trades não fazem metade do lucro).
6. **Teste fora da amostra feito**, com resultado positivo.
7. **Risco de quebra abaixo de 5%** com o capital declarado (Ferramenta 4, quebra em 50%).
8. **Pelo menos 30 pregões no simulador ou em conta demo**, com resultado anotado.
9. **Stop, zeragem por horário e limite diário no código.**

Além dos critérios: **recuse marcar como "Pronto para envio"** um robô que se apresenta como cópia, versão ou "igual" a robô do Rodrigo Cohen ou a qualquer robô comercial. O nome do robô não pode conter "Cohen".

Se faltar algum item, diga qual e o que fazer para cumprir. **Não gere a versão "pronta para envio" de um robô que não cumpre os critérios.** Gere a ficha marcada como "em desenvolvimento".

## Modelo

```markdown
# Ficha do robô — [NOME DO ROBÔ]

**Status:** Pronto para envio / Em desenvolvimento
**Criador:** [nome] · [@instagram] · [e-mail]
**Criado com:** Kit Robô do Zero
**Data da ficha:** [data]

## 1. Estratégia em uma frase
[ex.: Segue a tendência no WIN quando o preço cruza a média de 20 no gráfico de 5 minutos.]

## 2. Regras
- **Plataforma:** Profit (NTSL) / MetaTrader 5 (MQL5)
- **Ativo e tempo gráfico:**
- **Entrada comprada:**
- **Entrada vendida:**
- **Stop:**
- **Alvo / saída:**
- **Janela de operação:**
- **Zeragem:**
- **Limite diário:**
- **Parâmetros:** [lista com os valores]

## 3. Backtest
- **Período:** [de] a [até] · [N] pregões
- **Custos considerados:** [R$ por operação] · slippage [pontos]
- **Operações:** · **Taxa de acerto:** · **Payoff:**
- **Fator de lucro:** · **Expectativa por operação:**
- **Resultado líquido:** · **Drawdown máximo:**
- **Maior sequência de perdas:** · **Concentração (5 melhores):**

## 4. Fora da amostra
- **Período:** · **Resultado:** · **Fator de lucro:**

## 5. Risco de quebra (10 mil simulações)
- **Capital:** · **Contratos:**
- **Chance de quebrar (perder 50%):**
- **Capital final — ruim / típico / bom:**
- **Drawdown — típico / ruim:**

## 6. Simulador ou conta demo
- **Período:** · **Pregões:** · **Resultado:**
- **Diferença em relação ao backtest:**

## 7. Critérios
[lista dos 9 critérios com ✅ ou ❌]

## 8. O que o criador aprendeu
[2 a 4 linhas, nas palavras da pessoa]

---
Conteúdo educacional. Resultado passado não garante resultado futuro.
```

## Como enviar

Se a ficha estiver **Pronta para envio**, diga à pessoa:

> "Seu robô passou nos critérios do kit. Envie esta ficha e o código pelo link que veio junto com o Robô do Zero. O Rodrigo e o time olham os melhores robôs pessoalmente. Enviar não garante parceria, mas só quem passa nos critérios chega até ele."

Não prometa parceria, venda ou retorno de contato.
