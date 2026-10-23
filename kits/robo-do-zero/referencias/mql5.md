# MQL5 — robôs (Expert Advisors) no MetaTrader 5

## Como o MT5 roda

- O robô (Expert Advisor, ou EA) roda a função `OnTick()` **a cada negócio** que muda o preço. Para regras de candle fechado, use a função `NovoCandle()` do modelo e leia sempre o índice 1 (candle anterior, já fechado).
- Contas da B3 no MT5 normalmente são **netting**: uma posição por ativo. O modelo funciona nesse tipo de conta.
- Stop e alvo vão **junto com a ordem** (`sl` e `tp`), ficam no servidor e protegem a posição desde a entrada.
- No MT5 da B3, "ponto" no WIN é 1 unidade de preço. Para evitar confusão, o modelo trata stop e alvo como **distância em unidades de preço** e arredonda para o tick do ativo.

## Modelo base (WIN ou WDO, comprado e vendido)

```cpp
//+------------------------------------------------------------------+
//| Robô do Zero — modelo base MQL5                                  |
//| Conteúdo educacional. Teste no simulador antes de conta real.    |
//+------------------------------------------------------------------+
#include <Trade\Trade.mqh>

input int    PeriodoMedia   = 20;
input double StopPontos     = 150;     // distância do stop em pontos do ativo
input double AlvoPontos     = 300;     // distância do alvo em pontos do ativo
input double Contratos      = 1;
input int    HoraInicio     = 9;       // primeira entrada permitida
input int    MinutoInicio   = 15;
input int    HoraFim        = 17;      // última entrada permitida
input int    MinutoFim      = 0;
input int    HoraZeragem    = 17;      // zera tudo a partir deste horário
input int    MinutoZeragem  = 30;
input int    MaxOpsDia      = 3;       // máximo de entradas por dia
input double PerdaMaxDia    = 90;      // em R$; para de operar ao atingir
input ulong  NumeroMagico   = 20261001;

CTrade trade;
int    hMedia = INVALID_HANDLE;

//--- Arredonda o preço para o tick do ativo (5 no WIN, 0,5 no WDO)
double ArredondaTick(double preco)
{
   double tick = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   if(tick <= 0) return preco;
   return NormalizeDouble(MathRound(preco / tick) * tick, _Digits);
}

//--- Verdadeiro uma vez por candle, na abertura de um candle novo
bool NovoCandle()
{
   static datetime ultimo = 0;
   datetime atual = iTime(_Symbol, PERIOD_CURRENT, 0);
   if(atual == ultimo) return false;
   ultimo = atual;
   return true;
}

//--- Minutos desde a meia-noite (horário do servidor)
int MinutosAgora()
{
   MqlDateTime t;
   TimeToStruct(TimeCurrent(), t);
   return t.hour * 60 + t.min;
}

//--- Início do dia de hoje
datetime InicioDoDia()
{
   MqlDateTime t;
   TimeToStruct(TimeCurrent(), t);
   t.hour = 0; t.min = 0; t.sec = 0;
   return StructToTime(t);
}

//--- Resultado do dia (fechado + aberto) e número de entradas deste robô
void ResultadoDoDia(double &resultado, int &entradas)
{
   resultado = 0;
   entradas  = 0;
   if(HistorySelect(InicioDoDia(), TimeCurrent()))
   {
      for(int i = HistoryDealsTotal() - 1; i >= 0; i--)
      {
         ulong deal = HistoryDealGetTicket(i);
         if(HistoryDealGetString(deal, DEAL_SYMBOL) != _Symbol) continue;
         if((ulong)HistoryDealGetInteger(deal, DEAL_MAGIC) != NumeroMagico) continue;
         resultado += HistoryDealGetDouble(deal, DEAL_PROFIT)
                    + HistoryDealGetDouble(deal, DEAL_COMMISSION)
                    + HistoryDealGetDouble(deal, DEAL_SWAP);
         if(HistoryDealGetInteger(deal, DEAL_ENTRY) == DEAL_ENTRY_IN) entradas++;
      }
   }
   if(PositionSelect(_Symbol) && (ulong)PositionGetInteger(POSITION_MAGIC) == NumeroMagico)
      resultado += PositionGetDouble(POSITION_PROFIT);
}

bool TemPosicao()
{
   return PositionSelect(_Symbol) && (ulong)PositionGetInteger(POSITION_MAGIC) == NumeroMagico;
}

int OnInit()
{
   trade.SetExpertMagicNumber(NumeroMagico);
   trade.SetTypeFillingBySymbol(_Symbol);
   hMedia = iMA(_Symbol, PERIOD_CURRENT, PeriodoMedia, 0, MODE_SMA, PRICE_CLOSE);
   if(hMedia == INVALID_HANDLE)
   {
      Print("Erro ao criar a média: ", GetLastError());
      return INIT_FAILED;
   }
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   if(hMedia != INVALID_HANDLE) IndicatorRelease(hMedia);
}

void OnTick()
{
   int agora = MinutosAgora();

   // 1. Zeragem por horário (checada a cada tick)
   if(agora >= HoraZeragem * 60 + MinutoZeragem)
   {
      if(TemPosicao()) trade.PositionClose(_Symbol);
      return;
   }

   // 2. Limite de perda do dia (checado a cada tick)
   double resultadoDia; int entradasDia;
   ResultadoDoDia(resultadoDia, entradasDia);
   if(resultadoDia <= -PerdaMaxDia)
   {
      if(TemPosicao()) trade.PositionClose(_Symbol);
      return;
   }

   // 3. Daqui para baixo, só na abertura de um candle novo
   if(!NovoCandle()) return;
   if(TemPosicao()) return;
   if(agora < HoraInicio * 60 + MinutoInicio) return;
   if(agora > HoraFim * 60 + MinutoFim) return;
   if(entradasDia >= MaxOpsDia) return;

   // 4. Lê a média e os fechamentos dos candles já fechados (índices 1 e 2)
   double media[];
   ArraySetAsSeries(media, true);
   if(CopyBuffer(hMedia, 0, 1, 2, media) < 2) return;
   double fech1 = iClose(_Symbol, PERIOD_CURRENT, 1);
   double fech2 = iClose(_Symbol, PERIOD_CURRENT, 2);

   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);

   // 5. REGRA DE ENTRADA — troque pela regra da pessoa
   if(fech1 > media[0] && fech2 <= media[1])
   {
      double sl = ArredondaTick(ask - StopPontos);
      double tp = ArredondaTick(ask + AlvoPontos);
      if(!trade.Buy(Contratos, _Symbol, 0, sl, tp, "Robo do Zero"))
         Print("Compra recusada: ", trade.ResultRetcodeDescription());
   }
   else if(fech1 < media[0] && fech2 >= media[1])
   {
      double sl = ArredondaTick(bid + StopPontos);
      double tp = ArredondaTick(bid - AlvoPontos);
      if(!trade.Sell(Contratos, _Symbol, 0, sl, tp, "Robo do Zero"))
         Print("Venda recusada: ", trade.ResultRetcodeDescription());
   }
}
```

## Armadilhas do MT5

- **Ler o candle 0** (o que ainda está se formando) numa regra de candle fechado faz o backtest parecer melhor do que a realidade. Use índice 1 e 2.
- **Horário do servidor.** `TimeCurrent()` usa o horário do servidor da corretora. Confira se bate com o horário de Brasília.
- **Contrato vigente.** O robô roda no gráfico do contrato atual (ex.: WINZ26). No vencimento, a pessoa precisa trocar o gráfico.
- **Tipo de preenchimento.** Se a corretora recusar a ordem por tipo de preenchimento, teste `trade.SetTypeFilling(ORDER_FILLING_RETURN)` no `OnInit`.
- **Testador de estratégia:** use o modo "Todos os ticks com base em ticks reais" quando disponível. "Somente preços de abertura" engana em robôs com stop curto.
- **Perda máxima do dia** usa o resultado em R$ informado pela corretora, incluindo a posição aberta. Em conta demo a comissão pode vir zerada.
