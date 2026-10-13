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
      try {
        return await lerCaminho(b.pathname);
      } catch {
        return null;
      }
    })
  );
  return registros.filter(Boolean);
}
