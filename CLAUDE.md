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

- As capas dos artigos são **geradas automaticamente por código** via `next/og` (`app/[pilar]/[slug]/opengraph-image.tsx`).
- A capa usa o `title` e o `pilar` do frontmatter — cor de fundo e texto definidos em `lib/pilares.ts` (`ogBg`, `ogText`).
- Todo artigo MDX com `title` e `pilar` no frontmatter recebe capa automática na home (cards), na página do artigo (topo) e como `og:image`.
- **Nunca criar arquivos de imagem manuais para artigos nem pedir imagens ao usuário.**
