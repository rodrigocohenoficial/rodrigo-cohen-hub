import fs from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setConcurrency(4);

// Na nuvem do Claude Code o Chromium já vem instalado. Na sua máquina o Remotion baixa sozinho.
const cloudChromium = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (fs.existsSync(cloudChromium)) {
  Config.setBrowserExecutable(cloudChromium);
}
