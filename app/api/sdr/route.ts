import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";
import {
  lerHistorico,
  responder,
  saidaEspera,
  saidaFollowupPadrao,
  saidaTransbordo,
} from "@/lib/sdr";

// Chamado pelo ManyChat (passo "External Request") a cada mensagem do lead
// no fluxo ITERA do Instagram. Variáveis na Vercel:
// ANTHROPIC_API_KEY, SDR_TOKEN, SDR_PROMPT e, opcionais, SDR_MODEL e SDR_NOME.

export const maxDuration = 15;

// Se o texto do lead vier com aspas sem escapar, o JSON quebra. Por isso o
// corpo configurado no ManyChat deixa "mensagem" por último: dá pra salvar
// tudo que estiver entre "mensagem":" e o "} final.
function lerCorpo(bruto: string): Record<string, unknown> | null {
  try {
    return JSON.parse(bruto);
  } catch {
    const historico = bruto.match(/"historico"\s*:\s*"([A-Za-z0-9+/=]*)"/)?.[1];
    const nome = bruto.match(/"nome"\s*:\s*"([^"]*)"/)?.[1];
    const mensagem = bruto.match(/"mensagem"\s*:\s*"([\s\S]*)"\s*}\s*$/)?.[1];
    if (mensagem === undefined) return null;
    const followup = bruto.match(/"followup"\s*:\s*"([^"]*)"/)?.[1];
    return { mensagem: mensagem.replace(/\\n/g, "\n"), historico, nome, followup };
  }
}

export async function POST(request: NextRequest) {
  const token = process.env.SDR_TOKEN;
  if (!token || request.headers.get("authorization") !== `Bearer ${token}`) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const promptBase = process.env.SDR_PROMPT;
  if (!promptBase || !process.env.ANTHROPIC_API_KEY) {
    console.error("[sdr] SDR_PROMPT ou ANTHROPIC_API_KEY ausente");
    return Response.json(saidaTransbordo([], "SDR sem configuração"));
  }

  const corpo = lerCorpo(await request.text());
  if (!corpo) return Response.json({ ok: false }, { status: 400 });

  const mensagem =
    typeof corpo.mensagem === "string" ? corpo.mensagem.trim().slice(0, 2000) : "";
  const nome =
    typeof corpo.nome === "string" ? corpo.nome.trim().slice(0, 60) : "";
  // "followup" (ex.: "3 horas") pede um lembrete para o lead que sumiu.
  const followup =
    typeof corpo.followup === "string" ? corpo.followup.trim().slice(0, 40) : "";
  const turnos = lerHistorico(corpo.historico);
  // Histórico terminando em mensagem do lead = a última tentativa falhou.
  const jaFalhou = turnos.at(-1)?.r === "u";
  const ultima = turnos.at(-1);
  const repetida = ultima?.r === "u" && ultima.t === mensagem;
  if (mensagem && !followup && !repetida) turnos.push({ r: "u", t: mensagem });
  if (!turnos.length) turnos.push({ r: "u", t: "ITERA" });

  try {
    const saida = await responder(new Anthropic(), promptBase, turnos, nome, followup);
    console.log("[sdr]", saida.etapa, saida.transbordo === "sim" ? saida.motivo : "");
    return Response.json(saida);
  } catch (err) {
    console.error("[sdr] falha", jaFalhou ? "(2a vez)" : "", err);
    if (followup) return Response.json(saidaFollowupPadrao(turnos));
    if (jaFalhou) {
      return Response.json(saidaTransbordo(turnos, "o SDR não respondeu a tempo"));
    }
    return Response.json(saidaEspera(turnos));
  }
}
