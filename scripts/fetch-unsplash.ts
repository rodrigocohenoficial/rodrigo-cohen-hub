import fs from "fs";
import path from "path";
import matter from "gray-matter";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const CONTENT_DIR = path.join(process.cwd(), "content");
const API_URL = "https://api.unsplash.com/search/photos";
const UTM = "?utm_source=rodrigo_cohen_hub&utm_medium=referral";

// ---------------------------------------------------------------------------
// English visual keyword map — concrete, image-friendly terms per topic
// ---------------------------------------------------------------------------
const KEYWORD_MAP: Record<string, string> = {
  // day-trade
  "day-trade-da-para-viver": "stock trading desk monitors charts",
  "melhor-horario-day-trade": "stock market opening bell time schedule",
  "o-que-e-position-sizing": "risk management chess strategy planning",
  "o-que-e-rlp": "stock exchange trading screen broker",
  "o-que-e-robo-de-trading": "algorithmic trading robot technology code",
  "onde-colocar-o-stop": "safety net protection risk shield",
  "quanto-precisa-para-day-trade": "money calculator financial planning startup",
  "quanto-trader-ganha-por-mes": "trader profit earnings success desk",
  "win-ou-wdo": "futures contract financial market index",

  // investir
  "cdb-ou-tesouro-direto": "government bonds savings certificate bank",
  "como-declarar-investimentos-no-ir": "tax return documents calculator filing papers",
  "o-que-e-dividendo": "dividend income cash payment stock shareholder",
  "o-que-e-etf": "stock exchange index fund diversification portfolio",
  "o-que-olhar-num-fii": "commercial building office real estate analysis",
  "o-que-sao-lci-e-lca": "bank vault safe deposit fixed income security",
  "renda-fixa-ou-renda-variavel": "crossroads choice decision path direction sign",
  "comecar-a-investir-em-acoes": "stock market beginner investor growth",
  "o-que-e-fii": "real estate buildings skyline property investment",
  "quanto-para-viver-de-dividendos": "passive income dividends retirement freedom",
  "vale-a-pena-poupanca": "piggy bank savings coins jar",

  // macro-cripto-ia
  "halving-do-bitcoin": "bitcoin mining hardware cryptocurrency halving",
  "ia-nos-investimentos": "artificial intelligence robot technology finance data",
  "taxa-de-juros-americana": "US treasury bonds dollar interest rates wall street",
  "o-que-e-bitcoin": "bitcoin digital currency blockchain network",
  "o-que-faz-o-dolar-subir": "US dollar bills exchange rate currency",

  // mente
  "comprar-na-alta-vender-na-baixa": "stock market crash panic sell crowd herd",
  "disciplina-para-investir-todo-mes": "calendar routine consistency habit planner",
  "dobrar-aposta-depois-de-perder": "poker chips gambling risk emotion control",
  "lidar-com-sequencia-de-prejuizos": "storm resilience recovery setback perseverance",
  "o-que-e-tilt": "frustrated man head hands stress anger emotion",
  "sair-cedo-do-trade": "anxiety impatience clock pressure decision",
  "seguir-o-proprio-plano": "compass direction plan strategy map navigation",

  // primeiro-passo
  "como-montar-orcamento": "budget notebook pen calculator household expenses",
  "o-que-e-a-selic": "central bank interest rate economy brazil",
  "o-que-e-inflacao": "grocery prices supermarket shopping inflation cost",
  "o-que-fazer-com-o-primeiro-salario": "young professional first paycheck celebration money",
  "o-que-sao-juros-compostos": "compound interest growth snowball wealth",
  "quanto-juntar-para-aposentar": "retirement senior couple beach sunset relaxation",
  "vale-a-pena-cartao-de-credito": "credit card payment shopping contactless tap",
  "organizar-financas-sobrar-dinheiro": "budget spreadsheet financial organization wallet",
  "reserva-de-emergencia-quanto-guardar": "emergency fund umbrella safety savings jar",
  "sair-das-dividas-e-investir": "debt freedom breaking chains fresh start",

  // vida
  "dinheiro-meio-ou-fim": "work life balance family nature purpose",
  "ensinar-filhos-sobre-dinheiro": "father daughter learning counting coins allowance",
  "fe-e-dinheiro": "church light faith prayer gratitude spiritual",
  "o-custo-de-viver-correndo-atras-de-mais": "burnout exhaustion rat race treadmill stress",
  "o-que-a-escola-nao-ensina-sobre-dinheiro": "classroom school education books learning",
  "operar-sem-viver-na-tela": "laptop closed sunset beach freedom outdoors",
  "por-que-legado-vale-mais-que-patrimonio": "grandfather grandchild generations family legacy wisdom",
  "investir-e-ter-vida": "freedom outdoor nature hiking adventure lifestyle",
};

// ---------------------------------------------------------------------------
// Unsplash types & helpers
// ---------------------------------------------------------------------------

interface UnsplashPhoto {
  id: string;
  urls: { regular: string };
  alt_description: string | null;
  user: {
    name: string;
    links: { html: string };
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractPhotoId(url: string): string {
  const match = url.match(/photo-[a-zA-Z0-9_-]+/);
  return match ? match[0] : url;
}

// ---------------------------------------------------------------------------
// Search with deduplication
// ---------------------------------------------------------------------------

async function fetchResults(query: string): Promise<UnsplashPhoto[]> {
  const url = new URL(API_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "15");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });

  if (res.status === 429) {
    console.log("  ⏳ Rate limited. Waiting 60s...");
    await sleep(60_000);
    const retry = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
    });
    if (!retry.ok) return [];
    const data = await retry.json();
    return data.results ?? [];
  }

  if (!res.ok) {
    console.log(`  ✗ API error: ${res.status} ${res.statusText}`);
    return [];
  }

  const data = await res.json();
  return data.results ?? [];
}

function pickUnused(
  results: UnsplashPhoto[],
  usedIds: Set<string>
): UnsplashPhoto | null {
  for (const photo of results) {
    const photoKey = extractPhotoId(photo.urls.regular);
    if (!usedIds.has(photoKey)) {
      return photo;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!ACCESS_KEY || ACCESS_KEY === "COLE_SUA_CHAVE_AQUI") {
    console.error(
      "✗ Set UNSPLASH_ACCESS_KEY in .env.local before running this script."
    );
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const forceAll = args.includes("--force");
  const slugIdx = args.indexOf("--slug");
  const onlySlug = slugIdx !== -1 ? args[slugIdx + 1] : null;

  // Collect all MDX files
  const pilares = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => fs.statSync(path.join(CONTENT_DIR, f)).isDirectory());

  // Collect ALL MDX files (for dedup), then filter for processing
  const allFiles: { pilar: string; slug: string; filePath: string }[] = [];

  for (const pilar of pilares) {
    const dir = path.join(CONTENT_DIR, pilar);
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".mdx"))) {
      const slug = f.replace(/\.mdx$/, "");
      allFiles.push({ pilar, slug, filePath: path.join(dir, f) });
    }
  }

  // Files to process (filtered by --slug if provided)
  const files = onlySlug
    ? allFiles.filter((f) => `${f.pilar}/${f.slug}` === onlySlug)
    : allFiles;

  // First pass: collect already-used Unsplash photo IDs from ALL articles (for deduplication)
  // Always scan all files, but only skip IDs of articles we're NOT re-processing
  const usedIds = new Set<string>();
  for (const { pilar, slug, filePath } of allFiles) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    if (typeof data.imagem === "string" && data.imagem.includes("unsplash.com")) {
      const isBeingProcessed = files.some((f) => f.pilar === pilar && f.slug === slug);
      if (!isBeingProcessed || !forceAll) {
        usedIds.add(extractPhotoId(data.imagem));
      }
    }
  }

  console.log(
    `\nFetching Unsplash photos for ${files.length} articles (${usedIds.size} already assigned)...\n`
  );

  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < files.length; i++) {
    const { slug, filePath } = files[i];
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const prefix = `[${i + 1}/${files.length}] ${files[i].pilar}/${slug}`;

    // Skip if manual override (non-Unsplash URL set by user)
    if (
      !forceAll &&
      typeof data.imagem === "string" &&
      data.imagem.startsWith("http") &&
      !data.imagem.includes("unsplash.com")
    ) {
      console.log(`${prefix} — manual override, skipping`);
      skipped++;
      continue;
    }

    // Skip if already has Unsplash URL (unless --force)
    if (
      !forceAll &&
      typeof data.imagem === "string" &&
      data.imagem.includes("unsplash.com")
    ) {
      console.log(`${prefix} — already has Unsplash photo, skipping`);
      skipped++;
      continue;
    }

    // Build query from keyword map (English, visual, concrete)
    const query = KEYWORD_MAP[slug];
    if (!query) {
      console.log(`${prefix} — no keyword mapping, skipping (add to KEYWORD_MAP)`);
      continue;
    }

    console.log(`${prefix} — query: "${query}"`);

    try {
      const results = await fetchResults(query);

      if (results.length === 0) {
        console.log(`${prefix} — no results, keeping current image`);
        continue;
      }

      const photo = pickUnused(results, usedIds);

      if (!photo) {
        console.log(
          `${prefix} — all ${results.length} results already used, keeping current`
        );
        continue;
      }

      // Track this photo as used
      usedIds.add(extractPhotoId(photo.urls.regular));

      data.imagem = photo.urls.regular;
      if (photo.alt_description) {
        data.imagemAlt = photo.alt_description;
      }
      data.unsplashFotografo = photo.user.name;
      data.unsplashFotografoUrl = `${photo.user.links.html}${UTM}`;

      const output = matter.stringify(content, data);
      fs.writeFileSync(filePath, output, "utf-8");

      console.log(
        `${prefix} — ✓ ${photo.user.name} (${photo.alt_description?.slice(0, 50) || "no alt"})`
      );
      updated++;
    } catch (err) {
      console.log(
        `${prefix} — ✗ error: ${err instanceof Error ? err.message : err}`
      );
    }

    // Rate limit: 1 second between requests
    if (i < files.length - 1) {
      await sleep(1000);
    }
  }

  console.log(
    `\nDone. Updated: ${updated}, Skipped: ${skipped}, Total: ${files.length}\n`
  );
}

main();
