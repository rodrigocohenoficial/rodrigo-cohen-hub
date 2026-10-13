import { randomUUID } from "node:crypto";
import { salvar, ler } from "./_blob.js";

const ID_OK = /^[0-9a-f-]{36}$/;

function texto(v, max) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function limparObjeto(obj, max) {
  const out = {};
  if (!obj || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj).slice(0, 40)) {
    const chave = texto(k, 40);
    if (!chave) continue;
    if (Array.isArray(v)) out[chave] = v.slice(0, 10).map((x) => texto(x, 80));
    else if (typeof v === "number") out[chave] = v;
    else out[chave] = texto(v, max);
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido" });
  const b = req.body || {};

  try {
    // Atualização da nota "quanto faz sentido" de um resultado já enviado.
    if (b.id && b.nota !== undefined) {
      if (!ID_OK.test(b.id)) return res.status(400).json({ erro: "id inválido" });
      const nota = Number(b.nota);
      if (!Number.isInteger(nota) || nota < 1 || nota > 10) return res.status(400).json({ erro: "nota inválida" });
      const atual = await ler(b.id);
      if (!atual) return res.status(404).json({ erro: "não encontrado" });
      atual.nota = nota;
      atual.notaEm = new Date().toISOString();
      await salvar(atual);
      return res.status(200).json({ ok: true });
    }

    const nome = texto(b.nome, 80);
    const email = texto(b.email, 120);
    if (!nome || !email.includes("@")) return res.status(400).json({ erro: "Nome e e-mail são obrigatórios" });

    const respostas = {};
    for (const [k, v] of Object.entries(b.respostas || {})) {
      const n = Number(v);
      if (/^[a-z]\d$/.test(k) && n >= 1 && n <= 5) respostas[k] = n;
    }
    if (Object.keys(respostas).length < 25) return res.status(400).json({ erro: "Responda as 25 afirmações" });

    const registro = {
      id: randomUUID(),
      criadoEm: new Date().toISOString(),
      nome,
      email,
      whatsapp: texto(b.whatsapp, 30),
      perfil: limparObjeto(b.perfil, 80),
      numeros: limparObjeto(b.numeros, 20),
      abertas: limparObjeto(b.abertas, 2000),
      familia: texto(b.familia, 60),
      segredo: texto(b.segredo, 60),
      respostas,
      padrao: texto(b.padrao, 20),
      forca: texto(b.forca, 20),
    };
    await salvar(registro);
    return res.status(200).json({ ok: true, id: registro.id });
  } catch (e) {
    console.error("enviar falhou", e);
    return res.status(500).json({ erro: "Falha ao salvar. Tente de novo." });
  }
}
