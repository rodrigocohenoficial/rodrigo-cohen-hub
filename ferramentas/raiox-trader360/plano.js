// Plano de Trade · Trader 360
// Calculadora de risco do WIN, matemática do trade (com simulação) e o plano em uma página.
(function () {
  const R = window.RAIOX || {};
  const PADROES = R.padroes || {};
  const ORDEM = R.ordemPadroes || Object.keys(PADROES);
  const PONTO_WIN = 0.2; // R$ por ponto, por contrato de mini índice
  const CHAVE = "plano-t360-t5";
  const app = document.getElementById("app");
  const params = new URLSearchParams(location.search);

  const PADRAO_INICIAL = {
    nome: "", capital: 10000, riscoPct: 1, stopPts: 150, limiteStops: 2, metaR: 3,
    acerto: 45, payoff: 1.5, opsDia: 3,
    inicio: "09:15", fim: "11:30", tempo: "5 minutos",
    setups: ["VBS", "VSS"], outroSetup: "", rotina: true,
    padrao: "", regra: "", quem: "", id: "",
  };

  let s = carregar();
  let semente = 7;

  function carregar() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
      if (salvo && typeof salvo === "object") {
        const x = Object.assign({}, PADRAO_INICIAL, salvo);
        if (!Array.isArray(x.setups)) x.setups = [];
        return x;
      }
    } catch (e) { /* sem armazenamento: segue com o padrão */ }
    return Object.assign({}, PADRAO_INICIAL);
  }
  function guardar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(s)); } catch (e) { /* ignora */ }
  }

  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const num = (v, d) => { const n = parseFloat(String(v).replace(",", ".")); return isFinite(n) ? n : d; };
  const brl = (v, casas = 0) => (v < 0 ? "−" : "") + "R$ " + Math.abs(v).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  const fmt = (v, casas = 1) => v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  const sinal = (v, casas = 2) => (v > 0 ? "+" : v < 0 ? "−" : "") + fmt(Math.abs(v), casas);

  // ---------- contas ----------
  function contas() {
    const capital = Math.max(0, num(s.capital, 0));
    const riscoPct = Math.min(5, Math.max(0.1, num(s.riscoPct, 1)));
    const stopPts = Math.max(5, num(s.stopPts, 150));
    const riscoAlvo = capital * riscoPct / 100;
    const porContrato = stopPts * PONTO_WIN;
    const contratos = Math.floor(riscoAlvo / porContrato);
    const riscoReal = contratos * porContrato;
    const riscoBase = contratos > 0 ? riscoReal : porContrato; // para as contas em R$, ao menos 1 contrato
    const a = Math.min(0.99, Math.max(0.01, num(s.acerto, 45) / 100));
    const p = Math.max(0.05, num(s.payoff, 1.5));
    const eR = a * p - (1 - a);
    const be = 1 / (1 + p);
    const payoffMin = (1 - a) / a;
    const ops = Math.max(1, num(s.opsDia, 3));
    return {
      capital, riscoPct, stopPts, riscoAlvo, porContrato, contratos, riscoReal, riscoBase,
      a, p, eR, be, payoffMin, ops,
      limiteDia: Math.max(1, num(s.limiteStops, 2)) * riscoBase,
      metaDia: Math.max(1, num(s.metaR, 3)) * riscoBase,
      eRS: eR * riscoBase,
      mes: eR * riscoBase * ops * 21,
    };
  }

  // ---------- simulação ----------
  function rng(seed) {
    let t = seed >>> 0;
    return function () {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function simular(c, n = 100, caminhos = 2000) {
    const rand = rng(semente);
    const desenho = [];
    const finais = [], quedas = [], sequencias = [];
    for (let k = 0; k < caminhos; k++) {
      let acc = 0, pico = 0, queda = 0, seq = 0, maxSeq = 0;
      const linha = k < 30 ? [0] : null;
      for (let i = 0; i < n; i++) {
        if (rand() < c.a) { acc += c.p; seq = 0; } else { acc -= 1; seq++; if (seq > maxSeq) maxSeq = seq; }
        if (acc > pico) pico = acc;
        if (pico - acc > queda) queda = pico - acc;
        if (linha) linha.push(acc);
      }
      if (linha) desenho.push(linha);
      finais.push(acc); quedas.push(queda); sequencias.push(maxSeq);
    }
    const med = (arr) => { const o = arr.slice().sort((x, y) => x - y); return o[Math.floor(o.length / 2)]; };
    return {
      desenho,
      mediana: med(finais),
      quedaMed: med(quedas),
      seqMed: med(sequencias),
      pPrejuizo: finais.filter((f) => f < 0).length / caminhos,
      pQueda20: quedas.filter((q) => q * c.riscoPct >= 20).length / caminhos,
    };
  }
  function grafico(sim) {
    const W = 640, H = 300, P = 16;
    const todos = sim.desenho.flat();
    let lo = Math.min(0, ...todos), hi = Math.max(0, ...todos);
    if (hi - lo < 10) { hi += 5; lo -= 5; }
    const n = sim.desenho[0].length - 1;
    const x = (i) => (P + (i / n) * (W - 2 * P)).toFixed(1);
    const y = (v) => (P + ((hi - v) / (hi - lo)) * (H - 2 * P)).toFixed(1);
    const linhas = sim.desenho.map((l) => {
      const fim = l[l.length - 1];
      const cor = fim >= 0 ? "rgba(195,164,107,0.55)" : "rgba(248,113,113,0.5)";
      return `<polyline fill="none" stroke="${cor}" stroke-width="1.6" points="${l.map((v, i) => x(i) + "," + y(v)).join(" ")}"/>`;
    }).join("");
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="30 caminhos possíveis de 100 trades com a sua matemática">
      <line x1="${P}" x2="${W - P}" y1="${y(0)}" y2="${y(0)}" stroke="#9ba0a8" stroke-width="1.5" stroke-dasharray="6 6"/>
      ${linhas}</svg>`;
  }

  // ---------- telas ----------
  function campo(id, rotulo, valor, extra = "", dica = "") {
    return `<div class="campo"><label for="${id}">${rotulo}${dica ? ` <span class="dica">${dica}</span>` : ""}</label>
      <input id="${id}" data-k="${id}" value="${esc(valor)}" ${extra}></div>`;
  }

  function telaConta(c) {
    let alerta = "";
    if (c.contratos < 1) {
      const pctMin = c.capital > 0 ? (c.porContrato / c.capital) * 100 : 0;
      alerta = `<div class="alerta">Com ${brl(c.riscoAlvo)} de risco, um stop de ${fmt(c.stopPts, 0)} pontos não cabe nem em 1 contrato (1 contrato = ${brl(c.porContrato)}).
        Diminua o stop, aumente o capital ou aceite um risco de ${fmt(pctMin, 1)}% por trade. Até lá, simulador.</div>`;
    } else if (c.riscoPct > 2) {
      alerta = `<div class="alerta">Acima de 2% por trade, uma sequência normal de stops já machuca a conta de verdade. Veja a simulação abaixo antes de decidir.</div>`;
    }
    return `<div class="card">
      <div class="rotulo">1 · Sua conta</div>
      <h2>Quanto você arrisca por trade</h2>
      <div class="grade2">
        ${campo("capital", "Capital na conta", s.capital, 'inputmode="decimal"', "R$")}
        ${campo("stopPts", "Stop médio", s.stopPts, 'inputmode="numeric"', "pontos")}
      </div>
      <div class="campo"><label for="riscoPct">Risco por trade <span class="dica">% do capital</span></label>
        <div class="valor-range">${fmt(c.riscoPct, 2)}%</div>
        <input id="riscoPct" data-k="riscoPct" type="range" min="0.25" max="3" step="0.25" value="${c.riscoPct}"></div>
      <div class="grade2">
        ${campo("limiteStops", "Paro no dia depois de", s.limiteStops, 'inputmode="numeric"', "stops")}
        ${campo("metaR", "Meta do dia", s.metaR, 'inputmode="decimal"', "vezes o risco")}
      </div>
      <div class="numeros">
        <div class="num destaque"><div class="r">Contratos de WIN</div><div class="v">${c.contratos}</div><div class="s">${c.contratos ? brl(c.riscoReal) + " de risco real" : "não cabe"}</div></div>
        <div class="num"><div class="r">Risco por trade</div><div class="v">${brl(c.riscoAlvo)}</div><div class="s">${fmt(c.riscoPct, 2)}% de ${brl(c.capital)}</div></div>
        <div class="num"><div class="r">Limite do dia</div><div class="v">${brl(c.limiteDia)}</div><div class="s">bateu, desliga a tela</div></div>
        <div class="num"><div class="r">Meta do dia</div><div class="v">${brl(c.metaDia)}</div><div class="s">bateu, desliga a tela</div></div>
      </div>
      ${alerta}
      <p class="sub" style="font-size:14px;margin-top:14px">No WIN, cada ponto vale R$ 0,20 por contrato. Contratos = risco por trade ÷ (stop × R$ 0,20).</p>
    </div>`;
  }

  function telaMatematica(c, sim) {
    const bom = c.eR > 0;
    const ver = bom
      ? `<div class="veredito bom"><h3>Do jeito que está, seu trade ganha dinheiro.</h3><p>Cada trade vale em média ${sinal(c.eR)} R (${brl(c.eRS, 2)}). Agora o trabalho é executar igual todo dia.</p></div>`
      : `<div class="veredito ruim"><h3>Do jeito que está, o mercado leva.</h3><p>Com payoff ${fmt(c.p, 2)}, você precisa acertar mais de ${fmt(c.be * 100, 0)}%. Com ${fmt(c.a * 100, 0)}% de acerto, precisa de payoff acima de ${fmt(c.payoffMin, 2)}.</p></div>`;
    return `<div class="card">
      <div class="rotulo">2 · Sua matemática</div>
      <h2>Seu jeito de operar ganha ou perde?</h2>
      <p class="sub">Use os números do Raio-X ou do Meu Diário. Chute não vale.</p>
      <div class="grade2">
        ${campo("acerto", "Taxa de acerto", s.acerto, 'inputmode="decimal"', "%")}
        ${campo("payoff", "Payoff", s.payoff, 'inputmode="decimal"', "ganho ÷ perda")}
      </div>
      ${campo("opsDia", "Trades por dia, em média", s.opsDia, 'inputmode="numeric"')}
      <div class="numeros">
        <div class="num destaque"><div class="r">Por trade</div><div class="v">${sinal(c.eR)} R</div><div class="s">${brl(c.eRS, 2)} em média</div></div>
        <div class="num"><div class="r">Acerto mínimo</div><div class="v">${fmt(c.be * 100, 0)}%</div><div class="s">para empatar com payoff ${fmt(c.p, 2)}</div></div>
        <div class="num"><div class="r">Em 100 trades</div><div class="v">${sinal(c.eR * 100, 0)} R</div><div class="s">${brl(c.eRS * 100)} em média</div></div>
        <div class="num"><div class="r">Num mês</div><div class="v">${brl(c.mes)}</div><div class="s">${fmt(c.ops, 0)} trades por dia, 21 pregões</div></div>
      </div>
      ${ver}
      <div class="sim">
        <div class="rotulo" style="margin-top:6px">30 caminhos possíveis de 100 trades</div>
        ${grafico(sim)}
        <div class="leg"><span>trade 1</span><span>linha tracejada = zero</span><span>trade 100</span></div>
        <div class="numeros">
          <div class="num"><div class="r">Sequência de stops</div><div class="v">${sim.seqMed} seguidos</div><div class="s">vai acontecer. Prepare a cabeça</div></div>
          <div class="num"><div class="r">Pior queda típica</div><div class="v">${fmt(sim.quedaMed, 1)} R</div><div class="s">${fmt(sim.quedaMed * c.riscoPct, 0)}% da conta</div></div>
          <div class="num"><div class="r">Chance de prejuízo</div><div class="v">${fmt(sim.pPrejuizo * 100, 0)}%</div><div class="s">depois de 100 trades</div></div>
          <div class="num"><div class="r">Queda de 20%</div><div class="v">${fmt(sim.pQueda20 * 100, 0)}%</div><div class="s">dos caminhos chegam lá</div></div>
        </div>
        <div class="acoes"><button class="btn sec" id="resimular">Simular de novo</button></div>
      </div>
    </div>`;
  }

  function telaRegras() {
    const setups = ["Gift", "VBS", "VSS"];
    const op = (rot, marcado, attrs) => `<label class="marca-op ${marcado ? "on" : ""}"><input type="checkbox" ${marcado ? "checked" : ""} ${attrs}>${rot}</label>`;
    const pad = PADROES[s.padrao];
    return `<div class="card">
      <div class="rotulo">3 · Suas regras</div>
      <h2>Quando, o quê e quando parar</h2>
      ${campo("nome", "Seu nome", s.nome, 'autocomplete="name"')}
      <div class="grade2">
        ${campo("inicio", "Começo a operar às", s.inicio, 'inputmode="numeric"')}
        ${campo("fim", "Paro de operar às", s.fim, 'inputmode="numeric"')}
      </div>
      <div class="campo"><label for="tempo">Tempo gráfico</label>
        <select id="tempo" data-k="tempo">${["2 minutos", "5 minutos", "15 minutos"].map((t) => `<option ${s.tempo === t ? "selected" : ""}>${t}</option>`).join("")}</select></div>
      <div class="campo"><label>Setups que eu opero</label><div class="marcas">
        ${setups.map((t) => op(t, s.setups.includes(t), `data-setup="${t}"`)).join("")}
      </div></div>
      ${campo("outroSetup", "Outro setup", s.outroSetup, "", "opcional")}
      <div class="campo"><div class="marcas">${op("Faço a rotina de 15 minutos antes de abrir", s.rotina, 'data-k="rotina"')}</div></div>
      <div class="campo"><label for="padrao">Meu padrão no Raio-X</label>
        <select id="padrao" data-k="padrao"><option value="">Escolha</option>${ORDEM.map((k) => `<option value="${k}" ${s.padrao === k ? "selected" : ""}>${esc(PADROES[k].nome)}</option>`).join("")}</select>
        ${pad ? `<div class="protocolo"><b>Protocolo:</b> ${esc(pad.acao7)}</div>` : ""}</div>
      <div class="campo"><label for="regra">A regra que eu não quebro mais</label>
        <textarea id="regra" data-k="regra" placeholder="Ex.: depois de dois stops seguidos, eu desligo a tela.">${esc(s.regra)}</textarea></div>
      ${campo("quem", "Quem da sua casa vai ler este plano?", s.quem, "", "nome")}
    </div>`;
  }

  function telaDocumento(c) {
    const pad = PADROES[s.padrao];
    const setups = s.setups.concat(s.outroSetup ? [s.outroSetup] : []);
    const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    return `<div class="doc" id="doc">
      <div class="rotulo">Trader 360 · Turma 5</div>
      <h2>Plano de Trade${s.nome ? ` de ${esc(s.nome)}` : ""}</h2>
      <div class="data">${hoje}</div>
      <h4>Conta e risco</h4>
      <ul>
        <li>Capital: ${brl(c.capital)}. Risco por trade: ${fmt(c.riscoPct, 2)}% (${brl(c.riscoAlvo)}).</li>
        <li>Mini índice (WIN), stop médio de ${fmt(c.stopPts, 0)} pontos: <b>${c.contratos ? c.contratos + (c.contratos > 1 ? " contratos" : " contrato") : "simulador até caber 1 contrato"}</b>.</li>
      </ul>
      <h4>Quando eu opero</h4>
      <ul>
        <li>Das ${esc(s.inicio)} às ${esc(s.fim)}, no gráfico de ${esc(s.tempo)}.</li>
        ${s.rotina ? "<li>Só abro o WIN depois da rotina de 15 minutos: médias, linhas de ontem, números redondos, agenda e dois cenários escritos.</li>" : ""}
      </ul>
      <h4>O que eu opero</h4>
      <ul>
        <li>${setups.length ? esc(setups.join(", ")) : "Defina pelo menos um setup"}. Só a favor da média de 8 sobre a 20.</li>
        <li>Alvo de no mínimo 2 vezes o risco. Se não paga, não tem trade.</li>
      </ul>
      <h4>Quando eu paro</h4>
      <ul>
        <li>Depois de ${fmt(Math.max(1, num(s.limiteStops, 2)), 0)} stops, ou ${brl(c.limiteDia)} de perda no dia: desligo a tela.</li>
        <li>Bateu ${brl(c.metaDia)} de ganho no dia: desligo a tela.</li>
        ${pad ? `<li>Meu padrão é ${esc(pad.nome)}. Protocolo: ${esc(pad.acao7)}</li>` : ""}
      </ul>
      <h4>Minha matemática</h4>
      <ul>
        <li>Acerto de ${fmt(c.a * 100, 0)}% e payoff ${fmt(c.p, 2)}: ${sinal(c.eR)} R por trade. Acerto mínimo para empatar: ${fmt(c.be * 100, 0)}%.</li>
      </ul>
      ${s.regra ? `<h4>A regra que eu não quebro mais</h4><div class="regra">${esc(s.regra)}</div>` : ""}
      <div class="assin"><div>${s.nome ? esc(s.nome) : "Assinatura"}</div><div>Lido por: ${s.quem ? esc(s.quem) : "________"}</div></div>
      <div class="rodape-doc">Plano de estudo da Mentoria Trader 360. Não é recomendação de investimento.</div>
    </div>
    <div class="acoes naoimprime">
      <button class="btn" id="enviar">Enviar para o Cohen</button>
      <button class="btn sec" id="imprimir">Salvar em PDF</button>
      <button class="btn sec" id="whats">Mandar no WhatsApp</button>
    </div>
    <div id="msg"></div>`;
  }

  function render() {
    const c = contas();
    const sim = simular(c);
    const foco = document.activeElement && document.activeElement.id;
    const pos = foco && document.activeElement.selectionStart;
    app.innerHTML = `
      <div class="rotulo">Gestão de risco</div>
      <h1>Seu <span class="ouro">Plano de Trade</span></h1>
      <p class="sub">Três passos. No fim, um plano de uma página para imprimir, assinar e mostrar em casa.</p>
      ${telaConta(c)}${telaMatematica(c, sim)}${telaRegras()}${telaDocumento(c)}`;
    if (foco) {
      const el = document.getElementById(foco);
      if (el) { el.focus(); try { if (pos != null) el.setSelectionRange(pos, pos); } catch (e) { /* range e select */ } }
    }
  }

  // Atualiza ao digitar, sem perder o foco.
  app.addEventListener("input", (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    if (e.target.type === "range") {
      // Durante o arraste só atualiza o número; o resto recalcula ao soltar.
      s[k] = e.target.value;
      const v = e.target.parentElement.querySelector(".valor-range");
      if (v) v.textContent = fmt(num(s[k], 1), 2) + "%";
      guardar();
      return;
    }
    s[k] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    guardar();
    render();
  });
  app.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.setup) {
      const set = new Set(s.setups);
      t.checked ? set.add(t.dataset.setup) : set.delete(t.dataset.setup);
      s.setups = Array.from(set);
    } else if (t.dataset.k && (t.tagName === "SELECT" || t.type === "checkbox" || t.type === "range")) {
      s[t.dataset.k] = t.type === "checkbox" ? t.checked : t.value;
    } else return;
    guardar();
    render();
  });
  app.addEventListener("click", async (e) => {
    const id = e.target.id;
    if (id === "resimular") { semente = (semente * 48271 + 11) % 2147483647; render(); }
    if (id === "imprimir") window.print();
    if (id === "whats") {
      const c = contas();
      const txt = `Meu Plano de Trade (Trader 360)\n` +
        `• ${c.contratos} contrato(s) de WIN, stop de ${fmt(c.stopPts, 0)} pts, risco de ${brl(c.riscoAlvo)} por trade\n` +
        `• Paro depois de ${fmt(Math.max(1, num(s.limiteStops, 2)), 0)} stops ou ${brl(c.limiteDia)} no dia\n` +
        `• Meta do dia: ${brl(c.metaDia)}, bateu desliga\n` +
        `• Minha matemática: ${sinal(c.eR)} R por trade\n` +
        (s.regra ? `• Regra que eu não quebro mais: ${s.regra}` : "");
      window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank");
    }
    if (id === "enviar") {
      const msg = document.getElementById("msg");
      if (!s.nome.trim()) { msg.innerHTML = '<div class="erro-msg">Coloque seu nome no passo 3 antes de enviar.</div>'; return; }
      e.target.disabled = true;
      try {
        const c = contas();
        const r = await fetch("/api/plano", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: s.id || undefined, site: "",
            nome: s.nome, plano: {
              capital: c.capital, riscoPct: c.riscoPct, stopPts: c.stopPts, contratos: c.contratos,
              limiteStops: num(s.limiteStops, 2), metaR: num(s.metaR, 3), acerto: num(s.acerto, 0), payoff: num(s.payoff, 0),
              opsDia: num(s.opsDia, 0), eR: Math.round(c.eR * 100) / 100, inicio: s.inicio, fim: s.fim, tempo: s.tempo,
              setups: s.setups.concat(s.outroSetup ? [s.outroSetup] : []), rotina: !!s.rotina,
              padrao: s.padrao, regra: s.regra, quem: s.quem,
            },
          }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.erro || "falha");
        s.id = j.id; guardar();
        msg.innerHTML = '<div class="ok-msg">Enviado. O Cohen vai ler.</div>';
      } catch (err) {
        msg.innerHTML = '<div class="erro-msg">Não deu para enviar agora. Tente de novo em instantes.</div>';
      }
      e.target.disabled = false;
    }
  });

  // ---------- lista do Cohen (?k=chave) ----------
  async function lista(k) {
    app.innerHTML = '<div class="carregando"><div class="pulso"></div>Carregando os planos…</div>';
    try {
      const r = await fetch("/api/plano?k=" + encodeURIComponent(k), { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.erro || "falha");
      const ps = j.planos || [];
      const media = ps.length ? ps.reduce((t, p) => t + (p.plano.eR || 0), 0) / ps.length : 0;
      const pos = ps.filter((p) => (p.plano.eR || 0) > 0).length;
      const nomePad = (k2) => (PADROES[k2] ? PADROES[k2].nome : "—");
      app.innerHTML = `<div class="rotulo">Planos da Turma 5</div><h1>${ps.length} planos</h1>
        <div class="numeros">
          <div class="num destaque"><div class="r">Matemática média</div><div class="v">${sinal(media)} R</div><div class="s">por trade</div></div>
          <div class="num"><div class="r">Ganham dinheiro</div><div class="v">${pos} de ${ps.length}</div><div class="s">com os números que deram</div></div>
        </div>
        <div class="rolagem"><table class="lista"><tr><th>Nome</th><th>Contratos</th><th>Risco</th><th>Acerto · payoff</th><th>R por trade</th><th>Para depois de</th><th>Padrão</th><th>Regra</th></tr>
        ${ps.map((p) => { const x = p.plano; return `<tr><td>${esc(p.nome)}</td><td>${x.contratos}</td><td>${fmt(x.riscoPct, 2)}%</td><td>${fmt(x.acerto, 0)}% · ${fmt(x.payoff, 2)}</td>
          <td class="${x.eR > 0 ? "pos" : "neg"}">${sinal(x.eR)}</td><td>${x.limiteStops} stops</td><td>${esc(nomePad(x.padrao))}</td><td>${esc(x.regra)}</td></tr>`; }).join("")}
        </table></div>
        <div class="acoes"><button class="btn sec" onclick="location.reload()">Atualizar</button></div>`;
    } catch (err) {
      app.innerHTML = '<div class="card"><h2>Não deu para carregar.</h2><p class="sub">Confira a chave do link.</p></div>';
    }
  }

  if (params.get("k")) lista(params.get("k"));
  else render();
})();
