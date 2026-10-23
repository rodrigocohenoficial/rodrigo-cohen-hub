# Passo a passo nas plataformas (para quem nunca programou)

Use estes roteiros ao entregar o robô. Mande **um bloco de cada vez**: primeiro colar e compilar; quando a pessoa disser que deu certo, o backtest; depois o simulador.

Os nomes de menu mudam entre versões. **Se a pessoa não achar um botão, peça um print da tela e guie a partir do que aparece nela.** Nunca insista no nome do menu.

---

## Profit (Nelogica)

Antes de tudo: o editor de estratégias, o backtest e a automação dependem da versão do Profit que a corretora libera. Se a pessoa não encontrar o editor, peça para ela confirmar com a corretora se a versão dela tem **Editor de Estratégias** e **Automação de Estratégias**.

### Colar e compilar

1. Abra o Profit.
2. No menu de cima, procure **Estratégias** e clique em **Editor de Estratégias**.
3. Crie uma estratégia nova. Quando ele perguntar o tipo, escolha a opção de **execução** (é a que envia ordens).
4. Dê um nome ao robô.
5. Apague tudo o que já vier escrito na tela.
6. Copie o código que eu te mandei (botão de copiar no canto do bloco) e cole com **Ctrl+V**.
7. Clique em **Compilar**.
8. Se aparecer erro na parte de baixo da tela, tire um print e me mande. Se não aparecer, salve.

### Rodar o backtest (testar no passado)

1. Abra um gráfico do ativo (série contínua, ex.: **WIN$N**) no tempo gráfico da estratégia.
2. Procure a opção de **backtest** ou **módulo de backtesting** no menu de Estratégias e escolha o seu robô.
3. Escolha o período mais longo disponível.
4. Se houver campo de custo, coloque a corretagem e as taxas.
5. Rode e me mande o print do **resumo** e, se possível, da **lista de operações**.

### Mudar stop, alvo, horário

Na janela do robô (no backtest ou na automação) existe a lista de **parâmetros**. Mude ali. Não mexa no código.

### Rodar no simulador

1. Procure **Automação de Estratégias** no menu de Estratégias.
2. Escolha o robô, o ativo **do contrato atual** (ex.: WINZ26) e a conta **simulador**.
3. Configure também stop e alvo na própria janela de automação, como rede de segurança.
4. Ative e acompanhe. Mínimo de 30 pregões antes de pensar em conta real.

---

## MetaTrader 5

### Colar e compilar

1. Abra o MetaTrader 5.
2. Aperte **F4** (ou menu **Ferramentas → MetaQuotes Language Editor**). Abre o MetaEditor.
3. No MetaEditor: **Arquivo → Novo**.
4. Escolha **Expert Advisor (modelo)** e clique em **Avançar**.
5. Dê um nome ao robô (ex.: MeuRobo) e clique em **Avançar** até **Concluir**.
6. Apague tudo o que aparecer na tela (**Ctrl+A** e depois **Delete**).
7. Copie o código que eu te mandei e cole com **Ctrl+V**.
8. Aperte **F7** para compilar.
9. Olhe a aba **Erros** embaixo. Se aparecer "0 errors", deu certo. Se aparecer erro, me mande o print.

### Rodar o backtest

1. Volte ao MetaTrader 5.
2. Aperte **Ctrl+R** (ou menu **Exibir → Testador de Estratégia**).
3. Em **Expert**, escolha o seu robô.
4. Em **Símbolo**, escolha o ativo e o tempo gráfico da estratégia.
5. Em **Modelagem**, escolha **Todos os ticks com base em ticks reais** (se não houver, **Todos os ticks**).
6. Escolha o período mais longo disponível.
7. Clique em **Iniciar**.
8. Quando terminar, abra a aba **Backtest** (ou **Relatório**) e me mande o print. Se der, mande também o print da aba de **Negócios** ou **Operações**.

### Mudar stop, alvo, horário

No Testador, aba **Entradas** (ou **Parâmetros**). Na conta, clique duas vezes no robô no gráfico e abra a aba **Entradas**. Não mexa no código.

### Rodar na conta demo

1. Abra uma conta **demo** na corretora (menu **Arquivo → Abrir uma conta**, ou pelo site da corretora).
2. Abra o gráfico do contrato atual (ex.: WINZ26).
3. No painel **Navegador** (Ctrl+N), em **Expert Advisors**, arraste o robô para o gráfico.
4. Na janela que abrir, marque **Permitir Algo Trading** e clique em **OK**.
5. Ative o botão **Algo Trading** na barra de cima (fica verde).
6. Acompanhe por pelo menos 30 pregões antes de pensar em conta real.

---

## Como tirar print

- **Windows:** **Windows + Shift + S**, selecione a área e cole aqui com **Ctrl+V**.
- **Mac:** **Cmd + Shift + 4**, selecione a área e arraste o arquivo para cá.
- **Pelo celular:** foto da tela também serve, desde que os números estejam legíveis.
