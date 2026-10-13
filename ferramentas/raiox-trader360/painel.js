(function () {
  const R = window.RAIOX;
  const el = document.getElementById("painel");
  const k = new URLSearchParams(location.search).get("k") || "";
  let dados = [];
  let mostrarAlunos = false;
  let aberto = null;
  let primeiraVez = true;

  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);

  async function carregar() {
    try {
      const r = await fetch(`/api/respostas?k=${encodeURIComponent(k)}`, { cache: "no-store" });
      if (r.status === 401) {
        el.innerHTML = `<h2>Acesso restrito</h2><p class="sub">Abra o painel pelo link com a chave.</p>`;
        return false;
      }
      if (!r.ok) throw new Error();
      const d = await r.json();
      // Quem respondeu mais de uma vez conta só pela resposta mais recente.
      const porEmail = new Map();
      d.respostas.forEach((x) => {
        const chave = String(x.email || x.id).toLowerCase();
        const atual = porEmail.get(chave);
        if (!atual || x.criadoEm > atual.criadoEm) porEmail.set(chave, x);
      });
      dados = [...porEmail.values()]
        .sort((a, b) => (a.criadoEm < b.criadoEm ? -1 : 1))
        .map((x) => ({ ...x, calc: window.calcularRaiox(x.respostas) }));
      document.getElementById("atualizado").textContent = "Atualizado " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      render();
      return true;
    } catch (e) {
      document.getElementById("atualizado").textContent = "Sem conexão, tentando de novo…";
      return true;
    }
  }

  function render() {
    const n = dados.length;
    const contagem = {};
    const forcas = {};
    const media = {};
    R.ordemPadroes.forEach((p) => { contagem[p] = 0; forcas[p] = 0; media[p] = 0; });
    dados.forEach((d) => {
      contagem[d.calc.padrao]++;
      forcas[d.calc.forca]++;
      R.ordemPadroes.forEach((p) => { media[p] += d.calc.pct[p]; });
    });
    R.ordemPadroes.forEach((p) => { media[p] = n ? Math.round(media[p] / n) : 0; });
    const maxCont = Math.max(1, ...Object.values(contagem));

    const naoSabe = dados.filter((d) => !d.numeros || d.numeros.naoSei || !R.numeros.some((x) => d.numeros[x.k])).length;
    const familia = dados.filter((d) => d.familia === "Não sabe" || d.familia === "Sabe uma parte").length;
    const escondeu = dados.filter((d) => ["Já escondi", "Escondo hoje"].includes(d.segredo)).length;
    const negativo = dados.filter((d) => ["Negativo", "Não sei, não acompanho"].includes(d.perfil?.resultado3m)).length;
    const robo = dados.filter((d) => ["Uso em parte das operações", "Uso sempre"].includes(d.perfil?.robo)).length;
    const notas = dados.filter((d) => d.nota).map((d) => d.nota);
    const notaMedia = notas.length ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1).replace(".", ",") : "—";

    const linhas = (obj, total, max, sufixo) => R.ordemPadroes.map((p) => {
      const P = R.padroes[p];
      const v = obj[p];
      const largura = sufixo === "%" ? v : (v / max) * 100;
      const legenda = sufixo === "%" ? `intensidade média ${v}%` : `${v} ${v === 1 ? "aluno" : "alunos"} · ${pct(v, total)}%`;
      return `<div class="linha-padrao" title="${esc(P.nome)}: ${esc(legenda)}">
        <div class="nome">${esc(P.nome)}<small>${esc(legenda)}</small></div>
        <div class="trilho grosso"><i data-w="${Math.max(largura, v ? 2 : 0)}" style="background:${P.cor};width:${primeiraVez ? 0 : Math.max(largura, v ? 2 : 0)}%"></i></div>
      </div>`;
    }).join("");

    const tabela = mostrarAlunos ? `
      <div class="card"><h3>Alunos</h3><p class="aviso">Clique numa linha para ver as respostas abertas. Feche esta lista antes de compartilhar a tela.</p>
      <div class="tabela-wrap"><table>
        <thead><tr><th>Nome</th><th>Padrão</th><th>Força</th><th>Tempo</th><th>Últimos 3 meses</th><th>Nota</th></tr></thead>
        <tbody>${dados.map((d) => {
          const P = R.padroes[d.calc.padrao];
          const linha = `<tr class="aluno" data-id="${esc(d.id)}">
            <td>${esc(d.nome)}</td>
            <td><span class="tag"><i style="background:${P.cor}"></i>${esc(P.nome)}</span></td>
            <td>${esc(R.padroes[d.calc.forca].forca.nome)}</td>
            <td>${esc(d.perfil?.tempo)}</td>
            <td>${esc(d.perfil?.resultado3m)}</td>
            <td>${d.nota ?? "—"}</td></tr>`;
          if (aberto !== d.id) return linha;
          const nums = d.numeros?.naoSei ? "Não sabe os números" : R.numeros.filter((x) => d.numeros?.[x.k]).map((x) => `${x.q}: ${d.numeros[x.k]}`).join("\n") || "Não preencheu";
          const perfil = R.perfil.map((g) => `${g.q} ${Array.isArray(d.perfil?.[g.k]) ? d.perfil[g.k].join(", ") : d.perfil?.[g.k] || "—"}`).join("\n");
          return linha + `<tr class="detalhe"><td colspan="6"><dl>
            <dt>Contato</dt><dd>${esc(d.email)}${d.whatsapp ? " · " + esc(d.whatsapp) : ""}</dd>
            ${R.abertas.map((q) => `<dt>${esc(q.q)}</dt><dd>${esc(d.abertas?.[q.k] || "—")}</dd>`).join("")}
            <dt>${esc(R.familia.q)}</dt><dd>${esc(d.familia || "—")}</dd>
            <dt>${esc(R.segredo.q)}</dt><dd>${esc(d.segredo || "—")}</dd>
            <dt>Marco zero</dt><dd>${esc(nums)}</dd>
            <dt>Perfil</dt><dd>${esc(perfil)}</dd>
            <dt>Mapa</dt><dd>${R.ordemPadroes.map((p) => `${esc(R.padroes[p].nome)} ${d.calc.pct[p]}%`).join(" · ")}</dd>
            <dd><a href="/?r=${esc(d.id)}" target="_blank" rel="noopener" style="color:var(--brass)">Abrir o resultado deste aluno</a></dd>
            <dd><button class="link" data-apagar="${esc(d.id)}" style="color:var(--erro)">Apagar esta resposta</button></dd>
          </dl></td></tr>`;
        }).join("")}</tbody></table></div></div>` : "";

    el.innerHTML = `
      <div class="hero">
        <div><div class="rotulo">Aula inaugural</div><h1>RAIO-X <span class="ouro">DA ${esc(R.turma.toUpperCase())}</span></h1></div>
        <div class="total"><b>${n}</b><span>${n === 1 ? "aluno respondeu" : "alunos responderam"}</span></div>
      </div>
      <div class="grade">
        <div class="card"><div class="rotulo">Padrão predominante</div><h3>Quantos alunos em cada padrão</h3>${linhas(contagem, n, maxCont, "")}</div>
        <div class="card"><div class="rotulo">Forças da turma</div><h3>A força de cada um</h3>
          ${R.ordemPadroes.map((p) => `<div class="linha-padrao" style="grid-template-columns:1fr auto"><div class="nome">${esc(R.padroes[p].forca.nome)}</div><div style="font-variant-numeric:tabular-nums">${forcas[p]}</div></div>`).join("")}
        </div>
      </div>
      <div class="card"><div class="rotulo">Intensidade média</div><h3>Quanto cada padrão aparece na turma</h3>${linhas(media, n, 100, "%")}</div>
      <div class="tiles" style="margin-top:20px">
        <div class="tile"><b>${pct(naoSabe, n)}%</b><span>não sabem os próprios números</span></div>
        <div class="tile"><b>${pct(familia, n)}%</b><span>dizem que a família não sabe tudo do resultado</span></div>
        <div class="tile"><b>${pct(escondeu, n)}%</b><span>já esconderam uma perda de alguém da casa</span></div>
        <div class="tile"><b>${pct(negativo, n)}%</b><span>fecharam os últimos 3 meses no negativo ou não sabem</span></div>
        <div class="tile"><b>${pct(robo, n)}%</b><span>já usam robô ou automação</span></div>
        <div class="tile"><b>${notaMedia}</b><span>nota média para "o resultado faz sentido"</span></div>
      </div>
      <div class="ctrl">
        <button class="btn sec" id="alunos">${mostrarAlunos ? "Esconder alunos" : "Mostrar alunos (privado)"}</button>
        <button class="btn sec" id="revelar">Animar de novo</button>
      </div>
      ${tabela}
    `;

    el.querySelector("#alunos").addEventListener("click", () => { mostrarAlunos = !mostrarAlunos; aberto = null; render(); });
    el.querySelector("#revelar").addEventListener("click", () => { primeiraVez = true; render(); });
    el.querySelectorAll("tr.aluno").forEach((tr) => tr.addEventListener("click", () => { aberto = aberto === tr.dataset.id ? null : tr.dataset.id; render(); }));
    el.querySelectorAll("[data-apagar]").forEach((b) => b.addEventListener("click", async () => {
      const aluno = dados.find((x) => x.id === b.dataset.apagar);
      if (!confirm(`Apagar a resposta de ${aluno ? aluno.nome : "este aluno"}? Não dá para desfazer.`)) return;
      const r = await fetch(`/api/respostas?k=${encodeURIComponent(k)}&id=${encodeURIComponent(b.dataset.apagar)}`, { method: "DELETE" });
      if (!r.ok) return alert("Não consegui apagar. Tente de novo.");
      aberto = null;
      carregar();
    }));

    if (primeiraVez) {
      primeiraVez = false;
      requestAnimationFrame(() => setTimeout(() => {
        el.querySelectorAll(".trilho i").forEach((b) => { b.style.width = b.dataset.w + "%"; });
      }, 80));
    }
  }

  carregar().then((ok) => {
    if (ok) setInterval(() => { if (!document.hidden) carregar(); }, 10000);
  });
})();
