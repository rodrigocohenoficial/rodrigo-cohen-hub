import { put, get, list, del } from "@vercel/blob";

// "turma" = alunos da Trader 360; "publico" = diagnóstico aberto (leads).
const PASTAS = { turma: "respostas/", publico: "leads/" };
const pasta = (origem) => PASTAS[origem] || PASTAS.turma;

export async function salvar(registro) {
  await put(`${pasta(registro.origem)}${registro.id}.json`, JSON.stringify(registro), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function lerCaminho(caminho) {
  const r = await get(caminho, { access: "private", useCache: false });
  if (!r || r.statusCode !== 200) return null;
  return JSON.parse(await new Response(r.stream).text());
}

// Procura o id nas duas pastas.
export async function ler(id) {
  for (const p of Object.values(PASTAS)) {
    try {
      const r = await lerCaminho(`${p}${id}.json`);
      if (r) return r;
    } catch {
      /* tenta a próxima pasta */
    }
  }
  return null;
}

export async function apagar(id) {
  await del(Object.values(PASTAS).map((p) => `${p}${id}.json`));
}

// Guarda em memória o que já foi lido: a cada atualização do painel,
// só baixa respostas novas ou alteradas (nota mudou, por exemplo).
const lidos = new Map();

export async function lerTodos(origem) {
  const itens = [];
  let cursor;
  do {
    const pagina = await list({ prefix: pasta(origem), limit: 1000, cursor });
    itens.push(...pagina.blobs);
    cursor = pagina.hasMore ? pagina.cursor : undefined;
  } while (cursor);
  const registros = await Promise.all(
    itens.map(async (b) => {
      const versao = String(b.uploadedAt);
      const guardado = lidos.get(b.pathname);
      if (guardado && guardado.versao === versao) return guardado.dados;
      try {
        const dados = await lerCaminho(b.pathname);
        if (dados) lidos.set(b.pathname, { versao, dados });
        return dados;
      } catch {
        return null;
      }
    })
  );
  // Esquece o que foi apagado.
  const atuais = new Set(itens.map((b) => b.pathname));
  for (const k of lidos.keys()) if (k.startsWith(pasta(origem)) && !atuais.has(k)) lidos.delete(k);
  return registros.filter(Boolean);
}
