# Ferramenta 2 — Revisar um robô

## Checklist

Passe por todos os itens. Para cada problema encontrado, diga **a linha, o problema em português simples e a correção**.

**Risco (gravíssimo se faltar)**
- [ ] Tem stop em toda posição, comprada e vendida.
- [ ] No NTSL, stop e alvo são reenviados a cada candle enquanto há posição.
- [ ] Tem zeragem por horário.
- [ ] Tem limite de perda diária ou de número de operações.
- [ ] Não aumenta posição contra o preço sem limite (martingale ou preço médio infinito).
- [ ] Não vira a mão sem querer (ordem de entrada contrária enviada com posição aberta).

**Lógica**
- [ ] As condições usam só candles fechados.
- [ ] Os contadores do dia são zerados quando o dia muda.
- [ ] Preços de ordem respeitam o tick do ativo.
- [ ] Ordem stop tem preço limite com folga (NTSL) ou é enviada com `sl` e `tp` (MQL5).
- [ ] Toda condição pode acontecer de fato (nada de "preço maior que a máxima do mesmo candle").
- [ ] Não existem números soltos no meio do código. Tudo que é ajustável virou parâmetro.

**Backtest honesto**
- [ ] Não usa informação do futuro (candle atual em regra de candle fechado, `Close[-1]`, dados do dia inteiro).
- [ ] Parâmetros não parecem ajustados demais (ex.: média de 37, stop de 135, alvo de 415). Números "quebrados" assim costumam ser fruto de otimização no passado e quebram no futuro.

**Código**
- [ ] Compila sem erro.
- [ ] Nomes de variáveis claros, comentários em português.

## Erros de compilação comuns

**NTSL**
- `;` antes de `else` → apague o `;`.
- Variável não declarada → declare no bloco `var` com o tipo.
- `=` em vez de `:=` na atribuição.
- Bloco `begin` sem `end;`.

**MQL5**
- `'xxx' - undeclared identifier` → variável ou função não declarada, ou faltou o `#include`.
- `possible loss of data due to type conversion` → aviso, não erro. Corrija com conversão explícita (`(int)`, `(ulong)`).
- `invalid stops` (na execução) → stop ou alvo muito perto do preço ou fora do tick. Arredonde para o tick e afaste.
- `unsupported filling mode` → troque o tipo de preenchimento (veja `mql5.md`).

## Entrega

1. Lista de problemas, do mais grave para o mais leve.
2. Código corrigido inteiro.
3. O que a pessoa deve testar de novo depois da correção.
