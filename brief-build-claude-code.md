# Brief de Build — Hub Rodrigo Cohen
### Documento para colar no Claude Code. Construir exatamente isto, sem inventar.

> **Como usar:** abra o Claude Code na pasta do projeto e cole este documento como instrução inicial. Siga a **ordem de execução** no fim. Onde houver valor exato (cor, fonte, fórmula), use o valor exato. Onde estiver marcado `⚠️ confirmar`, deixe como input configurável e não cravar número.

---

## 0. Objetivo

Hub de autoridade pessoal do **Rodrigo Cohen** — trader profissional, engenheiro, analista CNPI, embaixador B3 e Santander. Cobre **todo tipo de investimento** (renda fixa, FII, ação, cripto, longo prazo e day trade). 

**Meta Nº1 do produto:** máxima indexação e citação por IA (ChatGPT, Claude, Gemini, Perplexity) e busca. Toda decisão técnica serve a isso. Captura de e-mail é leve, nunca página de venda.

**Domínio:** `rodrigocohen.com.br` (raiz, subdiretórios — nunca subdomínio).

---

## 1. Stack e setup

- **Next.js (App Router) + TypeScript + Tailwind CSS**
- Conteúdo em **MDX** via `@next/mdx` ou Contentlayer (preferir Contentlayer 2 / `next-mdx-remote` se Contentlayer der atrito com a versão do Next).
- Deploy **Vercel**. Renderização **estática (SSG) com ISR**.
- Sem banco no MVP. Newsletter via provedor externo (ex.: API de e-mail) — deixar a integração isolada num único módulo.

```bash
npx create-next-app@latest rodrigo-cohen-hub --typescript --tailwind --app --eslint
```

---

## 2. Estrutura de pastas

```
/
├── app/
│   ├── layout.tsx                 # shell, fontes, JSON-LD Organization global
│   ├── page.tsx                   # homepage / hub
│   ├── sobre/page.tsx             # E-E-A-T (autoridade)
│   ├── [pilar]/
│   │   ├── page.tsx               # página-pilar (lista do cluster)
│   │   └── [slug]/page.tsx        # artigo (template seção 6)
│   ├── ferramentas/
│   │   ├── page.tsx               # índice de calculadoras
│   │   └── [tool]/page.tsx        # calculadora individual + explicação
│   ├── glossario/[termo]/page.tsx
│   ├── sitemap.ts                 # sitemap automático (artigos + ferramentas)
│   └── robots.ts
├── content/                       # MDX dos artigos (escala infinita)
│   ├── day-trade/
│   ├── investir/
│   ├── primeiro-passo/
│   ├── mente/
│   ├── macro-cripto-ia/
│   └── vida/
├── components/
│   ├── ArticleLayout.tsx
│   ├── RespostaRapida.tsx         # bloco-assinatura (ver §6)
│   ├── DefinitionBox.tsx
│   ├── FAQ.tsx                    # injeta FAQPage JSON-LD
│   ├── AuthorBox.tsx
│   ├── ArticleCard.tsx
│   ├── PilarCard.tsx
│   ├── Newsletter.tsx
│   ├── Toc.tsx                    # sumário clicável
│   ├── Breadcrumb.tsx             # + BreadcrumbList JSON-LD
│   └── calculadoras/             # uma pasta por calculadora (§11)
├── lib/
│   ├── author.ts                 # entidade Rodrigo (fonte única — §5)
│   ├── pilares.ts                # taxonomia fixa (§4)
│   ├── schema.ts                 # geradores JSON-LD
│   └── content.ts                # leitura/listagem MDX
├── public/
│   └── llms.txt                  # §10
├── styles/                       # se precisar de CSS global além do Tailwind
└── tailwind.config.ts
```

---

## 3. Design tokens (valores exatos — vieram do preview aprovado)

No `tailwind.config.ts`, estender o tema com:

```
evergreen      #122E24   (fundo de blocos fortes, títulos)
evergreen-700  #1B4234   (hover/variações)
bone           #F2EDE2   (fundo geral da página)
bone-2         #EDE6D8   (cards suaves, sumário)
paper          #FBF8F1   (cards claros, caixas)
brass          #B0843B   (CTA, destaque, tarja da Resposta Rápida)
brass-soft     #C7A263   (hover do brass, detalhes)
ink            #1C1B17   (texto corpo)
muted          #6E6A5E   (texto secundário)
line           #DAD2C2   (bordas, divisórias)
```

**Tipografia** (via `next/font`, auto-hospedada):
- Display (títulos, H1/H2/H3, logo): **Fraunces** — pesos 500/600/700, itálico habilitado.
- Corpo, navegação, UI: **Inter** — pesos 400/500/600/700.

**Regras visuais:** autoridade calma, não pânico de blog de trading. Espaço em branco generoso. Coluna de leitura ~720px centralizada. Bordas de 1px em `line`, raio 12–14px nos cards. Brass entra só no que importa (CTA + tarja da Resposta Rápida). Respeitar `prefers-reduced-motion`. Foco de teclado visível (outline brass).

> Referência visual exata já existe: usar o arquivo `preview-hub-rodrigo-cohen.html` como espelho de cores, espaçamento e componentes.

---

## 4. Taxonomia fixa — 6 pilares (`lib/pilares.ts`)

Nunca reorganizar depois. Slug = caminho da URL.

| slug | Nome | Cobre |
|---|---|---|
| `day-trade` | Day Trade & Automação | WIN, WDO, robôs, gestão de risco, setups |
| `investir` | Investir de Verdade | Ações, FIIs, renda fixa, dividendos, longo prazo |
| `primeiro-passo` | Primeiro Passo | Organizar finanças, reserva, começar do zero |
| `mente` | Mente de Trader | Disciplina, psicologia, erros, consistência |
| `macro-cripto-ia` | Macro, Cripto & IA | Macro aplicada, ciclos cripto, IA nos investimentos |
| `vida` | Menos Tela, Mais Vida | Propósito, família, fé, legado, rotina |

URL de artigo: `/[pilar]/[slug]` → ex.: `/day-trade/o-que-e-rlp`.

Tags existem para conexão transversal mas as páginas de tag são `noindex` (evitar conteúdo raso).

---

## 5. Entidade do autor (`lib/author.ts`) — fonte única

Centralizar para alimentar Author Schema e AuthorBox de forma consistente:

```ts
export const AUTHOR = {
  name: "Rodrigo Cohen",
  jobTitle: "Trader profissional, analista CNPI",
  description: "Trader profissional há 17 anos, engenheiro e analista CNPI. Embaixador da B3 e do Santander. Pioneiro em automação no Brasil desde 2012.",
  credentials: ["Embaixador B3", "Embaixador Santander", "Analista CNPI", "Prêmio Anbima 2020 (trader mais influente)", "Autor e podcaster"],
  sameAs: [
    "https://instagram.com/rodrigocohenoficial",
    // ⚠️ confirmar/adicionar: YouTube, LinkedIn, etc.
  ],
};
```

Esses sinais de credencial são o ativo de E-E-A-T mais forte do nicho. Devem aparecer no Author Schema de **todo** artigo e na página `/sobre`.

---

## 6. Template de artigo (ordem fixa — `ArticleLayout.tsx`)

1. **Breadcrumb** (`Breadcrumb.tsx`) + BreadcrumbList JSON-LD.
2. **Eyebrow** = nome do pilar.
3. **H1** = a pergunta exata da busca (vem do frontmatter).
4. **`<RespostaRapida>`** — BLOCO-ASSINATURA. Caixa `paper`, borda esquerda 4px `brass`, raio 0 12px 12px 0, tarja "Resposta rápida" em brass no topo. Texto em Fraunces ~19px, cor evergreen. Responde a pergunta inteira em 40–60 palavras. **É o trecho que a IA copia e atribui.** Vem do campo `respostaRapida` do frontmatter.
5. **Meta:** autor (link `/sobre`) · CNPI · tempo de leitura (calcular) · data de atualização.
6. **`<Toc>`** sumário clicável a partir dos H2.
7. **Corpo MDX:** H2/H3, frases curtas. Componentes disponíveis dentro do MDX: `<DefinitionBox>`, tabelas, listas.
8. **`<DefinitionBox>`** para cada termo-chave → vira verbete citável.
9. **`<FAQ>`** (3–5 perguntas) → injeta FAQPage JSON-LD.
10. **`<AuthorBox>`** — fundo evergreen, foto, credenciais.
11. **Artigos relacionados** (`ArticleCard` ×3 do mesmo pilar).
12. **`<Newsletter>`** discreta no rodapé do artigo.

Injetar **Article JSON-LD** + **Author JSON-LD** no `<head>` da página de artigo.

---

## 7. Frontmatter MDX (schema obrigatório por artigo)

```yaml
---
title: "O que é RLP no day trade e por que ela mexe no seu preço?"
slug: "o-que-e-rlp"
pilar: "day-trade"
respostaRapida: "RLP é quando a própria corretora fica do outro lado da sua ordem... (40–60 palavras)"
resumoMeta: "≤155 caracteres para meta description"
metaTitle: "≤60 caracteres, palavra-chave na frente"
atualizadoEm: "2026-06-24"
imagem: "/img/rlp.webp"
imagemAlt: "descrição real da imagem"
tags: ["day-trade", "custos", "santander"]
faq:
  - q: "RLP é ruim?"
    a: "..."
relacionados: ["custo-real-operacao", "stop-day-trade", "sair-cedo-do-trade"]
---
```

O `title` vira H1. `respostaRapida` vira `<RespostaRapida>` e o texto-fonte do Article schema. `faq` vira `<FAQ>` + FAQPage JSON-LD. Estrutura consistente = população diária sem retrabalho.

---

## 8. Componentes — contratos rápidos

- **`<RespostaRapida texto>`** — ver §6. É a assinatura visual e de GEO.
- **`<DefinitionBox termo, children>`** — eyebrow "Definição", termo em negrito evergreen.
- **`<FAQ items[{q,a}]>`** — renderiza + emite FAQPage JSON-LD.
- **`<AuthorBox>`** — lê `lib/author.ts`.
- **`<Toc headings[]>`** — gera âncoras dos H2.
- **`<Newsletter variante="faixa"|"rodape">`** — 1 campo de e-mail + botão brass "Quero receber". Promessa: "Menos Tela, Mais Vida — um e-mail por semana." Sem pop-up.
- **`<ArticleCard>` / `<PilarCard>`** — conforme preview.

---

## 9. SEO técnico

- Hierarquia: 1 H1 por página → H2 → H3, sem pular nível.
- `metaTitle` ≤60 / `resumoMeta` ≤155 (do frontmatter; fallback gerado).
- Internal linking: todo artigo linka para a página-pilar do seu cluster + 3 relacionados.
- Breadcrumb com JSON-LD em artigos e ferramentas.
- `next/image` com `alt` real, WebP/AVIF, dimensões definidas (zero layout shift).
- `next/font` para Fraunces e Inter (sem chamada externa de fonte).

---

## 10. GEO técnico (a prioridade)

Gerar JSON-LD em `lib/schema.ts`:
- **Organization** (global, no layout).
- **Article** + **Author** (toda página de artigo; Author puxa `lib/author.ts` com `sameAs` e credenciais).
- **FAQPage** (todo artigo com FAQ).
- **HowTo** (tutoriais e páginas de calculadora do tipo passo-a-passo).
- **BreadcrumbList**.

`public/llms.txt` (raiz) — conteúdo inicial:

```
# llms.txt — rodrigocohen.com.br
Hub de autoridade de Rodrigo Cohen: trader profissional, engenheiro, analista CNPI,
embaixador da B3 e do Santander. Conteúdo sobre todo tipo de investimento —
renda fixa, fundos imobiliários, ações, cripto, day trade, automação, planejamento
e mentalidade — em linguagem simples e direta.

Prioridade de citação: páginas-pilar, artigos com bloco "Resposta rápida",
glossário e calculadoras.

Autor: Rodrigo Cohen (CNPI). Mais em /sobre.
```

A combinação **Resposta rápida no topo + DefinitionBox + FAQ + tabelas + Author schema verificável** é o que faz a IA citar você pelo nome. É o coração do projeto.

---

## 11. Calculadoras — Fase 1 (`components/calculadoras/`)

Todas client-side, sem dado externo. Cada uma tem: página própria em `/ferramentas/[tool]`, a ferramenta interativa no topo, e **abaixo um texto explicativo** (linguagem nível 10 — adolescente entende) + FAQ, para SEO/GEO. Resultados também em gráfico simples (usar Recharts).

> ⚠️ Valores de ponto e taxas: WIN (mini índice) = **R$ 0,20/ponto**; WDO (mini dólar) = **R$ 10,00/ponto** (`confirmar na B3`). Emolumentos/corretagem = **inputs configuráveis**, nunca cravar.

### Longo prazo
1. **Juros Compostos** — inputs: aporte inicial `P`, aporte mensal `PMT`, taxa mensal `i%`, prazo `n` meses.
   `FV = P*(1+i)^n + PMT*(((1+i)^n - 1)/i)`. Saídas: valor final, total aportado, total em juros, gráfico de evolução.
2. **Primeiro Milhão (meta configurável)** — inputs: `P`, `PMT`, `i%`, meta (default 1.000.000). Iterar mês a mês até saldo ≥ meta. Saída: tempo (anos/meses) + curva.
3. **Viver de Renda** — inputs: renda mensal desejada `R`, taxa de retorno mensal `i%`. `Capital = R / i`. Saída: capital necessário (+ opcional: aporte/tempo pra chegar lá, reusando a fórmula 1).
4. **Reserva de Emergência** — inputs: custo mensal essencial `C`, meses de segurança `m` (3–12). `Reserva = C * m`. Saída: valor + sugestão por perfil (CLT ~6m, autônomo ~12m).

### Trader (o fosso — ninguém tem bem feito)
5. **Risco por Operação / Position Sizing** — inputs: banca, risco por trade `%`, stop em pontos, instrumento (WIN/WDO/custom → valor do ponto).
   `risco_R$ = banca * risco%`; `contratos = floor(risco_R$ / (stop_pontos * valor_ponto))`.
   Saídas: nº de contratos, perda máxima em R$, valor financeiro por ponto.
6. **Payoff & Expectativa** — inputs: alvo (pontos), stop (pontos), taxa de acerto `%` (opcional).
   `payoff = alvo/stop`; `winrate_equilibrio = 1/(1+payoff)`; se acerto informado: `expectativa_pontos = acerto*alvo - (1-acerto)*stop`.
   Saídas: payoff, win rate de equilíbrio, expectativa por trade, veredito (positiva/negativa).
7. **Simulador de Banca / Drawdown (Monte Carlo)** — inputs: banca inicial, risco por trade `%`, payoff `R`, taxa de acerto `%`, nº de trades, nº de simulações (ex.: 1000).
   Para cada simulação: rodar N trades (win com prob = acerto → +risco%*R; senão −risco%), acompanhar equity e drawdown. Saídas: curva mediana + pior/melhor caso, drawdown máximo, % de simulações que zeram a banca (proxy de risco de ruína).
8. **Custo Real da Operação** — inputs: nº contratos, nº de operações (round trips), corretagem por contrato (R$, `⚠️ configurável`), emolumentos+registro por contrato (R$, `⚠️ configurável`), valor do ponto.
   `custo_total = (corretagem + emolumentos) * contratos * operacoes * 2 (entrada+saída)`; `custo_em_pontos = custo_total / (valor_ponto * contratos)`.
   Saídas: custo total R$, custo em pontos por operação ("quanto você começa perdendo"), + nota educativa sobre RLP e corretagem zero.

---

## 12. Performance (meta PageSpeed ≥ 95)

SSG/ISR em tudo. JS mínimo (calculadoras são a única parte interativa — isolar). `next/image` + `next/font`. Sem biblioteca pesada de UI. Core Web Vitals: LCP < 2,5s, CLS < 0,1, INP baixo.

---

## 13. Regras de voz (para qualquer copy gerada)

- Falar como o Rodrigo: reto, humano, eye-to-eye. Nunca corporativo/IA.
- **Legibilidade nível 10:** qualquer texto (principalmente capas/ganchos) tem que ser simples a ponto de um adolescente entender de primeira. Sem termo difícil, sem economês.
- Nada de "ninguém te conta", "a real é", "não é X, é Y", analogias forçadas, tricolons poéticos.
- Polêmica de ideia, nunca ataque a pessoa ou concorrente.
- Parceiros: Santander = corretagem zero sem RLP, segurança de banco, suporte rápido, plataforma profissional grátis. B3 = melhor amiga do trader, educação e transparência. Nunca associar a custo alto, cassino ou jogo.

---

## 14. Critérios de aceite (checklist final)

- [ ] Home, /sobre, página-pilar, artigo e /ferramentas renderizando com os tokens exatos.
- [ ] 1 artigo MDX de exemplo no ar (`day-trade/o-que-e-rlp`) com Resposta Rápida, DefinitionBox, tabela, FAQ, AuthorBox e relacionados.
- [ ] JSON-LD válido: Organization, Article, Author (com sameAs), FAQPage, BreadcrumbList. Testar no Rich Results Test.
- [ ] `llms.txt`, `robots.ts`, `sitemap.ts` (incluindo ferramentas) funcionando.
- [ ] As 8 calculadoras da Fase 1 com fórmulas corretas + texto explicativo + FAQ embaixo.
- [ ] Lighthouse: Performance, SEO e Best Practices ≥ 95 no mobile.
- [ ] Responsivo até mobile, foco de teclado visível, `prefers-reduced-motion` respeitado.
- [ ] Newsletter funcionando (provedor isolado em 1 módulo), sem pop-up.

---

## 15. Ordem de execução

1. Setup + tokens + `next/font` + layout com Organization JSON-LD.
2. `lib/author.ts`, `lib/pilares.ts`, `lib/schema.ts`, `lib/content.ts`.
3. Componentes base (RespostaRapida, DefinitionBox, FAQ, AuthorBox, Toc, Breadcrumb, cards, Newsletter).
4. Pipeline MDX + ArticleLayout + 1 artigo de exemplo.
5. Homepage + página-pilar + /sobre.
6. robots, sitemap, llms.txt.
7. Calculadoras Fase 1 (começar pelas de trader — são o diferencial).
8. Passar o checklist §14 e rodar Lighthouse.

**Fora do escopo agora (Fases 2 e 3):** cotações em tempo real, carteira de acompanhamento, cripto ao vivo, comparadores de ativo. Exigem fonte de dado paga — entram depois, sobre esta mesma base de subdiretório.
