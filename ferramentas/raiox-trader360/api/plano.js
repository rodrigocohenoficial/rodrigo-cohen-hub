import { randomUUID } from "node:crypto";
import { salvar, ler, lerTodos } from "./_blob.js";
import { chaveOk } from "./_chave.js";

const ID_OK = /^[0-9a-f-]{36}$/;
const texto = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const numero = (v) => (typeof v === "number" && isFinite(v) ? v : 0);

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      if (!chaveOk(req.query.k)) return res.status(401).json({ erro: "Chave inválida" });
      const planos = await lerTodos("planos");
      planos.sort((a, b) => (a.nome < b.nome ? -1 : 1));
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ total: planos.length, planos });
    }
    if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido" });

    const b = req.body || {};
    // Campo invisível: só robô preenche.
    if (b.site) return res.status(200).json({ ok: true, id: randomUUID() });

    const nome = texto(b.nome, 80);
    if (!nome) return res.status(400).json({ erro: "Nome obrigatório" });
    const p = b.plano || {};

    // Reenviar o mesmo plano atualiza o registro em vez de criar outro.
    let id = randomUUID();
    let criadoEm = new Date().toISOString();
    if (b.id && ID_OK.test(b.id)) {
      const atual = await ler(b.id);
      if (atual && atual.origem === "planos") { id = atual.id; criadoEm = atual.criadoEm; }
    }

    const registro = {
      id,
      origem: "planos",
      criadoEm,
      atualizadoEm: new Date().toISOString(),
      nome,
      plano: {
        capital: numero(p.capital), riscoPct: numero(p.riscoPct), stopPts: numero(p.stopPts), contratos: numero(p.contratos),
        limiteStops: numero(p.limiteStops), metaR: numero(p.metaR), acerto: numero(p.acerto), payoff: numero(p.payoff),
        opsDia: numero(p.opsDia), eR: numero(p.eR),
        inicio: texto(p.inicio, 10), fim: texto(p.fim, 10), tempo: texto(p.tempo, 20),
        setups: Array.isArray(p.setups) ? p.setups.slice(0, 6).map((x) => texto(x, 40)) : [],
        rotina: !!p.rotina, padrao: texto(p.padrao, 20), regra: texto(p.regra, 400), quem: texto(p.quem, 80),
      },
    };
    await salvar(registro);
    return res.status(200).json({ ok: true, id });
  } catch (e) {
    console.error("plano falhou", e);
    return res.status(500).json({ erro: "Falha ao salvar. Tente de novo." });
  }
}
