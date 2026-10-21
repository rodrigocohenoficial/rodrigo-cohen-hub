// Gera quadros de prévia em segundos específicos e junta numa folha só.
// Uso: npm run preview -- <id-do-reel> 2.5 7 12.3 ...
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const [id, ...times] = process.argv.slice(2);
if (!id || times.length === 0) {
  console.error("Uso: npm run preview -- <id-do-reel> <segundo> [segundo...]");
  process.exit(1);
}
fs.mkdirSync("out", { recursive: true });

const files = times.map((t) => {
  const file = `out/${id}-${t}s.png`;
  const frame = String(Math.round(Number(t) * 30));
  execFileSync("npx", ["remotion", "still", "src/index.ts", id, file, `--frame=${frame}`, "--log=error"], { stdio: "inherit" });
  return file;
});

const sheet = `out/${id}-preview.png`;
const inputs = files.flatMap((f) => ["-i", f]);
const filter = `${files.map((_, i) => `[${i}]`).join("")}hstack=${files.length},scale=${Math.min(files.length, 5) * 360}:-1`;
execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", files.length > 1 ? filter : "scale=360:-1", sheet]);
console.log(`Prévia: ${sheet}`);
