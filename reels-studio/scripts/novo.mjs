// Prepara uma gravação nova: vídeo normalizado, transcrição palavra a palavra e quadros para leitura.
// Uso: npm run novo -- <id-do-reel> <arquivo-de-video>
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [id, input] = process.argv.slice(2);
if (!id || !input || !/^[a-z0-9-]+$/.test(id)) {
  console.error("Uso: npm run novo -- <id-em-minusculas-com-hifen> <arquivo-de-video>");
  process.exit(1);
}
if (!fs.existsSync(input)) {
  console.error(`Arquivo não encontrado: ${input}`);
  process.exit(1);
}

const pub = path.join("public/reels", id);
const work = path.join("work", id);
fs.mkdirSync(pub, { recursive: true });
fs.mkdirSync(path.join(work, "frames"), { recursive: true });

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "inherit", "inherit"] });
const ff = (...args) => run("ffmpeg", ["-y", "-loglevel", "error", ...args]);

console.log("1/4 Normalizando o vídeo (H.264, 30 fps)...");
const video = path.join(pub, "video.mp4");
ff("-i", input, "-vf", "scale='min(1080,iw)':-2", "-r", "30", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
  "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", video);

const duration = Number(
  execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video]).toString().trim(),
);

console.log("2/4 Extraindo o áudio...");
const audio = path.join(work, "audio.wav");
ff("-i", video, "-vn", "-ac", "1", "-ar", "16000", audio);

console.log("3/4 Transcrevendo palavra por palavra (Whisper)...");
run("python3", ["scripts/transcribe.py", audio, path.join(pub, "transcript.json"), path.join(work, "transcript.txt"), String(duration)]);

console.log("4/4 Tirando quadros a cada 2s...");
for (let t = 0; t < duration; t += 2) {
  const name = `t${String(t).padStart(3, "0")}s.jpg`;
  ff("-ss", String(t), "-i", video, "-frames:v", "1", "-vf", "scale=360:-2", path.join(work, "frames", name));
}

console.log(`
Pronto: ${id} (${duration.toFixed(1)}s)
  Transcrição: ${path.join(work, "transcript.txt")}
  Quadros:     ${path.join(work, "frames")}/
Próximo passo: plano de cenas em src/reels/${id}/plano.md para aprovação.`);
