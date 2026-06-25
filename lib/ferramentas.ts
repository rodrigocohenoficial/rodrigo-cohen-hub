export interface Ferramenta {
  slug: string;
  nome: string;
  descricao: string;
  categoria: "trader" | "longo-prazo";
  faq: { q: string; a: string }[];
  textoExplicativo: string;
}

export const FERRAMENTAS: Ferramenta[] = [
  {
    slug: "position-sizing",
    nome: "Risco por Operação / Position Sizing",
    descricao:
      "Calcule quantos contratos operar com base na sua banca, risco por trade e stop.",
    categoria: "trader",
    faq: [
      {
        q: "Qual o risco ideal por trade?",
        a: "A maioria dos traders profissionais arrisca entre 1% e 2% da banca por operação. Mais que isso acelera o drawdown em sequências de perda.",
      },
      {
        q: "Preciso usar sempre a mesma quantidade de contratos?",
        a: "Não. O position sizing correto muda conforme o tamanho do stop e da banca. É por isso que essa calculadora existe.",
      },
    ],
    textoExplicativo:
      "Position sizing é uma das decisões mais importantes de qualquer trader. Não é sobre quanto você quer ganhar — é sobre quanto você pode perder sem comprometer a banca.\n\nA fórmula é simples: divida o valor em reais que você aceita perder (banca × risco%) pelo custo do stop em reais (pontos × valor do ponto). O resultado é o número de contratos.\n\nExemplo: banca de R$ 10.000, risco de 2% = R$ 200 de risco. Stop de 100 pontos no WIN (R$ 0,20/pt) = R$ 20 por contrato. Logo, 10 contratos.\n\nSe o resultado der zero, é porque seu stop é grande demais pro seu risco. Nesse caso, ou diminua o stop ou aceite não operar. Disciplina é isso.",
  },
  {
    slug: "payoff-expectativa",
    nome: "Payoff & Expectativa Matemática",
    descricao:
      "Descubra se o seu setup tem expectativa positiva antes de operar.",
    categoria: "trader",
    faq: [
      {
        q: "O que é payoff?",
        a: "Payoff é a razão entre o alvo e o stop. Se seu alvo é 200 pontos e o stop é 100, o payoff é 2:1. Quanto maior, menos você precisa acertar para ganhar dinheiro.",
      },
      {
        q: "Expectativa negativa significa que vou perder sempre?",
        a: "Significa que, na média, cada trade perde dinheiro. No longo prazo, o resultado tende a ser negativo. Mude o alvo, o stop ou a taxa de acerto.",
      },
    ],
    textoExplicativo:
      "Antes de colocar dinheiro em qualquer setup, você precisa saber se ele é matematicamente viável. O payoff te diz a relação entre ganho e perda. A expectativa te diz se, na média, cada trade soma ou subtrai da sua banca.\n\nA fórmula: expectativa = (acerto × alvo) – ((1 – acerto) × stop). Se der positivo, o setup faz sentido. Se der negativo, não importa o quão bom você se sente — a matemática está contra.\n\nO win rate de equilíbrio é o mínimo de acerto que você precisa para não perder. Fórmula: 1 / (1 + payoff). Com payoff 2:1, basta acertar 33% pra empatar.",
  },
  {
    slug: "monte-carlo",
    nome: "Simulador de Banca / Monte Carlo",
    descricao:
      "Simule centenas de cenários para entender o drawdown real do seu setup.",
    categoria: "trader",
    faq: [
      {
        q: "O que é simulação Monte Carlo?",
        a: "É rodar o mesmo setup centenas de vezes com resultados aleatórios (mas respeitando sua taxa de acerto e payoff). Isso mostra o que pode acontecer no melhor e no pior caso.",
      },
      {
        q: "Risco de ruína alto é muito grave?",
        a: "Sim. Se mais de 5% das simulações zeram a banca, seu risco por trade está alto demais. Reduza o percentual de risco.",
      },
    ],
    textoExplicativo:
      "O Monte Carlo pega suas estatísticas reais (acerto, payoff, risco por trade) e simula o que pode acontecer em centenas de cenários diferentes. Cada simulação é como viver uma timeline alternativa do seu trading.\n\nO resultado mais importante é o drawdown máximo — quanto sua banca pode cair antes de se recuperar. Se o drawdown médio passa de 30-40%, a maioria dos traders não aguenta psicologicamente.\n\nO risco de ruína mostra em quantas simulações a banca zerou. Se for mais de 5%, reduza o risco por trade. Simples assim.",
  },
  {
    slug: "custo-operacao",
    nome: "Custo Real da Operação",
    descricao:
      "Veja quanto você começa perdendo antes de ganhar qualquer ponto.",
    categoria: "trader",
    faq: [
      {
        q: "Com corretagem zero, o custo é zero?",
        a: "Não. Mesmo sem corretagem, existem emolumentos e taxa de registro da B3. E a corretagem zero geralmente vem com RLP — a corretora fica do outro lado da sua ordem.",
      },
      {
        q: "O custo em pontos importa tanto assim?",
        a: "Sim. Se você opera scalp e faz 10 trades por dia, cada centavo de custo se multiplica. Saber o custo em pontos é saber de onde você parte.",
      },
    ],
    textoExplicativo:
      "Muita gente acha que opera de graça porque a corretora oferece corretagem zero. Mas todo trade tem custo: emolumentos da B3, taxa de registro, e quando tem RLP, o spread embutido.\n\nEssa calculadora mostra o custo total em reais e, mais importante, em pontos. Isso significa: quantos pontos você precisa acertar só pra empatar. É o ponto de partida real da sua operação.\n\nDica: se os custos estão comendo mais do que 20% do seu alvo por trade, repense a frequência de operação ou o instrumento.",
  },
  {
    slug: "juros-compostos",
    nome: "Calculadora de Juros Compostos",
    descricao:
      "Simule quanto seu dinheiro pode render com aportes mensais e juros compostos.",
    categoria: "longo-prazo",
    faq: [
      {
        q: "Juros compostos são juros sobre juros?",
        a: "Sim. A cada mês, o rendimento incide sobre o saldo total (aporte + juros anteriores). É o que faz o dinheiro crescer de forma exponencial no longo prazo.",
      },
      {
        q: "Qual taxa mensal usar?",
        a: "Depende do investimento. Renda fixa gira em torno de 0,8% a 1% ao mês. Ações e FIIs podem render mais, mas com mais risco. Use a taxa do seu investimento real.",
      },
    ],
    textoExplicativo:
      "Juros compostos são a força mais poderosa dos investimentos de longo prazo. A cada mês, o rendimento incide não só sobre o que você aportou, mas sobre todo o saldo — incluindo os juros anteriores.\n\nA fórmula: FV = P × (1+i)^n + PMT × (((1+i)^n – 1) / i), onde P é o valor inicial, PMT é o aporte mensal, i é a taxa mensal e n é o prazo em meses.\n\nO gráfico mostra como, nos primeiros anos, a maior parte do saldo é aporte. Mas com o tempo, os juros ultrapassam. É aí que o tempo faz a mágica.",
  },
  {
    slug: "primeiro-milhao",
    nome: "Quando Vou Atingir Minha Meta",
    descricao:
      "Descubra em quanto tempo você chega no primeiro milhão (ou qualquer meta).",
    categoria: "longo-prazo",
    faq: [
      {
        q: "Preciso de muito dinheiro pra começar?",
        a: "Não. Com R$ 500 por mês e 1% ao mês, você chega a R$ 1 milhão em cerca de 18 anos. O segredo é começar e não parar.",
      },
      {
        q: "Posso colocar uma meta diferente de R$ 1 milhão?",
        a: "Sim. O campo meta é configurável. Coloque qualquer valor: R$ 100 mil, R$ 500 mil, R$ 5 milhões.",
      },
    ],
    textoExplicativo:
      "Essa calculadora pega seus números reais — quanto você tem, quanto aporta por mês e qual o rendimento — e calcula mês a mês até o saldo atingir a meta.\n\nNão é uma fórmula mágica. É aritmética pura. E o resultado costuma surpreender: quem aporta pouco mas por muito tempo costuma chegar mais longe do que quem aporta muito por pouco tempo.\n\nA curva mostra como o crescimento começa devagar e acelera com o tempo. Isso é o efeito dos juros compostos na prática.",
  },
  {
    slug: "viver-de-renda",
    nome: "Quanto Preciso pra Viver de Renda",
    descricao:
      "Calcule o capital necessário para gerar a renda mensal que você quer.",
    categoria: "longo-prazo",
    faq: [
      {
        q: "A fórmula é tão simples assim?",
        a: "Sim. Capital = renda desejada / taxa de retorno mensal. Se quer R$ 5.000/mês e sua taxa é 0,8%, precisa de R$ 625.000. Simples e direto.",
      },
      {
        q: "E a inflação?",
        a: "Use uma taxa de retorno real (já descontada da inflação). Se o investimento rende 1% ao mês e a inflação é 0,4%, use 0,6% como taxa.",
      },
    ],
    textoExplicativo:
      "Viver de renda é quando seus investimentos geram dinheiro suficiente para cobrir seu custo de vida sem precisar trabalhar por obrigação.\n\nA conta é simples: Capital = renda desejada ÷ taxa de retorno mensal. Se você quer R$ 5.000 por mês e consegue 0,8% ao mês, precisa de R$ 625.000 investidos.\n\nEssa calculadora vai além: se você informar quanto tem hoje e quanto aporta por mês, ela calcula em quanto tempo você chega lá.",
  },
  {
    slug: "reserva-de-emergencia",
    nome: "Reserva de Emergência",
    descricao:
      "Calcule quanto você precisa guardar para dormir tranquilo.",
    categoria: "longo-prazo",
    faq: [
      {
        q: "Onde guardar a reserva de emergência?",
        a: "Em algo líquido e seguro: Tesouro Selic, CDB com liquidez diária ou poupança. O objetivo não é render muito — é estar disponível quando precisar.",
      },
      {
        q: "Qual a diferença entre CLT e autônomo?",
        a: "CLT tem mais estabilidade (aviso prévio, FGTS, seguro-desemprego), então 6 meses costuma ser suficiente. Autônomo não tem rede de proteção, então 12 meses é mais seguro.",
      },
    ],
    textoExplicativo:
      "Antes de investir em qualquer coisa, monte sua reserva de emergência. Ela é o dinheiro que te mantém de pé quando algo dá errado: perda de emprego, problema de saúde, conserto urgente.\n\nA conta é simples: custo mensal essencial × meses de segurança. Custo essencial = aluguel + alimentação + contas + transporte. Sem luxo.\n\nA quantidade de meses depende da sua estabilidade. CLT com emprego estável: 6 meses. CLT em área instável: 9 meses. Autônomo ou PJ: 12 meses.\n\nGuarde em algo líquido e seguro. Não é pra render — é pra estar lá quando você precisar.",
  },
];

export function getFerramentaBySlug(slug: string): Ferramenta | undefined {
  return FERRAMENTAS.find((f) => f.slug === slug);
}
