# Ferramenta 4 — Melhorar meu robô

Entra quando "Meu robô presta?" disse **não presta** ou **está no limite**. O objetivo é achar onde o robô perde dinheiro e corrigir **sem ensinar o robô a decorar o passado**.

## A regra de ouro

Mexer em número até o resultado ficar bonito é o jeito mais rápido de criar um robô que funciona no backtest e quebra na conta real. Isso se chama **ajuste ao passado**. Tudo nesta fase existe para evitar isso. Explique à pessoa com estas palavras, uma vez, no começo:

> "Vamos melhorar o robô como um médico: primeiro o diagnóstico, depois um remédio por vez, e no fim um exame que o robô nunca viu. Se ele só funciona no período em que a gente mexeu, ele decorou a prova."

## Passo 1 — Preparar o terreno

Antes de qualquer mudança, peça **um** backtest de referência, sempre nas mesmas condições:

1. **Período mais longo** que a plataforma permitir.
2. **Custos e escorregão configurados** (veja `ativos.md`). Se a plataforma não tiver o campo, você desconta no `diagnostico.py`.
3. **Separe a prova.** Divida o período em duas partes:
   - **Treino:** os primeiros 2/3. É aqui que a gente testa as mudanças.
   - **Prova:** o último 1/3. **Ninguém olha esse período até o final.** Na plataforma, é só mudar as datas do backtest.

Se o histórico disponível for curto (menos de 1 ano), avise: as conclusões vão ser fracas, e o teste no simulador vai pesar mais.

## Passo 2 — Diagnóstico

Peça o print do **resumo** do período de treino e rode:

```bash
python scripts/diagnostico.py --operacoes N --acerto X --ganho-medio G --perda-media P \
  --custo C --slippage S --tempo-ganho TG --tempo-perda TP --maior-perda MP
```

- `--tempo-ganho` e `--tempo-perda` em minutos (o Profit mostra "Média de Tempo em Op. Vencedoras/Perdedoras"; no MT5, peça a lista de negócios).
- `--custo` e `--slippage` só se o backtest **não** descontou.

Se precisar ver **quando** o robô perde (horário, dia da semana), peça o print da aba de **Operações** da plataforma.

**Nunca calcule de cabeça.** Os números do diagnóstico saem do script.

## Passo 3 — Escolher o remédio

Use o sinal que o script apontou. Comece sempre pela linha de cima da tabela que se aplica.

| Sinal do diagnóstico | O que provavelmente está acontecendo | O que testar (em ordem) |
|---|---|---|
| `entrada_cedo` / `stop_cheio` | O robô entra e o preço continua indo contra | 1. Exigir que o movimento esteja mais esticado (ex.: distância mínima maior). 2. Exigir confirmação mais forte (ex.: 2 candles a favor em vez de 1). 3. Filtro de tendência: não operar contra uma tendência clara (ex.: em robô de volta à VWAP, só comprar abaixo da VWAP se a VWAP não estiver caindo). |
| `custo_alto` / `custo` | O ganho por operação é pequeno perto do custo | 1. Menos operações por dia. 2. Alvo maior. 3. Tempo gráfico maior. |
| `payoff` | Ganha pouco quando acerta | 1. Alvo mais longe. 2. Stop por estrutura (ex.: mínima do candle anterior) em vez de fixo. |
| `empate` | Está no zero a zero | Combine o sinal mais forte da lista com um filtro de horário (veja abaixo). |
| Perdas concentradas num horário (aba Operações) | Um pedaço do dia não combina com a estratégia | Tirar esse horário da janela de operação. |
| Sequência longa de perdas | Dias inteiros contra a estratégia | Limite diário mais curto (ex.: parar depois de 2 stops). |
| `amostra` | Poucas operações | Não otimize ainda. Aumente o período primeiro. |

Prefira **mudanças com uma razão que dá para explicar em uma frase** ("o preço continuava caindo, então esperamos mais confirmação"). Mudança sem explicação, só porque o número melhorou, é ajuste ao passado.

### Mudança de parâmetro ou de regra

- **Parâmetro** (stop, distância, horário, limite do dia): a pessoa muda na janela da plataforma. **Sem código novo.** Comece sempre por aqui.
- **Regra nova** (filtro de tendência, confirmação extra): você manda o código inteiro de novo com "apague tudo e cole este". Mantenha os parâmetros antigos com os mesmos nomes e acrescente o novo filtro com um parâmetro que **liga e desliga** (ex.: `UsarFiltroTendencia(1)`), para comparar com e sem.

## Passo 4 — Um remédio por rodada, com diário

Cada rodada muda **uma coisa só**. Depois de cada rodada, mostre o **diário de testes** atualizado, sempre no período de treino:

| Rodada | O que mudou | Operações | Acerto | Fator de lucro | Resultado c/ custos | Queda máxima |
|---|---|---|---|---|---|---|
| 0 | Robô original | | | | | |
| 1 | DistMin 300 → 500 | | | | | |

- Guarde a mudança se ela melhorou o **resultado com custos** e não derrubou o número de operações abaixo de 100 no treino.
- Desfaça a mudança se piorou. Diga isso sem drama: descartar também é avanço.

## Passo 5 — Teste de vizinhança

Quando um número parecer bom (ex.: DistMin 500), teste os vizinhos: **20% abaixo e 20% acima** (400 e 600).

- **Os três positivos:** o robô está num **platô**. Bom sinal: funciona numa faixa, não num número mágico.
- **Só o número exato funciona:** é um **pico**. Sinal de ajuste ao passado. Volte para o valor anterior ou escolha o meio do platô.

## Passo 6 — A prova final

Quando o robô estiver bom no treino, rode **uma única vez** o período de prova, com tudo igual.

- **Continua positivo**, com fator de lucro parecido (até 30% pior): passou. Vá para "Quanto posso perder?".
- **Desaba:** o robô decorou o treino. Diga isso com honestidade, volte para a última versão que fazia sentido e **não ajuste nada olhando a prova**.

## Quando parar

- **Depois de 6 a 8 rodadas sem melhora consistente**, diga com clareza: "Testamos bastante. Essa ideia, do jeito que está, não mostra vantagem. Isso é informação valiosa. Quer testar outra ideia?" Ofereça outra família de estratégia ou outro ativo.
- Nunca prometa que a próxima mudança vai resolver.

## Entrega de cada rodada

1. Uma frase sobre o que a rodada mostrou.
2. O diário de testes atualizado.
3. A próxima mudança sugerida e por quê, em uma frase.
4. O que a pessoa faz agora (qual parâmetro mudar e qual print mandar).
