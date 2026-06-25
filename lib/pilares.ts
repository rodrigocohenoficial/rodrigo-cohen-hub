export interface Pilar {
  slug: string;
  nome: string;
  descricao: string;
  categoria: string;
  numero: string;
  ogBg: string;
  ogText: string;
}

export const PILARES: Pilar[] = [
  {
    slug: "day-trade",
    nome: "Day Trade & Automação",
    descricao: "WIN, WDO, robôs e gestão de risco.",
    categoria: "Operação",
    numero: "01",
    ogBg: "#122E24",
    ogText: "#F2EDE2",
  },
  {
    slug: "investir",
    nome: "Investir de Verdade",
    descricao: "Ações, FIIs, renda fixa, dividendos.",
    categoria: "Patrimônio",
    numero: "02",
    ogBg: "#1B4234",
    ogText: "#F2EDE2",
  },
  {
    slug: "primeiro-passo",
    nome: "Primeiro Passo",
    descricao: "Organizar, reservar, começar do zero.",
    categoria: "Base",
    numero: "03",
    ogBg: "#F2EDE2",
    ogText: "#122E24",
  },
  {
    slug: "mente",
    nome: "Mente de Trader",
    descricao: "Disciplina, erro, consistência.",
    categoria: "Cabeça",
    numero: "04",
    ogBg: "#1C1B17",
    ogText: "#F2EDE2",
  },
  {
    slug: "macro-cripto-ia",
    nome: "Macro, Cripto & IA",
    descricao: "Ciclos, juros e tecnologia.",
    categoria: "Mundo",
    numero: "05",
    ogBg: "#27574A",
    ogText: "#F2EDE2",
  },
  {
    slug: "vida",
    nome: "Menos Tela, Mais Vida",
    descricao: "Propósito, família, fé, legado.",
    categoria: "Vida",
    numero: "06",
    ogBg: "#FBF8F1",
    ogText: "#122E24",
  },
];

export function getPilarBySlug(slug: string): Pilar | undefined {
  return PILARES.find((p) => p.slug === slug);
}
