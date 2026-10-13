import { ler } from "./_blob.js";

export default async function handler(req, res) {
  const id = String(req.query.id || "");
  if (!/^[0-9a-f-]{36}$/.test(id)) return res.status(400).json({ erro: "id inválido" });
  try {
    const r = await ler(id);
    if (!r) return res.status(404).json({ erro: "não encontrado" });
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      nome: r.nome, respostas: r.respostas, numeros: r.numeros, nota: r.nota ?? null,
      perfil: r.perfil, familia: r.familia, segredo: r.segredo, abertas: r.abertas,
    });
  } catch (e) {
    console.error("resultado falhou", e);
    return res.status(500).json({ erro: "Falha ao carregar" });
  }
}
