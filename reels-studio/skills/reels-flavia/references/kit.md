# Peças do estúdio

Toda peça com `at` entra no **segundo da fala** em que ela fala daquilo (do `transcript.json` já cortado).
Imports: `../../kit` (genéricas) e `../../flavia/...` (do estilo dela).

## Estrutura

| Peça | Uso |
|---|---|
| `<Scene from to>` | Bloco da metade de cima. Conteúdo centralizado em coluna. Entra e sai com fade. Uma ideia por cena |
| `<Publicidade />` | Selo "Publicidade" pequeno. Coloque uma vez, fora das cenas, quando for publi |
| `<CaixasGancho from to amarela branca y={300} />` | **Assinatura dela.** Gancho no começo e pergunta/CTA no fim. Texto curto (até ~45 caracteres por caixa) |

## Texto

| Peça | Uso |
|---|---|
| `<Headline at text size />` | Título em Playfair. `*trecho*` sai em itálico rosa-vinho. Tamanho 70–100 conforme o comprimento |
| `<Frase at text size dim />` | Frase de apoio em Montserrat. `dim` = mais apagada (complemento) |
| `<Card at label value width valueSize />` | Rótulo pequeno + valor ("Ricos em" / "Ácido gama-linolênico"). Dois lado a lado: `width={440} valueSize={46}` dentro de uma linha flex |
| `<Checklist title titleAt items={[{text, at}]} />` | Lista que entra item a item com ✓ (ex: "A base de tudo": alimentação, treino, sono...) |
| `<Counter at to prefix suffix label />` | Número contando (%, anos, kg, doses) — só com número que ela disse |
| `<Stamp at text tone />` | Carimbo. Use com parcimônia, o estilo dela é suave |

## Estilo Flávia (`src/flavia/kit.tsx`)

| Peça | Uso |
|---|---|
| `<ProdutoCard at src nome marca />` | Foto do produto (recortada do vídeo) + nome e marca |
| `<Ingrediente at id nome size />` | Ilustração num círculo + nome. `id`: `linhaca`, `borragem`, `primula`, `vitaminaE` (cápsula gelatinosa), `capsula` (cápsula genérica rosé) |
| `<Fases fases={[{nome, at}]} />` | Pílulas com seta: "Perimenopausa → Menopausa" |

**Ingrediente que ainda não tem ilustração** (ex: magnésio, colágeno, ômega 3): adicione um caso novo em
`Ilustracao` com SVG simples no mesmo espírito — formas chapadas, 2–3 cores, sem contorno pesado,
reconhecível em 200 px. Enquanto não houver, `capsula` serve de genérico.

## Layout auxiliar

```tsx
const Gap: React.FC<{ h?: number }> = ({ h = 40 }) => <div style={{ height: h }} />;
const Row: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 30 }) => (
  <div style={{ display: "flex", gap, justifyContent: "center", alignItems: "flex-start" }}>{children}</div>
);
```

A área útil da metade de cima tem ~960 px de altura: no máximo título + 2 blocos por cena.
