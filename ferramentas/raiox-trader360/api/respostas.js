import { timingSafeEqual } from "node:crypto";
import { lerTodos } from "./_blob.js";

function chaveOk(recebida) {
  const certa = process.env.PAINEL_KEY || "";
  const a = Buffer.from(String(recebida || ""));
  const b = Buffer.from(certa);
  return certa.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (!chaveOk(req.query.k)) return res.status(401).json({ erro: "Chave inválida" });
  try {
    const todos = await lerTodos();
    todos.sort((a, b) => (a.criadoEm < b.criadoEm ? -1 : 1));
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ total: todos.length, respostas: todos });
  } catch (e) {
    console.error("respostas falhou", e);
    return res.status(500).json({ erro: "Falha ao carregar" });
  }
}
