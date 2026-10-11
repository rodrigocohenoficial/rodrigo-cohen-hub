// Corta trechos do vídeo e ajusta os tempos da transcrição junto.
// Sempre parte do bruto (video-bruto.mp4 / transcript-bruto.json), então pode rodar de novo com outros cortes.
// Uso: npm run cortar -- <id> <inicio-fim> [inicio-fim...]   ex: npm run cortar -- reel-01 0-6.05 75.62-80.72
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [id, ...specs] = process.argv.slice(2);
if (!id || specs.length === 0) {
  console.error("Uso: npm run cortar -- <id> <inicio-fim> [inicio-fim...]");
  process.exit(1);
}
const dir = path.join("public/reels", id);
const rawVideo = path.join(dir, "video-bruto.mp4");
const rawTranscript = path.join(dir, "transcript-bruto.json");
if (!fs.existsSync(rawVideo)) fs.copyFileSync(path.join(dir, "video.mp4"), rawVideo);
if (!fs.existsSync(rawTranscript)) fs.copyFileSync(path.join(dir, "transcript.json"), rawTranscript);

const transcript = JSON.parse(fs.readFileSync(rawTranscript, "utf8"));
const cuts = specs.map((s) => s.split("-").map(Number)).sort((a, b) => a[0] - b[0]);

// Trechos que ficam.
const keep = [];
let t = 0;
for (const [a, b] of cuts) {
  if (a > t) keep.push([t, a]);
  t = b;
}
if (t < transcript.duration) keep.push([t, transcript.duration]);

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

// Novo tempo de um instante do bruto (ou null se caiu num corte).
const remap = (x) => {
  let offset = 0;
  for (const [a, b] of keep) {
    if (x >= a && x <= b) return +(x - a + offset).toFixed(3);
    offset += b - a;
  }
  return null;
};
const words = transcript.words
  .map((w) => ({ ...w, start: remap(w.start), end: remap(w.end) }))
  .filter((w) => w.start !== null && w.end !== null);
const duration = +keep.reduce((s, [a, b]) => s + b - a, 0).toFixed(3);
fs.writeFileSync(path.join(dir, "transcript.json"), JSON.stringify({ ...transcript, duration, words }, null, 1));

console.log(`Cortado: ${transcript.duration.toFixed(1)}s → ${duration.toFixed(1)}s (${transcript.words.length - words.length} palavras removidas)`);
console.log("Mapa de tempo (bruto → novo):");
for (const [a, b] of keep) console.log(`  ${a.toFixed(2)}–${b.toFixed(2)}  →  ${remap(a).toFixed(2)}–${remap(b).toFixed(2)}`);
