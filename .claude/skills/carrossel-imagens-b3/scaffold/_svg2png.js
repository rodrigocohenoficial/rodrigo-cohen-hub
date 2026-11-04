// Rasteriza SVG (gráfico ou diagrama) em PNG com a Inter carregada.
// SVG dentro de <img> não carrega web font, por isso todo SVG vira PNG antes de entrar no slide.
// Uso: node _svg2png.js entrada.svg saida.png
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const [entrada, saida] = process.argv.slice(2);
  const svg = fs.readFileSync(entrada, 'utf8');
  const w = +(svg.match(/width="(\d+)"/) || [0, 1824])[1];
  const h = +(svg.match(/height="(\d+)"/) || [0, 1280])[1];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(`<!doctype html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=block');
    *{margin:0;padding:0} body{width:${w}px;height:${h}px;overflow:hidden}
  </style></head><body>${svg}</body></html>`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  if (!(await page.evaluate(() => document.fonts.check('700 40px Inter')))) throw new Error('Inter não carregou');
  await page.locator('svg').first().screenshot({ path: saida });
  await browser.close();
  console.log('OK:', saida);
})().catch(e => { console.error(e.message || e); process.exit(1); });
