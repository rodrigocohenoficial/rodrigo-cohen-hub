import type { NextRequest } from "next/server";

// Grava o lead na planilha "Itera" (Google Sheets) via Apps Script.
// LEADS_WEBHOOK_URL e LEADS_WEBHOOK_TOKEN ficam nas variáveis de ambiente da Vercel.

function texto(valor: unknown, max: number) {
  if (typeof valor !== "string") return "";
  const limpo = valor.trim().slice(0, max);
  // Evita que a planilha interprete o texto como fórmula
  return /^[=+\-@]/.test(limpo) ? `'${limpo}` : limpo;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Campo invisível: só robô preenche
  if (texto(body.empresa, 100)) return Response.json({ ok: true });

  const nome = texto(body.nome, 120);
  const whatsapp =
    typeof body.whatsapp === "string" ? body.whatsapp.replace(/\D/g, "") : "";

  if (
    nome.length < 2 ||
    whatsapp.length < 10 ||
    whatsapp.length > 11 ||
    body.aceite !== true
  ) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const url = process.env.LEADS_WEBHOOK_URL;
  const token = process.env.LEADS_WEBHOOK_TOKEN;
  if (!url || !token) {
    console.error("[leads] LEADS_WEBHOOK_URL ou LEADS_WEBHOOK_TOKEN ausente");
    return Response.json({ ok: false }, { status: 503 });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        nome,
        whatsapp,
        email: "",
        origem: texto(body.origem, 100),
        campanha: texto(body.campanha, 100),
        conteudo: texto(body.conteudo, 100),
        aceite: true,
      }),
      signal: AbortSignal.timeout(8000),
    });
    const resposta = (await res.text()).trim();
    if (!res.ok || resposta !== "ok") {
      throw new Error(`status ${res.status}: ${resposta.slice(0, 80)}`);
    }
  } catch (err) {
    console.error("[leads] falha ao gravar na planilha", err);
    return Response.json({ ok: false }, { status: 502 });
  }

  return Response.json({ ok: true });
}
