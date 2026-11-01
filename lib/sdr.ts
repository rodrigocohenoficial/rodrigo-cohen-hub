import Anthropic from "@anthropic-ai/sdk";

// SDR da Itera respondendo no direct do Instagram via ManyChat.
// O ManyChat chama /api/sdr a cada mensagem do lead e espera a resposta
// em até 10 segundos. O histórico da conversa vai e volta num campo do
// próprio ManyChat (base64), então este servidor não guarda estado.

export type Turno = { r: "u" | "a"; t: string };

export type SaidaSdr = {
  resposta1: string;
  resposta2: string;
  encerrar: "sim" | "nao";
  transbordo: "sim" | "nao";
  motivo: string;
  etapa: string;
  historico: string;
};

const MAX_TURNOS = 16;
const MAX_CHARS_HISTORICO = 3000;

// Regras do canal. Ficam no código; o roteiro de vendas fica na variável
// de ambiente SDR_PROMPT (o repositório é público).
const MODO_INSTAGRAM = `

## Modo Instagram (automático)

Agora você responde sozinho no direct do Instagram do Rodrigo Cohen, dentro do fluxo ITERA do ManyChat. Isto substitui o "modo copiloto", o "modo treino" e o formato MENSAGEM/FICHA das instruções acima.

- O lead escreveu ITERA e o ManyChat já mandou o link da Itera e o botão do WhatsApp da Elaine. Siga o fluxo RECEPTIVO.
- Você é o assistente virtual do time do Cohen. Na sua primeira resposta da conversa, diga isso em poucas palavras. Nunca diga que é o Rodrigo nem a Elaine. Se perguntarem se é robô ou IA, confirme.
- Jeito do Rodrigo, mensagens curtas. No Instagram não existe negrito: não use asterisco.
- Quando o link fizer sentido, mande https://iterainvestimentos.com.br/cohen escrito por extenso.
- TRANSBORDO: diga que vai passar a conversa pra Elaine, do time, no WhatsApp. O ManyChat manda o botão logo depois. Não escreva o link do WhatsApp.
- Conta aberta ou opt-out: responda curto e encerre.

Responda só no formato JSON pedido:
- mensagens: 1 ou 2 mensagens curtas, na ordem de envio.
- etapa: S, P, I, N, LINK_ENVIADO, CONTA_ABERTA, TRANSBORDO ou OPT_OUT.
- transbordo: true quando a Elaine precisa assumir.
- motivo: em uma linha, o que a Elaine precisa resolver (vazio se não houver transbordo).
- encerrar: true quando a conversa automática deve parar (transbordo, conta aberta ou opt-out).`;

const SCHEMA = {
  type: "object",
  properties: {
    mensagens: { type: "array", items: { type: "string" } },
    etapa: {
      type: "string",
      enum: ["S", "P", "I", "N", "LINK_ENVIADO", "CONTA_ABERTA", "TRANSBORDO", "OPT_OUT"],
    },
    transbordo: { type: "boolean" },
    motivo: { type: "string" },
    encerrar: { type: "boolean" },
  },
  required: ["mensagens", "etapa", "transbordo", "motivo", "encerrar"],
  additionalProperties: false,
};

export function lerHistorico(b64: unknown): Turno[] {
  if (typeof b64 !== "string" || !b64.trim()) return [];
  try {
    const dados = JSON.parse(Buffer.from(b64.trim(), "base64").toString("utf8"));
    if (!Array.isArray(dados)) return [];
    return dados.filter(
      (x): x is Turno =>
        x && (x.r === "u" || x.r === "a") && typeof x.t === "string",
    );
  } catch {
    return [];
  }
}

export function gravarHistorico(turnos: Turno[]): string {
  let recorte = turnos.slice(-MAX_TURNOS);
  while (
    recorte.length > 2 &&
    JSON.stringify(recorte).length > MAX_CHARS_HISTORICO
  ) {
    recorte = recorte.slice(2);
  }
  return Buffer.from(JSON.stringify(recorte), "utf8").toString("base64");
}

// A API exige alternância user/assistant começando por user.
export function montarMensagens(
  turnos: Turno[],
  nome: string,
): Anthropic.Beta.Messages.BetaMessageParam[] {
  const msgs: Anthropic.Beta.Messages.BetaMessageParam[] = [];
  for (const turno of turnos) {
    const role = turno.r === "u" ? "user" : "assistant";
    const ultima = msgs[msgs.length - 1];
    if (ultima && ultima.role === role) {
      ultima.content = `${ultima.content}\n${turno.t}`;
    } else {
      msgs.push({ role, content: turno.t });
    }
  }
  if (msgs[0]?.role === "assistant") msgs.unshift({ role: "user", content: "ITERA" });
  if (msgs.length && nome) {
    msgs[0] = {
      role: "user",
      content: `[nome do lead no Instagram: ${nome}]\n${msgs[0].content}`,
    };
  }
  return msgs;
}

export function saidaTransbordo(turnos: Turno[], motivo: string): SaidaSdr {
  const texto =
    "vou te passar pra Elaine, do time do Cohen\nela te responde no WhatsApp";
  return {
    resposta1: texto,
    resposta2: "",
    encerrar: "sim",
    transbordo: "sim",
    motivo,
    etapa: "TRANSBORDO",
    historico: gravarHistorico([...turnos, { r: "a", t: texto }]),
  };
}

export async function responder(
  client: Anthropic,
  promptBase: string,
  turnos: Turno[],
  nome: string,
): Promise<SaidaSdr> {
  const resposta = await client.beta.messages.create(
    {
      model: process.env.SDR_MODEL || "claude-opus-5-5",
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [
        {
          type: "text",
          text: promptBase + MODO_INSTAGRAM,
          cache_control: { type: "ephemeral", ttl: "1h" },
        },
      ],
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: SCHEMA },
      },
      messages: montarMensagens(turnos, nome),
    },
    { timeout: 8500, maxRetries: 0 },
  );

  if (resposta.stop_reason === "refusal") {
    return saidaTransbordo(turnos, "a IA recusou responder esta mensagem");
  }

  const texto = resposta.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");
  const dados = JSON.parse(texto) as {
    mensagens: string[];
    etapa: string;
    transbordo: boolean;
    motivo: string;
    encerrar: boolean;
  };

  const mensagens = dados.mensagens
    .map((m) => m.replace(/\*/g, "").trim())
    .filter(Boolean)
    .slice(0, 2);
  if (!mensagens.length) throw new Error("resposta vazia");

  return {
    resposta1: mensagens[0],
    resposta2: mensagens[1] ?? "",
    encerrar: dados.encerrar || dados.transbordo ? "sim" : "nao",
    transbordo: dados.transbordo ? "sim" : "nao",
    motivo: dados.motivo ?? "",
    etapa: dados.etapa,
    historico: gravarHistorico([
      ...turnos,
      { r: "a", t: mensagens.join("\n") },
    ]),
  };
}
