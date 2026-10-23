# NTSL — linguagem de estratégias do Profit (Nelogica)

Use este guia para escrever e revisar robôs do Profit. Se precisar de uma função que não está aqui, use o nome que você conhece e **avise a pessoa para conferir o nome exato na ajuda do Editor de Estratégias** do Profit.

## Como o NTSL roda

- O código roda **uma vez no fechamento de cada candle**, do primeiro ao último do gráfico.
- Ordens enviadas num candle valem **só para o candle seguinte**. Ordem de stop ou de alvo precisa ser **reenviada a cada candle** enquanto houver posição. Esse é o erro número 1 de quem começa.
- `Close`, `High`, `Low`, `Open` e `Volume` são séries. `Close` é o candle atual (que acabou de fechar), `Close[1]` é o anterior, `Close[2]` o de antes.
- A quantidade de contratos normalmente vem da configuração da automação no Profit. As funções de ordem aceitam a quantidade como parâmetro opcional.

## Estrutura

```pascal
input
  StopPontos(150);
  AlvoPontos(300);
var
  bEntrou : Boolean;
  nOps    : Integer;
  fMedia  : Float;
begin
  // lógica aqui
end;
```

- Comentários: `// linha` ou `{ bloco }`.
- Atribuição usa `:=`. Comparação usa `=`, `<>`, `>`, `<`.
- `if ... then begin ... end;` para blocos. Cuidado com o `;` antes de `else`: não vai.

## Funções mais usadas

**Indicadores**
- `Media(Periodo, Serie)` — média aritmética. Ex.: `Media(20, Close)`.
- `MediaExp(Periodo, Serie)` — média exponencial.
- `IFR(Periodo)` — índice de força relativa.
- `Highest(Serie, Periodo)` e `Lowest(Serie, Periodo)` — maior e menor valor dos últimos N candles.

**Posição**
- `HasPosition` — tem posição aberta.
- `IsBought` / `IsSold` — está comprado / vendido.
- `Position` — quantidade (positiva comprado, negativa vendido).
- `BuyPrice` / `SellPrice` — preço médio da posição comprada / vendida.

**Ordens de entrada**
- `BuyAtMarket` / `SellShortAtMarket` — compra / venda a mercado no candle seguinte.
- `BuyLimit(Preco)` / `SellShortLimit(Preco)` — ordem limitada.
- `BuyStop(Preco, PrecoLimite)` / `SellShortStop(Preco, PrecoLimite)` — ordem stop.

**Ordens de saída**
- `SellToCoverAtMarket` / `BuyToCoverAtMarket` — zera a posição comprada / vendida a mercado.
- `SellToCoverLimit(Preco)` / `BuyToCoverLimit(Preco)` — alvo.
- `SellToCoverStop(Preco, PrecoLimite)` / `BuyToCoverStop(Preco, PrecoLimite)` — stop.
- `ClosePosition` — zera qualquer posição.

**Data e hora**
- `Time` — horário do candle no formato HHMM (ex.: `1015` = 10h15).
- `Date` — data do candle. `Date <> Date[1]` é verdadeiro no primeiro candle do dia.

## Modelo base (WIN, comprado e vendido)

Use como ponto de partida e troque só a regra de entrada.

```pascal
// Robô do Zero — modelo base NTSL
// Conteúdo educacional. Teste no simulador antes de qualquer conta real.
input
  PeriodoMedia(20);
  StopPontos(150);
  AlvoPontos(300);
  HoraInicio(915);       // primeira entrada permitida (HHMM)
  HoraFim(1700);         // última entrada permitida (HHMM)
  HoraZeragem(1730);     // zera tudo a partir deste horário
  MaxOpsDia(3);          // máximo de operações por dia
  MaxStopsDia(2);        // para de operar depois de N stops no dia
  Slip(10);              // distância do preço limite na ordem stop
var
  fMedia     : Float;
  nOps       : Integer;
  nStops     : Integer;
  bPosAnt    : Boolean;
  fPrecoEnt  : Float;
  bComprado  : Boolean;
begin
  fMedia := Media(PeriodoMedia, Close);

  // 1. Dia novo: zera contadores
  if (Date <> Date[1]) then
  begin
    nOps := 0;
    nStops := 0;
  end;

  // 2. Detecta posição que acabou de fechar e conta se foi stop
  if bPosAnt and not HasPosition then
  begin
    if bComprado and (Close < fPrecoEnt) then nStops := nStops + 1;
    if (not bComprado) and (Close > fPrecoEnt) then nStops := nStops + 1;
  end;

  // 3. Zeragem por horário
  if (Time >= HoraZeragem) and HasPosition then
    ClosePosition

  // 4. Stop e alvo reenviados a cada candle
  else if IsBought then
  begin
    SellToCoverStop(BuyPrice - StopPontos, BuyPrice - StopPontos - Slip);
    SellToCoverLimit(BuyPrice + AlvoPontos);
  end
  else if IsSold then
  begin
    BuyToCoverStop(SellPrice + StopPontos, SellPrice + StopPontos + Slip);
    BuyToCoverLimit(SellPrice - AlvoPontos);
  end

  // 5. Entrada: só sem posição, dentro da janela e dos limites do dia
  else if (not HasPosition) and (Time >= HoraInicio) and (Time <= HoraFim)
          and (nOps < MaxOpsDia) and (nStops < MaxStopsDia) then
  begin
    // REGRA DE ENTRADA — troque pela regra da pessoa
    if (Close > fMedia) and (Close[1] <= fMedia[1]) then
    begin
      BuyAtMarket;
      nOps := nOps + 1;
    end
    else if (Close < fMedia) and (Close[1] >= fMedia[1]) then
    begin
      SellShortAtMarket;
      nOps := nOps + 1;
    end;
  end;

  // 6. Guarda o estado para o próximo candle
  bPosAnt := HasPosition;
  if IsBought then
  begin
    bComprado := True;
    fPrecoEnt := BuyPrice;
  end
  else if IsSold then
  begin
    bComprado := False;
    fPrecoEnt := SellPrice;
  end;
end;
```

Observação: `fMedia[1]` usa o valor da variável no candle anterior. Se o editor reclamar, troque por `Media(PeriodoMedia, Close)[1]` ou guarde o valor anterior numa variável.

## Armadilhas do Profit

- **Candle de entrada sem stop.** A entrada a mercado executa na abertura do candle seguinte, e o stop só é enviado no fechamento desse candle. Durante esse primeiro candle a posição fica sem stop no backtest. Oriente a pessoa a **também configurar stop e alvo na janela de automação do Profit** como rede de segurança na operação real.
- **Ordem stop sem preço limite** pode não executar num movimento rápido. Sempre use um limite com folga (`Slip`).
- **Série contínua no backtest** (`WIN$N`, `WDO$N`) e **contrato vigente na automação**. A pessoa precisa trocar o código no vencimento.
- **Preço fora do tick.** `BuyPrice - 150` funciona no WIN porque 150 é múltiplo de 5. Se o stop vier de um cálculo (ex.: 1,5× a amplitude), arredonde para o tick.
- **`if` sem `begin/end`** só controla a linha seguinte.
- **Contagem de stops do modelo é aproximada.** Ela compara o fechamento do candle de saída com o preço de entrada. Serve como trava de segurança, não como relatório. O resultado oficial vem do relatório do Profit.
- **Variáveis entre candles.** O modelo assume que a variável guarda o último valor atribuído de um candle para o outro. Se o backtest mostrar contadores zerando sozinhos, peça para a pessoa testar com `ConsoleLog` e ajuste.
