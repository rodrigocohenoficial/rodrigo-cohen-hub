@AGENTS.md

# Regras permanentes do projeto — rodrigo-cohen-hub

## Contexto

Hub de autoridade de Rodrigo Cohen (rodrigocohen.com.br) — trader profissional, analista CNPI, embaixador B3 e Santander. Cobre todo tipo de investimento. **Meta nº 1: máxima indexação e citação por IA e busca.**

## Design

- **Paleta:** evergreen `#122E24`, bone `#F2EDE2`, paper `#FBF8F1`, brass `#B0843B`, ink `#1C1B17`.
- **Fontes:** Fraunces (títulos) e Inter (corpo).
- **Espelho visual:** `preview-hub-rodrigo-cohen.html` (sempre consultar antes de criar ou alterar componentes visuais).

## 6 Pilares

`day-trade` · `investir` · `primeiro-passo` · `mente` · `macro-cripto-ia` · `vida`

## Voz e tom

- Direta, humana, eye-to-eye. Nunca corporativa.
- Legibilidade nível 10 — um adolescente entende de primeira.
- **Proibido:** "ninguém te conta", "a real é", construções "não é X, é Y", analogias forçadas, tricolons poéticos.

## Parceiros

- **Santander** = corretagem zero sem RLP, segurança, suporte rápido, plataforma grátis.
- **B3** = melhor amiga do trader, educação e transparência.

## Artigos

- Arquivos `.mdx` em `content/[pilar]/`.
- Frontmatter padrão obrigatório: `title`, `slug`, `pilar`, `respostaRapida`, `faq`, `relacionados`.
- O sistema gera a página sozinho a partir do frontmatter e do conteúdo MDX.

## Capas automáticas (OG Image)

- A `og:image` de compartilhamento é **gerada por código** via `next/og` (`app/[pilar]/[slug]/opengraph-image.tsx`).
- Cor de fundo e texto definidos em `lib/pilares.ts` (`ogBg`, `ogText`).
- **Nunca criar arquivos de imagem manuais para artigos nem pedir imagens ao usuário.**

## Fotos de capa (Unsplash)

- Artigos usam fotos reais do Unsplash como capa visual (cards e topo do artigo).
- O script `npm run fetch-unsplash` busca fotos via API e grava no frontmatter: `imagem`, `imagemAlt`, `unsplashFotografo`, `unsplashFotografoUrl`.
- A foto é estável (gravada no MDX, não muda a cada visita).
- Atribuição ao fotógrafo é exibida abaixo da capa, conforme exigido pela API Unsplash.
- Se não houver foto Unsplash, cards e capa usam a OG image tipográfica como fallback.
- A `og:image` (para redes sociais) continua sendo a imagem tipográfica gerada por `opengraph-image.tsx`.
