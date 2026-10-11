// Corta trechos do vídeo e ajusta os tempos da transcrição junto.
// Sempre parte do bruto (video-bruto.mp4 / transcript-bruto.json), então pode rodar de novo com outros cortes.
// Uso: npm run cortar -- <id> <inicio-fim> [inicio-fim...] [--pausas]
//   ex: npm run cortar -- reel-01 0-6.05 75.62-80.72
//   --pausas encurta todo silêncio maior que 0,3s para um respiro de 0,15s (detectado no áudio).
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [id, ...args] = process.argv.slice(2);
const pausas = args.includes("--pausas");
const specs = args.filter((a) => !a.startsWith("--"));
if (!id || (specs.length === 0 && !pausas)) {
  console.error("Uso: npm run cortar -- <id> <inicio-fim> [inicio-fim...]");
  process.exit(1);
}
const dir = path.join("public/reels", id);
const rawVideo = path.join(dir, "video-bruto.mp4");
const rawTranscript = path.join(dir, "transcript-bruto.json");
if (!fs.existsSync(rawVideo)) fs.copyFileSync(path.join(dir, "video.mp4"), rawVideo);
if (!fs.existsSync(rawTranscript)) fs.copyFileSync(path.join(dir, "transcript.json"), rawTranscript);

const transcript = JSON.parse(fs.readFileSync(rawTranscript, "utf8"));
const manual = specs.map((s) => s.split("-").map(Number));

// Silêncios do áudio (filtro tira o grave do ambiente; limiar pensado para gravação com ruído de fundo).
const silencios = () => {
  // O silencedetect escreve no stderr.
  const log = spawnSync("ffmpeg", ["-hide_banner", "-i", rawVideo, "-af", "highpass=f=120,silencedetect=noise=-24dB:d=0.3", "-f", "null", "-"])
    .stderr.toString();
  return [...log.matchAll(/silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/g)].map((m) => [
    Number(m[1]) - Number(m[2]),
    Number(m[1]),
  ]);
};
const dentroDeCorte = ([a, b]) => manual.some(([c, d]) => a < d && b > c);
const automaticos = pausas
  ? silencios()
      .filter((s) => !dentroDeCorte(s))
      .map(([a, b]) => [a + 0.08, b - 0.07])
      .filter(([a, b]) => b - a > 0.1)
  : [];
if (pausas) console.log(`${automaticos.length} pausas encurtadas`);
const cuts = [...manual, ...automaticos].sort((a, b) => a[0] - b[0]);

// Trechos que ficam.
const keep = [];
let t = 0;
for (const [a, b] of cuts) {
  if (a - t > 0.05) keep.push([t, a]);
  t = b;
}
// Sobra menor que 0,05s no fim (arredondamento) não vira trecho.
if (transcript.duration - t > 0.05) keep.push([t, transcript.duration]);

const FADE = 0.03; // evita estalo de áudio na emenda
const filters = keep.map(([a, b], i) => {
  const len = b - a;
  return (
    `[0:v]trim=${a}:${b},setpts=PTS-STARTPTS[v${i}];` +
    `[0:a]atrim=${a}:${b},asetpts=PTS-STARTPTS,afade=t=in:d=${FADE},afade=t=out:st=${Math.max(0, len - FADE)}:d=${FADE}[a${i}]`
  );
});
const concat = `${keep.map((_, i) => `[v${i}][a${i}]`).join("")}concat=n=${keep.length}:v=1:a=1[v][a]`;
execFileSync("ffmpeg", [
  "-y", "-loglevel", "error", "-i", rawVideo,
  "-filter_complex", `${filters.join(";")};${concat}`,
  "-map", "[v]", "-map", "[a]",
  "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30",
  "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
  path.join(dir, "video.mp4"),
], { stdio: "inherit" });

// Novo tempo de um instante do bruto. Se cair num corte, encaixa na borda
// (lado "inicio" = começo do próximo trecho; lado "fim" = fim do trecho anterior).
const remap = (x, lado = "inicio") => {
  let offset = 0;
  for (let i = 0; i < keep.length; i++) {
    const [a, b] = keep[i];
    if (x >= a && x <= b) return +(x - a + offset).toFixed(3);
    if (x < a) return lado === "inicio" ? +offset.toFixed(3) : +Math.max(0, offset - 0.001).toFixed(3);
    offset += b - a;
  }
  return +offset.toFixed(3);
};
const words = transcript.words
  .map((w) => ({ ...w, start: remap(w.start, "inicio"), end: remap(w.end, "fim") }))
  // Só some a palavra que estava inteira dentro de um corte.
  .filter((w) => w.end > w.start);
const duration = +keep.reduce((s, [a, b]) => s + b - a, 0).toFixed(3);
fs.writeFileSync(path.join(dir, "transcript.json"), JSON.stringify({ ...transcript, duration, words }, null, 1));

console.log(`Cortado: ${transcript.duration.toFixed(1)}s → ${duration.toFixed(1)}s (${transcript.words.length - words.length} palavras removidas)`);
console.log("Mapa de tempo (bruto → novo):");
for (const [a, b] of keep) console.log(`  ${a.toFixed(2)}–${b.toFixed(2)}  →  ${remap(a).toFixed(2)}–${remap(b).toFixed(2)}`);
