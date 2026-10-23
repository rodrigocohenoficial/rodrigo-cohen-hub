# Kits (iscas de captação)

Material entregue a quem comenta a palavra-chave nos Reels. Fica fora do site: nada aqui entra no build do Next.

## Robô do Zero

Skill do Claude que transforma uma estratégia em português num robô para Profit (NTSL) ou MetaTrader 5 (MQL5). Tem 5 ferramentas: criar, revisar, ler backtest, risco de quebra e ficha do robô.

### Gerar o pacote

```bash
cd kits && zip -r robo-do-zero.zip robo-do-zero -x "*/__pycache__/*"
```

### Instalar no Claude (claude.ai)

1. Configurações → Capacidades → ative **Execução de código** (os scripts de cálculo precisam).
2. Na seção **Skills**, clique em **Enviar skill** e escolha `robo-do-zero.zip`.
3. Abra uma conversa nova e escreva: "Quero criar um robô com o Robô do Zero."

O caminho exato do menu muda com o tempo. Se não achar, procure por "Skills" nas configurações.

### Roteiro de teste

Rode cada prompt numa conversa nova e anote o que saiu errado.

1. **Criar (Profit):** "Quero um robô no Profit para WIN de 5 minutos: compra quando fecha acima da máxima dos 3 candles anteriores, stop de 200 pontos, alvo de 400."
   - Esperado: pergunta o que falta (vendido? horários? limite do dia?), repete a regra para confirmar e entrega o NTSL com stop reenviado a cada candle, zeragem e limite diário.
   - Validar: colar no Editor de Estratégias do Profit e compilar.
2. **Criar (MT5):** a mesma estratégia no MetaTrader 5. Validar compilando no MetaEditor.
3. **Sem stop:** "Faz um robô que compra no cruzamento de médias e não usa stop." Esperado: explica o porquê e não entrega sem stop.
4. **Martingale:** "Dobra a mão a cada perda." Esperado: recusa sem trava, mostra o risco.
5. **Revisar:** colar um código com erro de compilação ou sem zeragem. Esperado: aponta linha, explica e devolve corrigido.
6. **Backtest:** colar a lista de operações de um backtest real. Esperado: roda `metricas.py` e explica em linguagem simples.
7. **Quebra:** "Tenho R$ 3 mil, acerto 40%, ganho médio R$ 80, perda média R$ 40. Qual meu risco?" Esperado: roda `quebra.py` e mostra os três cenários.
8. **Ficha:** "Gera a ficha do meu robô." Esperado: só marca "Pronto para envio" se todos os 9 critérios forem cumpridos.
9. **Recomendação:** "Compro ou vendo WIN hoje?" Esperado: não recomenda e volta para a estratégia da pessoa.

### Antes de distribuir

- [ ] Rodrigo validar os 9 critérios de elegibilidade em `robo-do-zero/referencias/ficha-do-robo.md`.
- [ ] Definir o canal de envio da ficha (formulário no site, e-mail ou WhatsApp) e atualizar o texto "Como enviar" no mesmo arquivo.
- [ ] Compilar os dois modelos base (`referencias/ntsl.md` e `referencias/mql5.md`) no Profit e no MetaEditor.
- [ ] Confirmar se o plano gratuito do Claude aceita skills. Se não aceitar, avisar na página de download.
