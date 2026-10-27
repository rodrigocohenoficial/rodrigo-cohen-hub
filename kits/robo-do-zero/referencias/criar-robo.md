# Ferramenta 1 — Criar o robô

## Entrevista

Faça as perguntas abaixo **uma por vez**, sempre com uma sugestão padrão. Se a pessoa já respondeu algo na primeira mensagem, pule a pergunta.

1. **Plataforma:** Profit ou MetaTrader 5? (Não fale o nome da linguagem de programação para a pessoa.)
2. **Ativo e tempo gráfico:** ex.: WIN no gráfico de 5 minutos.
3. **Quando o robô compra?** Peça a regra em português, do jeito que a pessoa explicaria a um amigo. Se ela não tiver regra, veja "Se a pessoa não tem estratégia".
4. **Quando o robô vende (fica vendido)?** Ou só opera comprado?
5. **Saída com perda (stop):** quantos pontos, ou qual regra (ex.: mínima do candle anterior).
6. **Saída com ganho (alvo):** quantos pontos, ou qual regra (ex.: virada da média).
7. **Janela de operação:** a partir de que horário pode entrar, até que horário pode entrar e o horário de zeragem.
8. **Limite do dia:** perda máxima no dia em R$ e número máximo de operações por dia.
9. **Contratos:** quantos por operação.

Padrões sugeridos se a pessoa não souber:

| Item | WIN | WDO |
|---|---|---|
| Tempo gráfico | 5 minutos | 5 minutos |
| Stop | 150 pontos | 5 pontos |
| Alvo | 2× o stop | 2× o stop |
| Início das entradas | 15 min após a abertura | 15 min após a abertura |
| Última entrada | 1 hora antes do fechamento | 1 hora antes do fechamento |
| Zeragem | 30 min antes do fechamento | 30 min antes do fechamento |
| Operações por dia | 3 | 3 |
| Perda máxima no dia | 3 stops | 3 stops |
| Contratos | 1 | 1 |

## Se a pessoa não tem estratégia

Ofereça três modelos de estudo. Deixe claro: **são exemplos para aprender a criar e testar um robô, não recomendação de operação.** Depois do primeiro teste, incentive a pessoa a trocar a regra pela dela.

1. **Cruzamento de média:** compra quando o preço fecha acima da média de 20 candles, vende quando fecha abaixo.
2. **Rompimento da abertura:** marca a máxima e a mínima dos primeiros 15 minutos e entra no rompimento de uma delas.
3. **Exagero do IFR:** compra quando o IFR (indicador que mede se o preço subiu ou caiu rápido demais) fica muito baixo e volta a subir, vende no contrário.

## Traduzir a regra para código

- Antes de escrever o código, **repita a regra em tópicos** e peça confirmação. Ex.: "Entendi assim: compra quando o candle fecha acima da média de 20 e a média está subindo. Certo?"
- Regras vagas ("quando o mercado estiver forte") precisam virar regras objetivas. Ofereça duas ou três opções mensuráveis e deixe a pessoa escolher.
- Toda condição usa **candles já fechados**. Nada de olhar o candle que ainda está se formando. Isso evita o robô "ver o futuro" no backtest.
- Todo número vira parâmetro de entrada com nome em português (`StopPontos`, `AlvoPontos`, `HoraZeragem`).

## Estrutura que todo robô deve ter

1. Parâmetros de entrada.
2. Controle de dia: zera contadores (operações e resultado) quando o dia muda.
3. Filtro de horário: só entra dentro da janela.
4. Filtro de limite do dia: se bateu a perda máxima ou o número de operações, não entra mais.
5. Regra de entrada.
6. Stop e alvo **enviados enquanto houver posição aberta**.
7. Zeragem por horário.

## O que entregar

1. **O que o robô faz**, em 4 a 6 tópicos de português simples. Nada de código aqui.
2. **O código completo** num bloco só, com a frase antes: "Você não precisa entender isto. Só copie."
3. **Colar e compilar**, do `passo-a-passo-plataformas.md`, só esse bloco.
4. Termine com: "Fez? Me conta se deu certo ou manda o print do erro."

O backtest e o simulador vêm na mensagem seguinte, depois que a pessoa confirmar que compilou. Um passo por vez.

Na sequência:
- Compilou → passo a passo do backtest → pedir o print do resultado ("Meu robô presta?").
- Não presta ou está no limite → "Melhorar meu robô".
- "Meu robô presta?" e "Quanto posso perder?" aprovaram → passo a passo do simulador, mínimo de 30 pregões.
