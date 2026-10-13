import { put, get, list } from "@vercel/blob";

const PASTA = "respostas/";

export async function salvar(registro) {
  await put(`${PASTA}${registro.id}.json`, JSON.stringify(registro), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function ler(id) {
  const r = await get(`${PASTA}${id}.json`, { access: "private", useCache: false });
  if (!r || r.statusCode !== 200) return null;
  return JSON.parse(await new Response(r.stream).text());
}

export async function lerTodos() {
  const itens = [];
  let cursor;
  do {
    const pagina = await list({ prefix: PASTA, limit: 1000, cursor });
    itens.push(...pagina.blobs);
    cursor = pagina.hasMore ? pagina.cursor : undefined;
  } while (cursor);
  const registros = await Promise.all(
    itens.map(async (b) => {
      try {
        const r = await get(b.pathname, { access: "private", useCache: false });
        if (!r || r.statusCode !== 200) return null;
        return JSON.parse(await new Response(r.stream).text());
      } catch {
        return null;
      }
    })
  );
  return registros.filter(Boolean);
}
