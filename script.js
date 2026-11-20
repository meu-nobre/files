// 1. Configuração: troque aqui o número e o ícone se precisar
const WHATSAPP = "5531997285481"; // código do país (55) + DDD + número
const ICONE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;

// 2. Dados: no futuro isso pode vir de uma API ou banco de dados
const produtos = [
  { id: 1, nome: "IT203",        marca: "Itaro",       tipo: "pneu", largura: 195, perfil: 55, aro: 15 },
  { id: 2, nome: "Comformax",    marca: "Itaro",       tipo: "pneu", largura: 205, perfil: 55, aro: 16 },
  { id: 3, nome: "Ecowing ES31", marca: "Kumho",       tipo: "pneu", largura: 185, perfil: 70, aro: 14 },
  { id: 4, nome: "F-600",        marca: "Firestone",   tipo: "pneu", largura: 175, perfil: 65, aro: 14 },
  { id: 5, nome: "Primacy 5",    marca: "Michelin",    tipo: "pneu", largura: 215, perfil: 50, aro: 17 },
  { id: 6, nome: "Dueler H/T",   marca: "Bridgestone", tipo: "pneu", largura: 265, perfil: 60, aro: 18 },
  { id: 7, nome: "Roda Esportiva Liga Leve", marca: "TK Wheels", tipo: "roda", aro: 15 },
  { id: 8, nome: "Roda Diamantada 5 Raios",  marca: "TK Wheels", tipo: "roda", aro: 17 },
];

// 3. Estado da página
const carrinho = {}; // { idDoProduto: quantidade }
const filtro = { tipo: "todos", largura: "", perfil: "", aro: "", texto: "" };

// 4. Utilidades
const $ = (seletor) => document.querySelector(seletor);
const medida = (p) => (p.tipo === "pneu" ? `${p.largura}/${p.perfil}R${p.aro}` : `Aro ${p.aro}`);

// Monta o link do WhatsApp com a mensagem já escrita para aquele produto
function linkWhatsApp(p) {
  const texto = `Olá! Quero consultar o preço do ${p.tipo === "pneu" ? "pneu" : "produto"} ${p.marca} ${p.nome} (${medida(p)}).`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

// 5. Mostrar produtos na tela
function renderProdutos() {
  const lista = produtos.filter((p) =>
    (filtro.tipo === "todos" || p.tipo === filtro.tipo) &&
    (!filtro.largura || p.largura == filtro.largura) &&
    (!filtro.perfil || p.perfil == filtro.perfil) &&
    (!filtro.aro || p.aro == filtro.aro) &&
    `${p.marca} ${p.nome} ${medida(p)}`.toLowerCase().includes(filtro.texto)
  );

  $("#grid").innerHTML = lista.map((p) => `
    <article class="card">
      <div class="thumb ${p.tipo}" role="img" aria-label="${p.tipo === "pneu" ? "Pneu" : "Roda"} ${p.marca} ${p.nome}"></div>
      <span class="marca">${p.marca}</span>
      <h3>${p.nome}</h3>
      <span class="medida-txt">${medida(p)}</span>
      <span class="consulta">Preço sob consulta</span>
      <div class="acoes">
        <button class="btn-add" data-adicionar="${p.id}">Adicionar ao carrinho</button>
        <a class="btn-wpp" href="${linkWhatsApp(p)}" target="_blank" rel="noopener">${ICONE} Consultar no WhatsApp</a>
      </div>
    </article>`).join("");

  $("#vazio").hidden = lista.length > 0;
}

// 6. Preencher os selects de medida com os valores existentes
function preencherSelect(id, campo) {
  const valores = [...new Set(produtos.map((p) => p[campo]).filter(Boolean))].sort((a, b) => a - b);
  $(id).insertAdjacentHTML("beforeend", valores.map((v) => `<option>${v}</option>`).join(""));
}
preencherSelect("#f-largura", "largura");
preencherSelect("#f-perfil", "perfil");
preencherSelect("#f-aro", "aro");

// 7. Carrinho (sem preços: a lista é enviada ao vendedor pelo WhatsApp)
function renderCarrinho() {
  const ids = Object.keys(carrinho);
  const qtd = ids.reduce((soma, id) => soma + carrinho[id], 0);
  const achar = (id) => produtos.find((x) => x.id == id);

  $("#itens").innerHTML = ids.length ? ids.map((id) => {
    const p = achar(id);
    return `<li>
      <span><b>${p.marca} ${p.nome}</b><br>${medida(p)}</span>
      <span class="qtd">
        <button data-menos="${id}" aria-label="Diminuir quantidade">−</button>
        <output>${carrinho[id]}</output>
        <button data-mais="${id}" aria-label="Aumentar quantidade">+</button>
      </span></li>`;
  }).join("") : "<li>Seu carrinho está vazio. Adicione produtos para pedir tudo de uma vez.</li>";

  const linhas = ids.map((id) => `- ${carrinho[id]}x ${achar(id).marca} ${achar(id).nome} (${medida(achar(id))})`);
  const mensagem = "Olá! Quero consultar preço e disponibilidade destes itens:\n" + linhas.join("\n");
  $("#enviar-pedido").href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  $("#enviar-pedido").hidden = !qtd;
  $("#limpar").hidden = !qtd;
  $("#contador").textContent = qtd;
}

function abrirCarrinho(abrir) {
  $("#gaveta").hidden = !abrir;
  $("#fundo").hidden = !abrir;
}

// 8. Eventos (o que acontece quando a pessoa clica)
$("#enviar-pedido").innerHTML = `${ICONE} Enviar lista ao vendedor`;

$("#grid").addEventListener("click", (e) => {
  const id = e.target.dataset.adicionar;
  if (!id) return;
  carrinho[id] = (carrinho[id] || 0) + 1;
  renderCarrinho();
  e.target.textContent = "Adicionado ✓";
  setTimeout(() => (e.target.textContent = "Adicionar ao carrinho"), 1200);
});

$("#itens").addEventListener("click", (e) => {
  const { mais, menos } = e.target.dataset;
  if (mais) carrinho[mais]++;
  if (menos && --carrinho[menos] <= 0) delete carrinho[menos];
  renderCarrinho();
});

$("#limpar").addEventListener("click", () => {
  Object.keys(carrinho).forEach((id) => delete carrinho[id]);
  renderCarrinho();
});
$("#abrir-carrinho").addEventListener("click", () => abrirCarrinho(true));
$("#fechar-carrinho").addEventListener("click", () => abrirCarrinho(false));
$("#fundo").addEventListener("click", () => abrirCarrinho(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && abrirCarrinho(false));

function escolherAba(tipo) {
  filtro.tipo = tipo;
  document.querySelectorAll("#abas button").forEach((b) => b.classList.toggle("ativa", b.dataset.tipo === tipo));
  renderProdutos();
}
$("#abas").addEventListener("click", (e) => e.target.dataset.tipo && escolherAba(e.target.dataset.tipo));
document.querySelectorAll("[data-tipo]:not(button)").forEach((a) =>
  a.addEventListener("click", () => escolherAba(a.dataset.tipo)));

$("#busca-medida").addEventListener("submit", (e) => {
  e.preventDefault();
  filtro.largura = $("#f-largura").value;
  filtro.perfil = $("#f-perfil").value;
  filtro.aro = $("#f-aro").value;
  renderProdutos();
  $("#produtos").scrollIntoView({ behavior: "smooth" });
});

$("#busca-texto").addEventListener("submit", (e) => {
  e.preventDefault();
  filtro.texto = $("#q").value.trim().toLowerCase();
  renderProdutos();
  $("#produtos").scrollIntoView({ behavior: "smooth" });
});

// 9. Começar
renderProdutos();
renderCarrinho();
