export interface Pilar {
  slug: string;
  nome: string;
  descricao: string;
  categoria: string;
  numero: string;
}

export const PILARES: Pilar[] = [
  {
    slug: "day-trade",
    nome: "Day Trade & Automação",
    descricao: "WIN, WDO, robôs e gestão de risco.",
    categoria: "Operação",
    numero: "01",
  },
  {
    slug: "investir",
    nome: "Investir de Verdade",
    descricao: "Ações, FIIs, renda fixa, dividendos.",
    categoria: "Patrimônio",
    numero: "02",
  },
  {
    slug: "primeiro-passo",
    nome: "Primeiro Passo",
    descricao: "Organizar, reservar, começar do zero.",
    categoria: "Base",
    numero: "03",
  },
  {
    slug: "mente",
    nome: "Mente de Trader",
    descricao: "Disciplina, erro, consistência.",
    categoria: "Cabeça",
    numero: "04",
  },
  {
    slug: "macro-cripto-ia",
    nome: "Macro, Cripto & IA",
    descricao: "Ciclos, juros e tecnologia.",
    categoria: "Mundo",
    numero: "05",
  },
  {
    slug: "vida",
    nome: "Menos Tela, Mais Vida",
    descricao: "Propósito, família, fé, legado.",
    categoria: "Vida",
    numero: "06",
  },
];

export function getPilarBySlug(slug: string): Pilar | undefined {
  return PILARES.find((p) => p.slug === slug);
}
