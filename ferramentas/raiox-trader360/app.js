(function () {
  const R = window.RAIOX;
  const PUB = R.publico;
  // A mesma página serve a turma (/) e o diagnóstico público (/diagnostico).
  const PUBLICO = location.pathname.replace(/\/+$/, "") === PUB.caminho;
  const BASE = PUBLICO ? PUB.caminho : "/";
  const linkResultado = (id) => (PUBLICO ? `${PUB.caminho}?r=${id}` : `/?r=${id}`);
  const CHAVE = "raiox-t360-t5-v2" + (PUBLICO ? "-pub" : "");
  const app = document.getElementById("app");
  // Listas da versão em uso (a pública é mais curta).
  const AFIRM = PUBLICO ? R.afirmacoes.filter((a) => PUB.afirmacoes.includes(a.id)) : R.afirmacoes;
  const PERFIL = PUBLICO ? R.perfil.filter((g) => PUB.perfil.includes(g.k)) : R.perfil;
  const NUMEROS = PUBLICO ? R.numeros.filter((n) => PUB.numeros.includes(n.k)) : R.numeros;
  const ABERTAS = PUBLICO
    ? PUB.abertas.map((x) => ({ ...R.abertas.find((q) => q.k === x.k), obrig: x.obrig, ...(x.k === "noventa" ? { q: PUB.abertaNoventa } : {}) }))
    : R.abertas;
  // Ordem das etapas: na pública, o contato vem no fim.
  const ORDEM = PUBLICO ? ["perfil", "numeros", "intro", "abertas", "id"] : ["id", "perfil", "numeros", "intro", "abertas"];
  const passo = (etapa) => `Passo ${ORDEM.indexOf(etapa) + 1} de ${ORDEM.length}`;
  const proxima = (etapa) => ORDEM[ORDEM.indexOf(etapa) + 1];
  const anterior = (etapa) => ORDEM[ORDEM.indexOf(etapa) - 1] || "capa";
  document.getElementById("turma").textContent = PUBLICO ? PUB.turma : R.turma;
  if (PUBLICO) {
    const rod = document.querySelector(".rodape");
    if (rod) rod.innerHTML = "Ferramenta de autorreflexão da Trader Nation. Não é teste psicológico nem diagnóstico clínico, nem recomendação de investimento.<br>Seus dados ficam com o Rodrigo Cohen e a equipe da Trader Nation.";
  }

  const vazio = () => ({
    etapa: "capa", i: 0, nome: "", email: "", whatsapp: "",
    perfil: {}, numeros: {}, naoSei: false, respostas: {}, abertas: {}, familia: "", segredo: "",
    resultadoId: null, nota: null, aceite: false,
  });

  let s = vazio();
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (salvo && typeof salvo === "object") s = Object.assign(vazio(), salvo);
  } catch (e) { /* sem armazenamento: segue do zero */ }

  function guardar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(s)); } catch (e) { /* ignora */ }
  }

  function esc(t) {
    return String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const md = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const primeiroNome = (n) => String(n || "").trim().split(/\s+/)[0] || "";

  // Funil do diagnóstico público: registra cada etapa uma vez por visitante.
  let sid = "";
  try {
    sid = localStorage.getItem("raiox-sid") || "";
    if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("raiox-sid", sid); }
  } catch (e) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); }
  const jaMarcadas = new Set();
  function marcar(etapa) {
    if (!PUBLICO || jaMarcadas.has(etapa)) return;
    jaMarcadas.add(etapa);
    try {
      fetch("/api/funil", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sid, etapa }), keepalive: true }).catch(() => {});
    } catch (e) { /* o funil nunca atrapalha o aluno */ }
  }
  const etapaFunil = { perfil: "comecou", numeros: "numeros", abertas: "abertas", id: "contato" };

  function ir(etapa, extra) {
    s.etapa = etapa;
    Object.assign(s, extra || {});
    if (etapaFunil[etapa]) marcar(etapaFunil[etapa]);
    if (etapa === "afirm") {
      marcar("frases");
      if (s.i >= Math.floor(AFIRM.length / 2)) marcar("metade");
    }
    guardar();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function tela(html) {
    app.innerHTML = `<div class="fade">${html}</div>`;
  }

  // ---------- Telas ----------

  function capa() {
    const emAndamento = !!s.etapaSalva && !["capa", "resultado"].includes(s.etapaSalva);
    let botoes = `<button class="btn" data-acao="comecar">Começar meu Raio-X</button>`;
    if (s.resultadoId) {
      botoes = `<button class="btn" data-acao="ver">Ver meu resultado</button>
        <button class="link" data-acao="recomecar">Responder de novo</button>`;
    } else if (emAndamento) {
      botoes = `<button class="btn" data-acao="continuar">Continuar de onde parei</button>
        <button class="link" data-acao="recomecar">Recomeçar do zero</button>`;
    }
    tela(`
      <div class="rotulo">${PUBLICO ? "Diagnóstico gratuito · Trader 360" : `Aula inaugural · ${esc(R.turma)}`}</div>
      <h1>RAIO-X <span class="ouro">DO TRADER</span></h1>
      <p class="sub">Descubra o padrão que mais pesa no seu trade hoje e o primeiro passo para mudar isso.</p>
      <div class="pilulas">
        <span class="pilula">${AFIRM.length} afirmações</span>
        <span class="pilula">${PUBLICO ? "4 minutos" : "8 minutos"}</span>
        <span class="pilula">Resultado na hora</span>
      </div>
      <div class="card">
        <p>Responda pensando no que você <strong>fez de verdade nos últimos 90 dias</strong>. Não no que você sabe que deveria fazer.</p>
        <p style="margin:0;color:var(--muted)">Não existe resposta certa. Quanto mais honesto, mais útil o resultado.</p>
      </div>
      <div class="acoes">${botoes}</div>
    `);
    app.querySelector('[data-acao="comecar"]')?.addEventListener("click", () => ir(ORDEM[0]));
    app.querySelector('[data-acao="continuar"]')?.addEventListener("click", () => ir(s.etapaSalva));
    app.querySelector('[data-acao="ver"]')?.addEventListener("click", () => ir("resultado"));
    app.querySelector('[data-acao="recomecar"]')?.addEventListener("click", () => {
      s = vazio();
      guardar();
      history.replaceState(null, "", BASE);
      ir(ORDEM[0]);
    });
  }

  function identificacao() {
    tela(`
      <div class="rotulo">${passo("id")}</div>
      <h2>${PUBLICO ? "Pra onde mando o seu resultado?" : "Quem é você?"}</h2>
      <div class="campo"><label for="nome">Nome completo</label><input id="nome" autocomplete="name" value="${esc(s.nome)}"></div>
      <div class="campo"><label for="email">E-mail</label><input id="email" type="email" autocomplete="email" inputmode="email" value="${esc(s.email)}"></div>
      <div class="campo"><label for="whats">WhatsApp ${PUBLICO ? "" : '<span class="dica">(opcional)</span>'}</label><input id="whats" type="tel" autocomplete="tel" inputmode="tel" placeholder="(11) 99999-9999" value="${esc(s.whatsapp)}"></div>
      <input id="site" name="site" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
      ${PUBLICO ? `<label class="check"><input type="checkbox" id="aceite" ${s.aceite ? "checked" : ""}> Aceito receber meu resultado e o contato da equipe Trader Nation sobre a Mentoria Trader 360.</label>` : ""}
      <div class="erro" id="erro"></div>
      <div class="acoes"><button class="btn" id="seguir">${PUBLICO ? "Ver meu Raio-X" : "Continuar"}</button>${PUBLICO ? '<button class="link" id="voltar">Voltar</button>' : ""}</div>
    `);
    app.querySelector("#voltar")?.addEventListener("click", () => ir(anterior("id")));
    app.querySelector("#seguir").addEventListener("click", () => {
      const nome = app.querySelector("#nome").value.trim();
      const email = app.querySelector("#email").value.trim();
      const whatsapp = app.querySelector("#whats").value.trim();
      if (nome.length < 2) return (app.querySelector("#erro").textContent = "Coloque seu nome.");
      if (!/^\S+@\S+\.\S+$/.test(email)) return (app.querySelector("#erro").textContent = "Confira seu e-mail.");
      s.site = app.querySelector("#site").value;
      if (PUBLICO) {
        if (whatsapp.replace(/\D/g, "").length < 10) return (app.querySelector("#erro").textContent = "Coloque seu WhatsApp com DDD.");
        if (!app.querySelector("#aceite").checked) return (app.querySelector("#erro").textContent = "Marque o aceite para receber seu resultado.");
      }
      Object.assign(s, { nome, email, whatsapp, aceite: PUBLICO });
      if (PUBLICO) return enviar();
      ir(proxima("id"));
    });
  }

  function perfil() {
    const grupos = PERFIL.map((g) => {
      const atual = s.perfil[g.k];
      const opcoes = g.o.map((o) => {
        const on = g.multi ? Array.isArray(atual) && atual.includes(o) : atual === o;
        return `<button class="opcao${on ? " on" : ""}" data-k="${g.k}" data-o="${esc(o)}">${esc(o)}</button>`;
      }).join("");
      return `<div class="grupo"><div class="q">${esc(g.q)}</div><div class="opcoes">${opcoes}</div></div>`;
    }).join("");
    tela(`
      <div class="rotulo">${passo("perfil")}</div>
      <h2>Onde você está hoje</h2>
      ${grupos}
      <div class="erro" id="erro"></div>
      <div class="acoes"><button class="btn" id="seguir">Continuar</button><button class="link" id="voltar">Voltar</button></div>
    `);
    app.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
      const g = PERFIL.find((x) => x.k === b.dataset.k);
      const o = b.dataset.o;
      if (g.multi) {
        const lista = Array.isArray(s.perfil[g.k]) ? s.perfil[g.k] : [];
        s.perfil[g.k] = lista.includes(o) ? lista.filter((x) => x !== o) : [...lista, o];
        b.classList.toggle("on");
      } else {
        s.perfil[g.k] = o;
        b.parentElement.querySelectorAll(".opcao").forEach((x) => x.classList.toggle("on", x === b));
      }
      guardar();
    }));
    app.querySelector("#voltar").addEventListener("click", () => ir(anterior("perfil")));
    app.querySelector("#seguir").addEventListener("click", () => {
      const falta = PERFIL.find((g) => g.multi ? !(s.perfil[g.k] || []).length : !s.perfil[g.k]);
      if (falta) return (app.querySelector("#erro").textContent = `Falta responder: ${falta.q}`);
      ir(proxima("perfil"));
    });
  }

  function numeros() {
    const campos = NUMEROS.map((n) => `
      <div class="campo">
        <label for="n-${n.k}">${esc(n.q)}</label>
        <div class="prefixo">${n.pre ? `<span>${esc(n.pre)}</span>` : ""}
          <input id="n-${n.k}" data-k="${n.k}" inputmode="decimal" placeholder="${esc(n.ph)}" value="${esc(s.numeros[n.k] || "")}" ${s.naoSei ? "disabled" : ""}>
          ${n.suf ? `<span>${esc(n.suf)}</span>` : ""}</div>
      </div>`).join("");
    tela(`
      <div class="rotulo">${passo("numeros")}</div>
      <h2>Seu marco zero</h2>
      <p class="sub">Estes números são a sua foto de hoje. ${PUBLICO ? "Daqui a 90 dias, compare." : "No fim da mentoria, a gente compara."} Deixe em branco o que você não souber.</p>
      ${campos}
      <label class="check"><input type="checkbox" id="naosei" ${s.naoSei ? "checked" : ""}> Não sei nenhum dos meus números</label>
      <div class="acoes"><button class="btn" id="seguir">Continuar</button>${PUBLICO ? '<button class="btn sec" id="pular">Pular esta etapa</button>' : ""}<button class="link" id="voltar">Voltar</button></div>
    `);
    const ler = () => {
      app.querySelectorAll("[data-k]").forEach((i) => { s.numeros[i.dataset.k] = i.value.trim(); });
      guardar();
    };
    app.querySelectorAll("[data-k]").forEach((i) => i.addEventListener("input", ler));
    app.querySelector("#naosei").addEventListener("change", (e) => {
      s.naoSei = e.target.checked;
      if (s.naoSei) s.numeros = {};
      guardar();
      numeros();
    });
    app.querySelector("#voltar").addEventListener("click", () => { ler(); ir(anterior("numeros")); });
    app.querySelector("#seguir").addEventListener("click", () => { ler(); ir(proxima("numeros")); });
    app.querySelector("#pular")?.addEventListener("click", () => { ler(); ir(proxima("numeros")); });
  }

  function intro() {
    tela(`
      <div class="rotulo">${passo("intro")}</div>
      <h2>Agora, a parte que importa</h2>
      <div class="card">
        <p>Você vai ver <strong>${AFIRM.length} frases</strong>. Para cada uma, marque com que frequência isso aconteceu com você <strong>nos últimos 90 dias</strong>.</p>
        <p>Se você ainda opera só no simulador, responda pensando no simulador.</p>
        <p>Algumas frases vão incomodar. É de propósito.</p>
        <p style="margin:0;color:var(--muted)">Responda rápido. A primeira resposta costuma ser a mais honesta.</p>
      </div>
      <div class="acoes"><button class="btn" id="seguir">Vamos lá</button><button class="link" id="voltar">Voltar</button></div>
    `);
    app.querySelector("#voltar").addEventListener("click", () => ir(anterior("intro")));
    app.querySelector("#seguir").addEventListener("click", () => {
      const primeiraVazia = AFIRM.findIndex((a) => !s.respostas[a.id]);
      ir("afirm", { i: primeiraVazia === -1 ? 0 : primeiraVazia });
    });
  }

  let travaClique = false;
  function afirmacao() {
    const total = AFIRM.length;
    const i = Math.min(Math.max(s.i, 0), total - 1);
    const a = AFIRM[i];
    const atual = s.respostas[a.id];
    tela(`
      <div class="progresso"><i style="width:${(i / total) * 100}%"></i></div>
      <div class="contador">${i + 1} de ${total} · Nos últimos 90 dias…</div>
      <div class="afirmacao">${esc(a.t)}</div>
      <div class="escala">
        ${R.escala.map((e) => `<button class="opcao${atual === e.v ? " on" : ""}" data-v="${e.v}">${esc(e.rotulo)}</button>`).join("")}
      </div>
      <div class="acoes"><button class="link" id="voltar">Voltar</button></div>
    `);
    travaClique = false;
    app.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => responder(Number(b.dataset.v))));
    app.querySelector("#voltar").addEventListener("click", () => {
      if (i === 0) ir("intro");
      else ir("afirm", { i: i - 1 });
    });
  }

  function responder(v) {
    if (travaClique || s.etapa !== "afirm") return;
    travaClique = true;
    const a = AFIRM[s.i];
    s.respostas[a.id] = v;
    guardar();
    app.querySelectorAll("[data-v]").forEach((b) => b.classList.toggle("on", Number(b.dataset.v) === v));
    setTimeout(() => {
      const seguinte = AFIRM.findIndex((x, idx) => idx > s.i && !s.respostas[x.id]);
      const vazia = AFIRM.findIndex((x) => !s.respostas[x.id]);
      if (s.i < AFIRM.length - 1 && seguinte !== -1) ir("afirm", { i: seguinte });
      else if (vazia !== -1) ir("afirm", { i: vazia });
      else ir("abertas");
    }, 220);
  }

  document.addEventListener("keydown", (e) => {
    if (s.etapa === "afirm" && /^[1-5]$/.test(e.key)) responder(Number(e.key));
  });

  function abertas() {
    const campos = ABERTAS.map((q) => `
      <div class="campo"><label for="a-${q.k}">${esc(q.q)} ${q.obrig ? "" : '<span class="dica">(opcional)</span>'}</label>
      <textarea id="a-${q.k}" data-k="${q.k}">${esc(s.abertas[q.k] || "")}</textarea></div>`).join("");
    const fam = R.familia.o.map((o) => `<button class="opcao${s.familia === o ? " on" : ""}" data-f="${esc(o)}">${esc(o)}</button>`).join("");
    const seg = R.segredo.o.map((o) => `<button class="opcao${s.segredo === o ? " on" : ""}" data-s="${esc(o)}">${esc(o)}</button>`).join("");
    tela(`
      <div class="rotulo">${passo("abertas")}</div>
      <h2>Suas palavras</h2>
      <p class="sub">${PUBLICO ? "Ninguém além do Cohen e da equipe lê isto." : "O Cohen vai ler cada resposta antes da primeira aula."} Escreva o que vier primeiro. Uma frase já basta.</p>
      ${campos}
      <div class="grupo"><div class="q">${esc(R.familia.q)}</div><div class="opcoes">${fam}</div></div>
      <div class="grupo"><div class="q">${esc(R.segredo.q)}</div><div class="opcoes">${seg}</div></div>
      <div class="erro" id="erro"></div>
      <div class="acoes"><button class="btn" id="seguir">${PUBLICO ? "Continuar" : "Ver meu Raio-X"}</button><button class="link" id="voltar">Voltar</button></div>
    `);
    const ler = () => {
      app.querySelectorAll("textarea[data-k]").forEach((t) => { s.abertas[t.dataset.k] = t.value.trim(); });
      guardar();
    };
    app.querySelectorAll("textarea").forEach((t) => t.addEventListener("input", ler));
    app.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => {
      s.familia = b.dataset.f;
      app.querySelectorAll("[data-f]").forEach((x) => x.classList.toggle("on", x === b));
      guardar();
    }));
    app.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => {
      s.segredo = b.dataset.s;
      app.querySelectorAll("[data-s]").forEach((x) => x.classList.toggle("on", x === b));
      guardar();
    }));
    app.querySelector("#voltar").addEventListener("click", () => { ler(); ir("afirm", { i: AFIRM.length - 1 }); });
    app.querySelector("#seguir").addEventListener("click", () => {
      ler();
      const falta = ABERTAS.find((q) => q.obrig && (s.abertas[q.k] || "").length < 3);
      if (falta) return (app.querySelector("#erro").textContent = `Responda: ${falta.q}`);
      if (!s.familia) return (app.querySelector("#erro").textContent = "Responda a pergunta sobre a sua família.");
      if (!s.segredo) return (app.querySelector("#erro").textContent = "Responda se você já escondeu uma perda.");
      if (proxima("abertas")) return ir(proxima("abertas"));
      enviar();
    });
  }

  async function enviar() {
    ir("enviando");
    const calc = window.calcularRaiox(s.respostas);
    const inicio = Date.now();
    try {
      const r = await fetch("/api/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: s.nome, email: s.email, whatsapp: s.whatsapp,
          perfil: s.perfil, numeros: s.naoSei ? { naoSei: "sim" } : s.numeros,
          abertas: s.abertas, familia: s.familia, segredo: s.segredo, respostas: s.respostas,
          padrao: calc.padrao, forca: calc.forca,
          origem: PUBLICO ? "publico" : "turma", site: s.site || "",
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.id) throw new Error(d.erro || "Falha ao enviar");
      // Deixa a tela de cálculo aparecer por um instante.
      await new Promise((ok) => setTimeout(ok, Math.max(0, 1800 - (Date.now() - inicio))));
      s.resultadoId = d.id;
      marcar("enviou");
      history.replaceState(null, "", linkResultado(d.id));
      ir("resultado");
    } catch (e) {
      tela(`
        <h2>Não consegui enviar</h2>
        <p class="sub">${esc(e.message)}. Suas respostas estão guardadas neste aparelho.</p>
        <div class="acoes"><button class="btn" id="tentar">Tentar de novo</button><button class="link" id="voltar">Voltar</button></div>
      `);
      app.querySelector("#tentar").addEventListener("click", enviar);
      app.querySelector("#voltar").addEventListener("click", () => ir("abertas"));
    }
  }

  function enviando() {
    tela(`<div class="carregando"><div class="pulso"></div>Calculando seu Raio-X…</div>`);
  }

  // ---------- Resultado ----------

  function resultado(dados) {
    const d = dados || {
      nome: s.nome, respostas: s.respostas, numeros: s.naoSei ? { naoSei: "sim" } : s.numeros, nota: s.nota,
      perfil: s.perfil, familia: s.familia, segredo: s.segredo, abertas: s.abertas,
    };
    const resp = d.respostas || {};
    const perfil = d.perfil || {};
    const ab = d.abertas || {};
    const nums = d.numeros || {};
    const calc = window.calcularRaiox(resp);
    const P = R.padroes[calc.padrao];
    const S2 = R.padroes[calc.segundo];
    const F = R.padroes[calc.forca].forca;
    const cegos = window.pontosCegos(d);
    const nivelTxt = { leve: "leve", moderado: "moderada", forte: "forte" };
    const audioP = R.audios.padrao[calc.padrao];
    const audioF = R.audios.forca[calc.forca];
    const rotuloEscala = (v) => (R.escala.find((e) => e.v === Number(v)) || {}).rotulo || "";
    const p1 = primeiroNome(d.nome);
    const nome = p1 ? p1.charAt(0).toUpperCase() + p1.slice(1).toLowerCase() : "";
    const numero = (k) => {
      const v = parseFloat(String(nums[k] || "").replace(/[^\d,.-]/g, "").replace(",", "."));
      return Number.isFinite(v) ? v : null;
    };
    const fmt = (v, casas = 0) => v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

    // As frases do padrão que a pessoa marcou mais alto definem por onde começar.
    const doPadrao = R.afirmacoes
      .filter((a) => a.p === calc.padrao)
      .map((a) => ({ ...a, v: Number(resp[a.id]) || 0 }))
      .sort((x, y) => y.v - x.v);
    const marcadas = doPadrao.filter((a) => a.v >= 3).slice(0, 2);
    const area = R.areas.find((x) => x.k === doPadrao[0].a);
    const foco = P.impactos[area.k];

    // Intensidade e segundo padrão.
    const empate = calc.pct[calc.padrao] - calc.pct[calc.segundo] <= 5;
    let leituraIntensidade;
    if (calc.nivel[calc.padrao] === "leve") {
      leituraIntensidade = `Nenhum padrão aparece forte em você. ${esc(P.nome)} é o que mais aparece, mas ainda em nível leve.`;
    } else if (empate) {
      leituraIntensidade = `Empatado com ele, quase no mesmo nível, está <strong>${esc(S2.nome)}</strong> (${calc.pct[calc.segundo]}%). Leia os dois.`;
    } else {
      leituraIntensidade = `Logo atrás vem <strong>${esc(S2.nome)}</strong>, com ${calc.pct[calc.segundo]}%.`;
    }

    const comoAparece = marcadas.length
      ? `<p>Nas suas respostas, ele aparece assim: você marcou ${marcadas.map((a) => `<strong>${esc(rotuloEscala(a.v).toLowerCase())}</strong> em “${esc(a.t)}”`).join(" e ")}</p>`
      : "";
    const descricao = P.bullets.map((b) => b.replace(/\*\*/g, "")).join(" ");

    const palavras = [];
    if (ab.regra) palavras.push(`A regra que você mesmo disse que continua quebrando: <strong>“${esc(ab.regra)}”</strong>.`);
    if (ab.mentira) palavras.push(`E o que você diz para si depois de um loss: <strong>“${esc(ab.mentira)}”</strong>.`);
    const blocoPalavras = palavras.length
      ? `<div class="palavras"><div class="rotulo">Nas suas palavras</div><p>${palavras.join(" ")}</p><p style="margin:0">Você já conhece a regra. O trabalho agora é cumprir no dia ruim.</p></div>`
      : "";

    let fora = "";
    const famFrase = { "Não sabe": "sua família não sabe como está o seu resultado", "Sabe uma parte": "sua família sabe só uma parte do seu resultado" }[d.familia];
    const escondeu = ["Já escondi", "Escondo hoje"].includes(d.segredo);
    if ((famFrase || escondeu) && area.k !== "casa") {
      const motivo = [famFrase, escondeu ? "já escondeu uma perda de alguém da sua casa" : ""].filter(Boolean).join(" e que ");
      fora = `<p class="fora"><strong>Fora da tela:</strong> você disse que ${motivo}. ${esc(P.impactos.casa.d[0])}</p>`;
    }

    // Sua matemática: esperança, ponto de empate, peso da maior perda.
    const mat = [];
    const acerto = numero("acerto");
    const payoff = numero("payoff");
    if (acerto !== null && payoff !== null && acerto > 0 && acerto <= 100 && payoff > 0) {
      const p = acerto / 100;
      const e = p * payoff - (1 - p);
      const por100 = Math.round(Math.abs(e) * 100);
      const empata = Math.round(100 / (1 + payoff));
      if (e > 0) {
        mat.push(`Com ${fmt(acerto)}% de acerto e payoff de ${esc(String(nums.payoff))}, cada R$ 100 que você arrisca devolvem em média <strong>R$ ${fmt(por100)} de lucro</strong>. Se o seu extrato não mostra isso, a diferença está na execução.`);
        if (e > 1) mat.push("Esses números estão entre os melhores que existem. Confira se eles vêm do seu diário ou da sua memória.");
      } else {
        mat.push(`Com ${fmt(acerto)}% de acerto e payoff de ${esc(String(nums.payoff))}, cada R$ 100 arriscados <strong>perdem em média R$ ${fmt(por100)}</strong>. Antes de qualquer coisa, essa conta precisa fechar.`);
      }
      mat.push(`Com esse payoff, você precisa acertar pelo menos ${empata}% das operações só para empatar.`);
    } else if (!nums.naoSei) {
      mat.push("Sem taxa de acerto e payoff, ninguém consegue dizer se o seu método ganha dinheiro. São os dois primeiros números que você precisa começar a medir.");
    }
    const perda = numero("maiorPerda");
    const faixa = R.capitalFaixas[perfil.capital];
    if (perda && faixa) {
      const [min, max] = faixa;
      const deMax = max ? (perda / max) * 100 : null;
      const deMin = min ? (perda / min) * 100 : null;
      let peso;
      if (deMax !== null && deMin !== null) peso = `entre ${fmt(deMax, 1)}% e ${fmt(deMin, 1)}% da sua conta`;
      else if (deMax !== null) peso = `pelo menos ${fmt(deMax, 1)}% da sua conta`;
      else peso = `até ${fmt(deMin, 1)}% da sua conta`;
      mat.push(`Sua maior perda num dia foi R$ ${fmt(perda)}. Com o capital que você informou, isso é ${peso} em um único pregão.${(deMax ?? 0) >= 3 ? " É muito para um dia só." : ""}`);
    }
    const stop = numero("stopRespeitado");
    if (stop !== null && stop >= 0 && stop <= 7) {
      mat.push(`Você respeitou o stop em ${fmt(stop)} de 10 pregões. Nos outros ${fmt(10 - stop)}, quem decidiu foi a emoção.`);
    }

    const mapa = R.ordemPadroes.map((k) => {
      const p = R.padroes[k];
      return `<div class="barra-linha${k === calc.padrao ? " destaque" : ""}">
        <div class="topo-barra"><span>${esc(p.nome)}</span><span>${calc.pct[k]}% · ${calc.nivel[k]}</span></div>
        <div class="trilho"><i data-w="${Math.max(calc.pct[k], 2)}" style="background:${p.cor}"></i></div>
      </div>`;
    }).join("");

    const preenchidos = R.numeros.filter((n) => nums[n.k]);
    const blocoNumeros = nums.naoSei || !preenchidos.length
      ? `<p>Você ainda não sabe os seus números. Tudo bem: <strong>esse é o primeiro trabalho ${PUBLICO ? "a fazer" : "da mentoria"}</strong>. Trader que não mede, não melhora.</p>`
      : `<div class="numeros">${preenchidos.map((n) => `<div class="num"><b>${n.pre ? esc(n.pre) + " " : ""}${esc(nums[n.k])}${n.suf === "%" ? "%" : ""}</b><span>${esc(n.q)}</span></div>`).join("")}</div>`;

    const blocoAudio = audioP || audioF ? `
      <div class="card"><h3>Ouça o Cohen</h3>
        ${audioP ? `<p style="margin:16px 0 0">🎧 Sobre ${esc(P.nome)}</p><audio controls preload="none" src="${esc(audioP)}"></audio>` : ""}
        ${audioF ? `<p style="margin:16px 0 0">🎧 Sobre a sua força: ${esc(F.nome)}</p><audio controls preload="none" src="${esc(audioF)}"></audio>` : ""}
      </div>` : "";

    const blocoCegos = cegos.length ? `
      <div class="card cego">
        <div class="rotulo">${cegos.length === 1 ? "Seu ponto cego" : `Seus ${cegos.length} pontos cegos`}</div>
        <h3>Suas respostas se contradizem</h3>
        <p style="color:var(--muted);margin-top:8px">O mais difícil de enxergar é o que a gente conta para nós mesmos.</p>
        ${cegos.map((c) => `<div class="cego-item"><h4>${esc(c.titulo)}</h4><p>${md(c.texto)}</p></div>`).join("")}
      </div>` : `
      <div class="card">
        <div class="rotulo">Pontos cegos</div>
        <h3>Nenhuma contradição nas suas respostas</h3>
        <p style="margin:10px 0 0">Isso é raro. Leve essa mesma honestidade para o seu diário de trade.</p>
      </div>`;

    const msgZap = encodeURIComponent(`Oi Elaine! Fiz o Raio-X do Trader e meu padrão é ${P.nome}. Quero saber mais da Mentoria Trader 360 (5ª turma).`);
    const blocoFinal = PUBLICO ? `
      <div class="card cta">
        <div class="rotulo">O próximo passo</div>
        <h2>Seu padrão tem tratamento</h2>
        <p style="margin-top:12px">Na <strong>Mentoria Trader 360</strong>, eu trabalho isso ao vivo, com você. Os encontros que atacam o seu padrão:</p>
        <ul class="lista">${PUB.encontros[calc.padrao].map((e) => `<li>Encontro ${esc(e)}</li>`).join("")}</ul>
        <p>São 10 encontros ao vivo, terças e quintas às 19h, tudo gravado. <strong>Inscrições da 5ª turma até 20/10.</strong></p>
        <div class="acoes">
          <a class="btn" href="${esc(PUB.lp)}" target="_blank" rel="noopener">Quero minha vaga na 5ª turma</a>
          <a class="btn sec" href="https://wa.me/${PUB.whatsapp}?text=${msgZap}" target="_blank" rel="noopener">Falar com a Elaine no WhatsApp</a>
        </div>
      </div>` : `
      <div class="card" style="text-align:center">
        <div class="rotulo">Encontros da Trader 360</div>
        <h3>Terças e quintas, 19h</h3>
        <p style="color:var(--muted);margin:10px 0 0">No último encontro, dia 12/11, você refaz o Raio-X e compara com este. Guarde o link desta página.</p>
      </div>`;

    tela(`
      <h1>RAIO-X <span class="ouro">DO TRADER</span></h1>

      <div class="card carta">
        <div class="rotulo">Seu padrão</div>
        <h2 class="padrao-nome">${esc(P.nome)}</h2>
        <div class="chip" style="--c:${P.cor}">Intensidade ${nivelTxt[calc.nivel[calc.padrao]]} · ${calc.pct[calc.padrao]}%</div>
        <p class="segundo">${leituraIntensidade}</p>

        <p class="saudacao">${esc(nome)}${nome ? "," : ""}</p>
        <p>Li suas respostas. O padrão que mais pesa no seu trade hoje é <strong>${esc(P.nome)}</strong>. Em uma frase: ${esc(P.tema)}.</p>
        ${R.estagios[perfil.tempo] ? `<p>${esc(R.estagios[perfil.tempo])}</p>` : ""}
        ${comoAparece}
        <p>${esc(descricao)} <strong>${esc(P.sintese)}</strong></p>

        ${blocoPalavras}

        <h3 style="margin-top:28px">Por onde começar: ${esc(area.nome.toLowerCase())}</h3>
        <p>Pelas suas respostas, o ponto mais sensível hoje é este: ${esc(foco.frase)}</p>
        <ol class="movimentos">
          ${foco.d.map((t, i) => `<li><span>${esc(R.prazos[i])}</span>${esc(t)}</li>`).join("")}
        </ol>
        ${fora}

        <div class="acao7"><div class="rotulo">Seu compromisso de 7 dias</div><p style="margin:0">${esc(P.acao7)}</p></div>

        <p class="citacao-curta">“${esc(P.citacao.t)}” <small>${esc(P.citacao.f)}</small></p>

        <div class="assina">
          <p class="frase-final">${esc(P.frase)}</p>
          <img src="/assinatura.svg" alt="Assinatura de Rodrigo Cohen" width="190" height="115">
          <small>Rodrigo Cohen · 26 anos de mercado · Analista CNPI</small>
        </div>
      </div>

      ${blocoCegos}

      <div class="card">
        <div class="rotulo">Sua força</div>
        <h2 style="color:var(--brass)">${esc(F.nome)}</h2>
        <p style="margin-top:12px">${esc(F.texto)}</p>
        <ol class="lista">${F.passos.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
      </div>

      <div class="card">
        <div class="rotulo">Sua matemática</div>
        <h3>A foto de hoje</h3>
        ${blocoNumeros}
        ${mat.map((m) => `<p class="mat">${m}</p>`).join("")}
        <p style="margin:14px 0 0;color:var(--muted)">Guarde esta foto. ${PUBLICO ? "Daqui a 90 dias, compare." : "No fim da Trader 360, a gente compara."}</p>
      </div>

      <div class="card">
        <div class="rotulo">Seu mapa</div>
        <h3>Os 5 padrões em você</h3>
        <p style="color:var(--muted);margin:8px 0 0;font-size:15px">Quanto maior a barra, mais esse padrão apareceu nos seus últimos 90 dias.</p>
        <div class="mapa">${mapa}</div>
      </div>

      ${blocoAudio}

      <div class="card">
        <h3>O quanto este resultado faz sentido para você?</h3>
        <div class="notas">${Array.from({ length: 10 }, (_, k) => `<button data-n="${k + 1}" class="${d.nota === k + 1 ? "on" : ""}">${k + 1}</button>`).join("")}</div>
        <div class="notas-legenda"><span>Nada</span><span>Totalmente</span></div>
        <div class="erro" id="nota-msg" style="color:var(--brass)"></div>
      </div>

      <div class="card" style="text-align:center">
        <div class="rotulo">Compartilhe</div>
        <h3>Poste o seu padrão nos stories</h3>
        <p style="color:var(--muted);margin:10px 0 16px">Gera uma imagem pronta, sem seus números nem suas respostas.</p>
        <button class="btn sec" id="compartilhar">Gerar imagem do meu padrão</button>
        <div class="erro" id="share-msg" style="color:var(--brass)"></div>
      </div>

      ${blocoFinal}
    `);

    app.querySelector("#compartilhar").addEventListener("click", () => gerarCard(P, calc));

    requestAnimationFrame(() => setTimeout(() => {
      app.querySelectorAll(".trilho i").forEach((b) => { b.style.width = b.dataset.w + "%"; });
    }, 60));

    app.querySelectorAll("[data-n]").forEach((b) => b.addEventListener("click", async () => {
      const nota = Number(b.dataset.n);
      app.querySelectorAll("[data-n]").forEach((x) => x.classList.toggle("on", x === b));
      const msg = app.querySelector("#nota-msg");
      const id = s.resultadoId || new URLSearchParams(location.search).get("r");
      try {
        const r = await fetch("/api/enviar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, nota }) });
        if (!r.ok) throw new Error();
        if (!dados) { s.nota = nota; guardar(); }
        msg.textContent = "Obrigado. Você pode mudar a nota quando quiser.";
      } catch (e) {
        msg.textContent = "Não consegui salvar a nota. Tente de novo.";
      }
    }));
  }

  async function resultadoPorLink(id) {
    tela(`<div class="carregando"><div class="pulso"></div>Carregando seu Raio-X…</div>`);
    try {
      const r = await fetch(`/api/resultado?id=${encodeURIComponent(id)}`);
      if (!r.ok) throw new Error();
      resultado(await r.json());
    } catch (e) {
      tela(`<h2>Resultado não encontrado</h2><p class="sub">Confira o link ou faça o Raio-X de novo.</p>
        <div class="acoes"><button class="btn" id="novo">Fazer o Raio-X</button></div>`);
      app.querySelector("#novo").addEventListener("click", () => { history.replaceState(null, "", BASE); ir("capa"); });
    }
  }

  // Imagem 1080x1920 para stories, desenhada no navegador.
  async function gerarCard(P, calc) {
    const msg = app.querySelector("#share-msg");
    msg.textContent = "Gerando…";
    try {
      await Promise.all([document.fonts.load('120px "Marcellus"'), document.fonts.load('600 40px "Instrument Sans"')]);
    } catch (e) { /* segue com a fonte padrão */ }
    const W = 1080, H = 1920;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const c = cv.getContext("2d");
    c.fillStyle = "#0b0b0d"; c.fillRect(0, 0, W, H);
    const g = c.createRadialGradient(W / 2, 760, 50, W / 2, 760, 900);
    g.addColorStop(0, "rgba(195,164,107,0.16)"); g.addColorStop(1, "rgba(195,164,107,0)");
    c.fillStyle = g; c.fillRect(0, 0, W, H);

    const quebra = (texto, max, fonte) => {
      c.font = fonte;
      const linhas = []; let linha = "";
      texto.split(" ").forEach((p) => {
        const teste = linha ? linha + " " + p : p;
        if (c.measureText(teste).width > max && linha) { linhas.push(linha); linha = p; } else linha = teste;
      });
      if (linha) linhas.push(linha);
      return linhas;
    };
    const centro = (texto, y, fonte, cor, espaco) => {
      c.font = fonte; c.fillStyle = cor; c.textAlign = "center";
      if ("letterSpacing" in c) c.letterSpacing = espaco || "0px";
      c.fillText(texto, W / 2, y);
      if ("letterSpacing" in c) c.letterSpacing = "0px";
    };

    centro("TRADER 360 · RAIO-X DO TRADER", 200, '600 34px "Instrument Sans", sans-serif', "#c3a46b", "8px");
    centro("MEU PADRÃO NO TRADE", 600, '600 38px "Instrument Sans", sans-serif', "#9ba0a8", "6px");
    let y = 760;
    quebra(P.nome.toUpperCase(), 940, '128px "Marcellus", serif').forEach((l) => { centro(l, y, '128px "Marcellus", serif', "#f2efe9"); y += 140; });
    centro(P.tema, y + 10, '44px "Instrument Sans", sans-serif', "#9ba0a8");
    y += 110;
    c.fillStyle = P.cor; c.fillRect(W / 2 - 300, y, 600 * Math.max(calc.pct[calc.padrao], 4) / 100, 18);
    c.fillStyle = "rgba(255,255,255,0.08)"; c.fillRect(W / 2 - 300 + 600 * Math.max(calc.pct[calc.padrao], 4) / 100, y, 600 - 600 * Math.max(calc.pct[calc.padrao], 4) / 100, 18);
    centro(`Intensidade ${{ leve: "leve", moderado: "moderada", forte: "forte" }[calc.nivel[calc.padrao]]} · ${calc.pct[calc.padrao]}%`, y + 80, '600 36px "Instrument Sans", sans-serif', "#f2efe9");
    y += 230;
    quebra(`“${P.citacao.t}”`, 860, 'italic 50px "Marcellus", serif').forEach((l) => { centro(l, y, '50px "Marcellus", serif', "#d8d4cc"); y += 66; });
    centro(P.citacao.f, y + 16, '34px "Instrument Sans", sans-serif', "#9ba0a8");
    centro("Descubra o seu em 4 minutos", 1660, '600 44px "Instrument Sans", sans-serif', "#f2efe9");
    centro(PUB.dominio + PUB.caminho, 1730, '600 40px "Instrument Sans", sans-serif', "#c3a46b");

    const blob = await new Promise((ok) => cv.toBlob(ok, "image/png"));
    const arquivo = new File([blob], "meu-padrao-trader.png", { type: "image/png" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
        await navigator.share({ files: [arquivo], text: `Meu padrão no trade: ${P.nome}. Faça o seu: https://${PUB.dominio}${PUB.caminho}` });
        msg.textContent = "";
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") { msg.textContent = ""; return; }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "meu-padrao-trader.png";
    document.body.appendChild(a); a.click(); a.remove();
    msg.textContent = "Imagem salva. Agora é só postar nos stories.";
  }

  function render() {
    switch (s.etapa) {
      case "id": return identificacao();
      case "perfil": return perfil();
      case "numeros": return numeros();
      case "intro": return intro();
      case "afirm": return afirmacao();
      case "abertas": return abertas();
      case "enviando": return enviando();
      case "resultado": return resultado();
      default: return capa();
    }
  }

  // ---------- Início ----------
  const idLink = new URLSearchParams(location.search).get("r");
  if (idLink && idLink !== s.resultadoId) {
    resultadoPorLink(idLink);
  } else if (s.resultadoId) {
    s.etapa = "resultado";
    render();
  } else {
    // Quem volta no meio do caminho vê a capa com "continuar".
    s.etapaSalva = s.etapa === "enviando" ? "abertas" : s.etapa;
    s.etapa = "capa";
    marcar("visitou");
    render();
  }
})();
