// Renderiza o Reel final em out/<id>.mp4 (1080x1920, 30 fps).
// Uso: npm run render -- <id-do-reel>
import { execFileSync } from "node:child_process";

const [id] = process.argv.slice(2);
if (!id) {
  console.error("Uso: npm run render -- <id-do-reel>");
  process.exit(1);
}
execFileSync("npx", ["remotion", "render", "src/index.ts", id, `out/${id}.mp4`, "--crf=18", "--log=error"], { stdio: "inherit" });
console.log(`Reel pronto: out/${id}.mp4`);
