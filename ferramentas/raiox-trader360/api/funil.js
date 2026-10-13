import { put, list } from "@vercel/blob";
import { chaveOk } from "./_chave.js";

// Etapas do diagnóstico público, na ordem.
const ETAPAS = ["visitou", "comecou", "numeros", "frases", "metade", "abertas", "contato", "enviou"];
const PASTA = "funil/publico/";

// Contagem guardada por 30 s para o painel não listar o armazenamento a cada atualização.
let cache = null;

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { sid, etapa } = req.body || {};
      if (!/^[a-z0-9-]{8,40}$/i.test(String(sid || "")) || !ETAPAS.includes(etapa)) {
        return res.status(400).json({ erro: "dados inválidos" });
      }
      // Um arquivo por visitante e etapa: repetir a etapa não conta duas vezes.
      await put(`${PASTA}${sid}/${ETAPAS.indexOf(etapa)}-${etapa}`, "1", {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "text/plain",
      });
      return res.status(200).json({ ok: true });
    }

    if (!chaveOk(req.query.k)) return res.status(401).json({ erro: "Chave inválida" });
    if (!cache || Date.now() - cache.em > 30000) {
      const contagem = Object.fromEntries(ETAPAS.map((e) => [e, 0]));
      let cursor;
      do {
        const pagina = await list({ prefix: PASTA, limit: 1000, cursor });
        pagina.blobs.forEach((b) => {
          const etapa = b.pathname.split("/").pop().replace(/^\d+-/, "");
          if (etapa in contagem) contagem[etapa] += 1;
        });
        cursor = pagina.hasMore ? pagina.cursor : undefined;
      } while (cursor);
      cache = { em: Date.now(), etapas: ETAPAS, contagem };
    }
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(cache);
  } catch (e) {
    console.error("funil falhou", e);
    return res.status(500).json({ erro: "Falha no funil" });
  }
}
