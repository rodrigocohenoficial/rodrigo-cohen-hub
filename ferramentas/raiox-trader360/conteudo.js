// Conteúdo do Raio-X do Trader — Mentoria Trader 360.
// Tudo que o aluno lê sai daqui. Para mudar um texto, mude só este arquivo.

window.RAIOX = {
  turma: "Turma 5",

  escala: [
    { v: 1, rotulo: "Nunca" },
    { v: 2, rotulo: "Raramente" },
    { v: 3, rotulo: "Às vezes" },
    { v: 4, rotulo: "Frequentemente" },
    { v: 5, rotulo: "Sempre" },
  ],

  // Ordem já misturada para o aluno não perceber o bloco de cada padrão.
  afirmacoes: [
    { id: "v1", p: "vingativo", t: "Depois de um stop, entrei de novo em menos de 5 minutos." },
    { id: "t1", p: "travado", t: "Vi meu setup aparecer, travei, e depois assisti o preço andar sem mim." },
    { id: "e1", p: "estudante", t: "Troquei de setup antes de completar 30 operações com o anterior." },
    { id: "h1", p: "heroi", t: "Bati minha meta do dia e continuei operando." },
    { id: "s1", p: "semprocesso", t: "Entrei numa operação sem saber, antes, onde ficaria o meu stop." },
    { id: "v2", p: "vingativo", t: "Aumentei a mão para recuperar mais rápido o que tinha perdido." },
    { id: "t2", p: "travado", t: "Zerei um gain antes do alvo com medo de devolver." },
    { id: "e2", p: "estudante", t: "Comprei curso, robô ou indicador novo achando que agora ia dar certo." },
    { id: "h2", p: "heroi", t: "Terminei no negativo um dia que chegou a estar bem positivo." },
    { id: "s2", p: "semprocesso", t: "Mudei o stop de lugar depois de entrar na operação." },
    { id: "v3", p: "vingativo", t: "Xinguei, bati na mesa ou fechei a plataforma com raiva depois de um loss." },
    { id: "t3", p: "travado", t: "Passei um pregão inteiro olhando a tela sem fazer nenhuma operação do meu plano." },
    { id: "e3", p: "estudante", t: "Assisti mais vídeo de trade do que operei com um plano." },
    { id: "h3", p: "heroi", t: "Aumentei a mão depois de uma sequência de ganhos." },
    { id: "s3", p: "semprocesso", t: "Fechei a semana sem saber exatamente quanto ganhei ou perdi." },
    { id: "v4", p: "vingativo", t: "Fiz uma entrada fora do meu setup só porque o dia estava negativo." },
    { id: "t4", p: "travado", t: "Fiquei dias sem operar com medo de perder de novo." },
    { id: "e4", p: "estudante", t: "Abandonei um método depois de duas ou três perdas seguidas." },
    { id: "h4", p: "heroi", t: "Contei para alguém sobre um gain antes de o pregão acabar." },
    { id: "s4", p: "semprocesso", t: "Entrei numa operação sem conseguir explicar o motivo da entrada." },
    { id: "v5", p: "vingativo", t: "Passei do meu limite de perda e continuei operando." },
    { id: "t5", p: "travado", t: "Segurei uma operação perdedora torcendo para o preço voltar." },
    { id: "e5", p: "estudante", t: "Senti que os outros ganham com um segredo que eu ainda não descobri." },
    { id: "h5", p: "heroi", t: "Depois de um dia muito bom, achei que tinha entendido o mercado." },
    { id: "s5", p: "semprocesso", t: "Operei cansado, com raiva ou com a cabeça em outro problema." },
  ],

  ordemPadroes: ["vingativo", "travado", "estudante", "heroi", "semprocesso"],

  areas: [
    { k: "resultado", icone: "💰", nome: "Resultado" },
    { k: "risco", icone: "🛡️", nome: "Risco" },
    { k: "cabeca", icone: "🧠", nome: "Cabeça" },
    { k: "casa", icone: "🏠", nome: "Casa" },
  ],

  prazos: ["No próximo pregão", "Esta semana", "Até o fim do mês"],

  padroes: {
    vingativo: {
      nome: "O Vingativo",
      cor: "#d95926",
      tema: "recuperar a perda no impulso",
      citacao: { t: "Quem é forte? Aquele que domina o próprio impulso.", f: "Pirkei Avot 4:1" },
      bullets: [
        "Você tem **garra** e **não aceita perder fácil**.",
        "Essa garra vira peso quando o stop parece **uma ofensa que precisa de resposta**.",
        "Aparece logo depois de um loss: **mão maior**, entrada **fora do setup** e o famoso **\"só mais uma\"**.",
      ],
      sintese: "Um stop é custo do negócio. A vingança é o que transforma um dia ruim num mês ruim.",
      impactos: {
        resultado: {
          frase: "um stop pequeno vira o maior prejuízo do mês.",
          d: [
            "Antes de abrir a tela, escreva sua perda máxima do dia num papel e cole no monitor.",
            "Bateu o limite, desligue a plataforma. Sem exceção, em nenhum dia.",
            "Compare o resultado dos dias em que você respeitou o limite com os dias em que não respeitou.",
          ],
        },
        risco: {
          frase: "a mão cresce justo quando sua cabeça está pior.",
          d: [
            "Use a mesma mão do primeiro ao último trade do dia.",
            "Marque no diário toda operação feita até 15 minutos depois de um stop.",
            "Chegue a zero operação fora do setup depois de um stop.",
          ],
        },
        cabeca: {
          frase: "a raiva decide no seu lugar.",
          d: [
            "Depois de um stop, levante da cadeira e fique 10 minutos longe da tela.",
            "Anote em uma frase o que você sentiu em cada stop.",
            "Descubra o gatilho que mais te faz querer revidar e crie uma regra para ele.",
          ],
        },
        casa: {
          frase: "o pregão ruim chega em casa antes de você.",
          d: [
            "Conte em casa como foi o dia, com gain ou com loss.",
            "Crie um ritual de fim de pregão, como uma caminhada, antes de encontrar a família.",
            "Mostre o resultado do mês para alguém da sua família.",
          ],
        },
      },
      acao7: "Dois stops seguidos, o dia acabou. Sete pregões seguidos, sem exceção.",
      frase: "O mercado não te deve nada. Nem o dinheiro de ontem.",
      forca: {
        nome: "Sangue frio",
        texto: "Suas respostas mostram que você aceita o stop sem querer revidar. Isso protege seu capital nos dias ruins.",
        passos: [
          "Use essa calma para registrar cada stop com a cabeça fria.",
          "No fim da semana, revise seus stops e marque os que foram bem executados.",
          "Ensine sua regra de stop para alguém da turma.",
        ],
      },
    },

    travado: {
      nome: "O Travado",
      cor: "#3987e5",
      tema: "medo de executar",
      citacao: { t: "Quem fica olhando o vento não semeia, e quem fica olhando as nuvens não colhe.", f: "Kohelet 11:4" },
      bullets: [
        "Você é **cuidadoso** e **leva o risco a sério**.",
        "Esse cuidado vira peso quando **nenhuma entrada parece segura o suficiente**.",
        "Aparece na hora H: o setup aparece e o dedo **trava**. O gain é **cortado cedo** e o loss **fica aberto esperando voltar**.",
      ],
      sintese: "Esperar a certeza custa caro. No mercado, ela nunca chega.",
      impactos: {
        resultado: {
          frase: "os melhores trades ficam de fora e os piores ficam abertos.",
          d: [
            "Defina antes do pregão o setup que você vai operar e entre na primeira vez que ele aparecer.",
            "Anote cada setup que apareceu e você não entrou. Depois veja quanto teria dado.",
            "Compare seu resultado real com o resultado de ter seguido o plano em todas as entradas.",
          ],
        },
        risco: {
          frase: "o medo faz você mexer no que já estava planejado.",
          d: [
            "Coloque stop e alvo na boleta no momento da entrada e não toque mais.",
            "Opere com a mão mínima até executar 10 entradas seguidas sem hesitar.",
            "Só aumente a mão depois de um mês executando o plano sem travar.",
          ],
        },
        cabeca: {
          frase: "o medo de errar pesa mais que a vontade de acertar.",
          d: [
            "Antes de abrir a tela, escreva quanto você aceita perder hoje. Esse é o seu pior cenário.",
            "Depois de cada trava, anote o pensamento que veio na hora.",
            "Releia suas anotações e encontre o pensamento que mais se repete.",
          ],
        },
        casa: {
          frase: "a frustração do \"eu sabia que ia subir\" vai junto para casa.",
          d: [
            "Encerre o dia anotando uma decisão que você executou bem.",
            "Conte para alguém próximo uma entrada que você fez com coragem.",
            "Combine com a família um horário fixo de pregão e outro de folga.",
          ],
        },
      },
      acao7: "Entre em toda operação do seu setup durante 7 pregões, com a mão mínima.",
      frase: "Quem espera o mercado ficar seguro passa a vida assistindo.",
      forca: {
        nome: "Coragem para executar",
        texto: "Suas respostas mostram que, quando o setup aparece, você aperta o botão. Muita gente estuda anos e não consegue isso.",
        passos: [
          "Use essa coragem dentro de regras escritas antes do pregão.",
          "Antes de cada entrada, confira se é o seu setup ou se é impulso.",
          "Registre cada execução no diário para virar dado.",
        ],
      },
    },

    estudante: {
      nome: "O Eterno Estudante",
      cor: "#d55181",
      tema: "troca de método e falta de constância",
      citacao: { t: "O estudo não é o principal. O principal é a prática.", f: "Pirkei Avot 1:17" },
      bullets: [
        "Você é **curioso** e **gosta de aprender**.",
        "Essa curiosidade vira peso quando **cada perda vira motivo para trocar de método**.",
        "Aparece em ciclos: setup novo, **empolgação**, duas perdas e **outro setup**. O método nunca tem tempo de funcionar.",
      ],
      sintese: "Setup nenhum se prova em três dias. Todo setup bom precisa de meses de execução.",
      impactos: {
        resultado: {
          frase: "você nunca descobre se o seu método dá dinheiro, porque troca antes.",
          d: [
            "Escolha um setup e opere só ele hoje.",
            "Mantenha o mesmo setup a semana inteira, com ganho ou com perda.",
            "Feche o mês com pelo menos 40 operações do mesmo setup e olhe os números.",
          ],
        },
        risco: {
          frase: "cada método novo começa com a mão errada.",
          d: [
            "Use a mão mínima enquanto o setup não tiver histórico seu.",
            "Escreva as regras do setup numa folha só, com entrada, stop e alvo.",
            "Calcule taxa de acerto e payoff do setup antes de pensar em mudar qualquer coisa.",
          ],
        },
        cabeca: {
          frase: "a sensação de que falta algo faz você buscar fora o que está na execução.",
          d: [
            "Antes de abrir um conteúdo novo, opere o que você já sabe.",
            "Fique 7 dias sem consumir conteúdo novo de trade.",
            "Faça uma lista do que você já sabe. Vai ser maior do que você imagina.",
          ],
        },
        casa: {
          frase: "tempo e dinheiro somem em cursos que não viram resultado.",
          d: [
            "Some quanto você gastou com cursos e ferramentas no último ano.",
            "Troque uma hora de vídeo por uma hora com a família.",
            "Use a Trader 360 como seu único método pelos próximos 90 dias.",
          ],
        },
      },
      acao7: "Mesmo setup, mesmas regras, 7 pregões seguidos. Sem trocar nada.",
      frase: "Quem troca de método toda semana nunca chega a ter um.",
      forca: {
        nome: "Constância",
        texto: "Suas respostas mostram que você mantém o método mesmo nas semanas ruins. É assim que os números aparecem.",
        passos: [
          "Registre todas as operações do seu método.",
          "A cada 20 operações, revise taxa de acerto e payoff.",
          "Ajuste uma coisa por vez, nunca o método inteiro.",
        ],
      },
    },

    heroi: {
      nome: "O Herói do Dia",
      cor: "#c98500",
      tema: "excesso de confiança e operar demais",
      citacao: { t: "Quem é rico? Aquele que se alegra com a sua porção.", f: "Pirkei Avot 4:1" },
      bullets: [
        "Você tem **confiança** e **sabe aproveitar o dia bom**.",
        "Essa confiança vira peso quando o gain parece **prova de que você não pode errar**.",
        "Aparece depois da meta: **mais uma entrada**, **mão maior**, e o lucro do dia **volta para o mercado**.",
      ],
      sintese: "O dia bom termina quando você bate a meta. Tudo que vem depois é presente para o mercado.",
      impactos: {
        resultado: {
          frase: "os dias bons devolvem o que deviam guardar.",
          d: [
            "Bateu a meta do dia, desligue a plataforma.",
            "Anote quanto você devolveu depois de bater a meta, em cada dia.",
            "Some o que foi devolvido no mês. Esse é o preço do herói.",
          ],
        },
        risco: {
          frase: "a mão cresce na euforia, quando o risco parece pequeno.",
          d: [
            "Defina a mão antes do pregão e mantenha até o fim.",
            "Limite seu número de operações por dia e respeite esse número.",
            "Aumente a mão só por regra escrita, nunca por sensação.",
          ],
        },
        cabeca: {
          frase: "a euforia decide tão mal quanto a raiva.",
          d: [
            "Depois de um gain grande, faça uma pausa de 15 minutos.",
            "Anote como você se sentia antes de cada operação extra.",
            "Encontre o horário em que você mais devolve e pare de operar nele.",
          ],
        },
        casa: {
          frase: "o humor da família passa a depender do seu gráfico.",
          d: [
            "Encerre o pregão no horário combinado, ganhando ou perdendo.",
            "Comemore em casa um dia em que você parou na hora certa.",
            "Separe uma parte do lucro do mês para algo com a família.",
          ],
        },
      },
      acao7: "Meta batida, tela desligada. Sete pregões seguidos.",
      frase: "Saber parar no dia bom vale mais que acertar a próxima entrada.",
      forca: {
        nome: "Saber parar",
        texto: "Suas respostas mostram que você respeita a meta e sai do mercado no dia bom. Isso protege o que você conquistou.",
        passos: [
          "Escreva a meta antes de cada pregão.",
          "Registre quanto você preservou por ter parado na hora.",
          "Use o tempo livre para revisar o dia com calma.",
        ],
      },
    },

    semprocesso: {
      nome: "O Sem Processo",
      cor: "#199e70",
      tema: "operar sem regras claras",
      citacao: { t: "Os planos do diligente levam à abundância.", f: "Mishlei 21:5" },
      bullets: [
        "Você tem **leitura de mercado** e **intuição**.",
        "Essa intuição vira peso quando **ocupa o lugar do plano**.",
        "Aparece no dia a dia: entrada **sem stop definido**, stop **que muda de lugar** e nenhum **registro** do que foi feito.",
      ],
      sintese: "Sem registro, você não evolui. Fica só a sensação.",
      impactos: {
        resultado: {
          frase: "você não sabe dizer por que ganha nem por que perde.",
          d: [
            "Antes do pregão, escreva setup, stop, alvo e perda máxima do dia.",
            "Registre todas as operações num diário: horário, motivo e resultado.",
            "Calcule a taxa de acerto e o payoff do mês.",
          ],
        },
        risco: {
          frase: "o stop vira sugestão.",
          d: [
            "Coloque o stop na boleta no momento da entrada.",
            "Zero stop movido contra você. Conte quantas vezes conseguiu.",
            "Use a automação a seu favor: stop e alvo saindo direto da plataforma.",
          ],
        },
        cabeca: {
          frase: "o feeling muda com o humor do dia.",
          d: [
            "Antes de abrir a tela, dê uma nota de 0 a 10 para como você está.",
            "Cruze essas notas com o seu resultado de cada dia.",
            "Crie uma regra: abaixo de certa nota, você não opera.",
          ],
        },
        casa: {
          frase: "a falta de rotina no trade bagunça a rotina de casa.",
          d: [
            "Defina hora para começar e para terminar o pregão.",
            "Mantenha esse horário por 5 pregões seguidos.",
            "Monte seu checklist de pregão e deixe impresso perto da mesa.",
          ],
        },
      },
      acao7: "7 pregões com o diário preenchido em todas as operações.",
      frase: "Seu feeling fica muito melhor quando vira regra escrita.",
      forca: {
        nome: "Disciplina",
        texto: "Suas respostas mostram que você opera com regras e registra o que faz. É isso que transforma trade em negócio.",
        passos: [
          "Revise seu diário toda sexta-feira.",
          "Encontre um ajuste por mês olhando os seus números.",
          "Ajude um colega da turma a montar o diário dele.",
        ],
      },
    },
  },

  perfil: [
    {
      k: "tempo",
      q: "Há quanto tempo você opera?",
      o: ["Ainda não opero", "Menos de 6 meses", "6 meses a 2 anos", "2 a 5 anos", "Mais de 5 anos"],
    },
    {
      k: "como",
      q: "Como você opera hoje?",
      o: ["Só estudo, ainda não opero", "Só no simulador", "Só na conta real", "Simulador e conta real"],
    },
    {
      k: "ativos",
      q: "O que você opera? (pode marcar mais de um)",
      multi: true,
      o: ["Mini índice (WIN)", "Mini dólar (WDO)", "Ações", "Opções", "Cripto", "Outros"],
    },
    {
      k: "robo",
      q: "Você usa robô ou automação?",
      o: ["Não uso", "Já testei", "Uso em parte das operações", "Uso sempre"],
    },
    {
      k: "rotina",
      q: "Qual frase descreve melhor sua rotina?",
      o: ["Trader em tempo integral", "Trabalho e opero junto", "Sou empresário e opero", "Outra situação"],
    },
    {
      k: "horas",
      q: "Quanto tempo por dia você tem para o pregão?",
      o: ["Menos de 1 hora", "1 a 2 horas", "2 a 4 horas", "O pregão inteiro"],
    },
    {
      k: "capital",
      q: "Quanto você usa hoje para operar?",
      o: ["Até R$ 5 mil", "R$ 5 mil a R$ 20 mil", "R$ 20 mil a R$ 100 mil", "Mais de R$ 100 mil", "Prefiro não dizer"],
    },
    {
      k: "resultado3m",
      q: "Como foi seu resultado nos últimos 3 meses?",
      o: ["Positivo", "Zero a zero", "Negativo", "Não sei, não acompanho", "Ainda não opero"],
    },
  ],

  numeros: [
    { k: "acerto", q: "Taxa de acerto aproximada", suf: "%", ph: "ex.: 45" },
    { k: "payoff", q: "Payoff (ganho médio ÷ perda média)", suf: "", ph: "ex.: 1,5" },
    { k: "opsDia", q: "Operações por dia, em média", suf: "", ph: "ex.: 6" },
    { k: "maiorPerda", q: "Maior perda num único dia", pre: "R$", ph: "ex.: 800" },
    { k: "stopRespeitado", q: "Dos últimos 10 pregões, em quantos você respeitou o stop?", suf: "de 10", ph: "ex.: 7" },
  ],

  abertas: [
    { k: "noventa", q: "O que precisa acontecer nos próximos 90 dias para a Trader 360 ter valido cada centavo?", obrig: true },
    { k: "regra", q: "Qual regra você já sabe que precisa seguir e continua quebrando?", obrig: true },
    { k: "mentira", q: "Qual mentira você conta para si mesmo depois de um dia de loss?" },
    { k: "perdaTotal", q: "Somando tudo, quanto você já perdeu no mercado? Você já tinha feito essa conta antes?" },
    { k: "provar", q: "O que você está tentando provar com o trade? E para quem?" },
    { k: "amor", q: "Se alguém que você ama operasse exatamente como você, o que você diria para essa pessoa?" },
  ],

  familia: {
    q: "Sua família sabe como está, de verdade, o seu resultado no trade?",
    o: ["Sabe tudo", "Sabe uma parte", "Não sabe", "Prefiro não responder"],
  },

  segredo: {
    q: "Você já escondeu uma perda de alguém da sua casa?",
    o: ["Nunca escondi", "Já escondi", "Escondo hoje", "Prefiro não responder"],
  },

  // Áudios do Rodrigo. Quando os arquivos existirem, coloque o caminho aqui
  // (ex.: "audios/vingativo.mp3") e o player aparece sozinho no resultado.
  audios: {
    padrao: { vingativo: "", travado: "", estudante: "", heroi: "", semprocesso: "" },
    forca: { vingativo: "", travado: "", estudante: "", heroi: "", semprocesso: "" },
  },
};

// Calcula o resultado a partir das respostas (1 a 5 por afirmação).
window.calcularRaiox = function (respostas) {
  const R = window.RAIOX;
  const soma = {};
  const cincos = {};
  R.ordemPadroes.forEach((p) => {
    soma[p] = 0;
    cincos[p] = 0;
  });
  R.afirmacoes.forEach((a) => {
    const v = Number(respostas[a.id]) || 0;
    soma[a.p] += v;
    if (v === 5) cincos[a.p] += 1;
  });
  // Cada padrão vai de 5 a 25 pontos. Converte para 0–100%.
  const pct = {};
  R.ordemPadroes.forEach((p) => {
    pct[p] = Math.round(((soma[p] - 5) / 20) * 100);
  });
  const porMaior = [...R.ordemPadroes].sort((a, b) => soma[b] - soma[a] || cincos[b] - cincos[a]);
  const padrao = porMaior[0];
  const porMenor = [...R.ordemPadroes].sort((a, b) => soma[a] - soma[b] || cincos[a] - cincos[b]);
  const forca = porMenor[0] === padrao ? porMenor[1] : porMenor[0];
  return { padrao, forca, soma, pct };
};
