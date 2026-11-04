// Print de página oficial (b3.com.br, Bora Investir, bcb.gov.br...) com banner de cookies removido.
// Uso: node _print.js <url> <saida.png> [seletor-css] [largura] [altura]
//   seletor: captura só aquele elemento (ex.: "article", "main h1"). Sem seletor: primeira dobra.
// SEMPRE abra o PNG com Read depois. Site pode devolver erro, login wall, banner ou página vazia.
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const [url, saida, seletor, largura = '1440', altura = '1800'] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +largura, height: +altura }, deviceScaleFactor: 2, locale: 'pt-BR' });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await page.addStyleTag({ content: `
    #onetrust-banner-sdk, #onetrust-consent-sdk, .onetrust-pc-dark-filter, [id*="cookie" i], [class*="cookie" i],
    [class*="lgpd" i], [id*="lgpd" i], [class*="consent" i] { display: none !important; }` });
  await page.waitForTimeout(500);
  if (seletor) {
    const el = page.locator(seletor).first();
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: saida });
  } else {
    await page.screenshot({ path: saida });
  }
  await browser.close();
  const kb = fs.statSync(saida).size / 1024;
  if (kb < 10) throw new Error(`Print com ${kb.toFixed(0)}KB. Provável página vazia, bloqueio ou login wall.`);
  console.log(`OK: ${saida} (${kb.toFixed(0)}KB). Abra com Read e confira antes de usar.`);
})().catch(e => { console.error(e.message || e); process.exit(1); });
