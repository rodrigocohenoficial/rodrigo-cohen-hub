import { timingSafeEqual } from "node:crypto";

// Confere a chave do painel (PAINEL_KEY) sem vazar tempo de comparação.
export function chaveOk(recebida) {
  const certa = process.env.PAINEL_KEY || "";
  const a = Buffer.from(String(recebida || ""));
  const b = Buffer.from(certa);
  return certa.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}
