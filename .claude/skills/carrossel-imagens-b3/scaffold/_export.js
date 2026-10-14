// Export canônico: carrossel.html -> slide-NN.png (2160x2880).
// Uso: node _export.js <pasta-vN>
// Se "Cannot find module 'playwright'": NODE_PATH="$(npm root -g)" node _export.js <pasta-vN>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const dir = path.resolve(process.argv[2] || __dirname);
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1440 },
    deviceScaleFactor: 2,
  });
  const fileUrl = 'file://' + path.resolve(dir, 'carrossel.html').split(path.sep).join('/');
  await page.goto(fileUrl);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);
  const fit = await page.evaluate(() => window.__fit);
  fs.writeFileSync(path.join(dir, 'fit-report.json'), JSON.stringify(fit, null, 2));
  if (!fit.fontesOk) throw new Error('Inter não carregou. PNG sairia com fonte de fallback.');
  const estouro = fit.slides.filter(s => s.overflow).map(s => s.slide);
  if (estouro.length) throw new Error('Texto transbordou em: ' + estouro.join(', ') + '. Corte texto ou divida o slide.');
  const slides = await page.$$('.slide');
  if (slides.length === 0) throw new Error('Nenhum .slide encontrado em carrossel.html');
  for (let i = 0; i < slides.length; i++) {
    const n = String(i + 1).padStart(2, '0');
    await slides[i].screenshot({ path: path.join(dir, `slide-${n}.png`) });
    const r = fit.slides[i];
    console.log(`Exportado slide-${n}.png  fonte ${r.fonte_px}px  imagem ${r.imagem_px}px  ocupação ${Math.round(r.ocupacao * 100)}%`);
  }
  await browser.close();
})().catch(e => { console.error(e.message || e); process.exit(1); });
