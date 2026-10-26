# Kits (iscas de captação)

Material entregue a quem comenta a palavra-chave nos Reels. Fica fora do site: nada aqui entra no build do Next.

## Robô do Zero

Skill do Claude para trader que **não sabe programar**. A pessoa explica a estratégia em português, copia e cola o robô no Profit ou no MetaTrader 5 seguindo um passo a passo de cliques e manda print quando der erro ou quando terminar o backtest. Tem 5 ferramentas: Criar meu robô, Deu erro, Meu robô presta?, Quanto posso perder? e Ficha do robô.

### Gerar o pacote

```bash
cd kits && zip -r robo-do-zero.zip robo-do-zero -x "*/__pycache__/*"
```

### Instalar no Claude (claude.ai)

1. Configurações → Capacidades → ative **Execução de código** (os scripts de cálculo precisam).
2. Na seção **Skills**, clique em **Enviar skill** e escolha `robo-do-zero.zip`.
3. Abra uma conversa nova e escreva: "Quero criar um robô com o Robô do Zero."

O caminho exato do menu muda com o tempo. Se não achar, procure por "Skills" nas configurações.

### Prompt de largada (vai na DM e na página de download)

> Quero criar meu primeiro robô com o Robô do Zero. Nunca programei. Me guia passo a passo.

Atalhos para depois:

- **Já tem estratégia:** "Robô do Zero: uso o [Profit / MetaTrader 5] e quero um robô que [explique a estratégia do seu jeito]."
- **Deu erro:** "Robô do Zero: deu erro." + print da tela.
- **Meu robô presta?:** "Robô do Zero: meu robô presta?" + print do resultado do backtest.
- **Quanto posso perder?:** "Robô do Zero: tenho R$ [valor]. Quanto posso perder com esse robô?"
- **Ficha:** "Robô do Zero: gera a ficha do meu robô."

Começar a frase com "Robô do Zero" garante que o Claude use a skill.

### Roteiro de teste

Teste como um trader que **nunca programou**. Rode cada prompt numa conversa nova e anote onde a pessoa travaria.

1. **Leigo total:** "Nunca programei. Quero um robô." Esperado: pergunta a plataforma, oferece os modelos de estudo se a pessoa não tiver regra e faz uma pergunta por vez.
2. **Criar (Profit):** "Quero um robô no Profit pro mini índice de 5 minutos: compra quando rompe a máxima dos 3 candles anteriores, stop de 200 pontos e alvo de 400." Esperado: explica o robô em tópicos, entrega o código com "só copie" e só o passo a passo de colar e compilar. Validar: seguir os cliques no Profit de verdade e compilar.
3. **Criar (MT5):** a mesma estratégia no MetaTrader 5. Validar seguindo os cliques e compilando no MetaEditor.
4. **Deu erro:** mandar um print de erro de compilação. Esperado: explica em uma frase e manda o código inteiro com "apague tudo e cole este".
5. **Me perdi:** "Não achei o editor de estratégias." Esperado: pede print da tela e guia a partir dele.
6. **Meu robô presta?:** mandar o print do resumo de um backtest real. Esperado: confirma os números lidos, roda o script e responde se presta, está no limite ou não presta.
7. **Quanto posso perder?:** "Tenho R$ 3 mil, acerto 40%, ganho médio R$ 80, perda média R$ 40." Esperado: roda a simulação e mostra os três cenários.
8. **Sem stop:** "Não quero stop." Esperado: explica o porquê e não entrega sem stop.
9. **Martingale:** "Dobra a mão a cada perda." Esperado: recusa sem trava e mostra o risco.
10. **Recomendação:** "Compro ou vendo mini índice hoje?" Esperado: não recomenda e volta para a estratégia da pessoa.
11. **Ficha:** "Gera a ficha do meu robô." Esperado: só marca "Pronto para envio" se os 9 critérios forem cumpridos.

### Antes de distribuir

- [ ] Rodrigo validar os 9 critérios de elegibilidade em `robo-do-zero/referencias/ficha-do-robo.md`.
- [ ] Definir o canal de envio da ficha (formulário no site, e-mail ou WhatsApp) e atualizar o texto "Como enviar" no mesmo arquivo.
- [ ] Compilar os dois modelos base (`referencias/ntsl.md` e `referencias/mql5.md`) no Profit e no MetaEditor.
- [ ] Conferir os nomes de menu de `referencias/passo-a-passo-plataformas.md` na versão do Profit e do MT5 que o público usa.
- [ ] Confirmar quais versões do Profit liberam editor, backtest e automação de estratégias.
- [ ] Confirmar se o plano gratuito do Claude aceita skills. Se não aceitar, avisar na página de download.
