const WPP = '5581998628808';
const sizes = ['P', 'M', 'G', 'GG', 'XGG'];

let currentFilter = 'principais';
let currentSearch = '';
let selectedSize = '';
let currentProduct = null;
let qsIndex = 0;
const QS_TOTAL = 4;
let qsTimer = null;

/* ══════════════════════
   QUEM SOMOS CAROUSEL
══════════════════════ */
function goQS(index) {
  qsIndex = index;
  document.getElementById('qsTrack').style.transform = `translateX(-${qsIndex * 100}%)`;
  document.querySelectorAll('.qs-dot').forEach((d, i) => d.classList.toggle('active', i === qsIndex));
}

function slideQS(dir) {
  qsIndex = (qsIndex + dir + QS_TOTAL) % QS_TOTAL;
  goQS(qsIndex);
  resetQSTimer();
}

function resetQSTimer() {
  clearInterval(qsTimer);
  qsTimer = setInterval(() => slideQS(1), 6000);
}

/* ══════════════════════
   FILTER
══════════════════════ */
function getFiltered() {
  return produtos.filter(p => {
    const matchLiga = currentFilter === 'principais'
      ? p.tipo === 'Titular'
      : p.liga === currentFilter;
    const matchSearch = (p.time + ' ' + p.nome)
      .toLowerCase().includes(currentSearch.toLowerCase());
    return matchLiga && matchSearch;
  });
}

function setFilter(liga, btn) {
  currentFilter = liga;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  renderGrid();
}

function filterProducts() {
  currentSearch = document.getElementById('searchInput').value;
  renderGrid();
}

function scrollToCatalog() {
  setTimeout(() => document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' }), 100);
}

/* ══════════════════════
   RENDER
══════════════════════ */
function tipoLabel(tipo) {
  return tipo === 'Titular' ? 'Pra Encomenda' : tipo;
}

function renderGrid() {
  const list = getFiltered();
  const grid = document.getElementById('grid');
  document.getElementById('countLabel').textContent = `${list.length} produto${list.length !== 1 ? 's' : ''}`;

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:80px 0;color:#444;">
        <div style="font-size:48px;margin-bottom:16px;">🔍</div>
        <div style="font-size:16px;">Nenhum produto encontrado</div>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="card" onclick="openModal(${p.id})">
      <div class="card-img">
        <span class="liga-tag">${p.ligaLabel}</span>
        <span class="tipo-tag">${tipoLabel(p.tipo)}</span>
        <img src="${p.img}" alt="${p.time} - ${p.nome}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-team">${p.time}</div>
        <div class="card-name">${p.nome}</div>
        <div class="card-footer">
          <div>
            <div class="price-pix">R$ 99,99 <span class="price-label-small">no Pix</span></div>
            <div class="price-card">R$ 109,99 · até 3x no cartão</div>
          </div>
          <button class="btn-wpp" onclick="event.stopPropagation(); quickBuy(${p.id})">
            💬 Comprar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ══════════════════════
   MODAL
══════════════════════ */
function openModal(id) {
  currentProduct = produtos.find(p => p.id === id);
  selectedSize = '';
  document.getElementById('modalImg').src = currentProduct.img;
  document.getElementById('modalImg').alt = `${currentProduct.time} - ${currentProduct.nome}`;
  document.getElementById('modalLiga').textContent = currentProduct.ligaLabel;
  document.getElementById('modalTeam').textContent = currentProduct.time;
  document.getElementById('modalTitle').textContent = currentProduct.nome;
  document.getElementById('modalSizes').innerHTML = sizes.map(s =>
    `<button class="size-btn" onclick="selectSize('${s}', this)">${s}</button>`
  ).join('');
  updateWppBtn();
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function selectSize(s, btn) {
  selectedSize = s;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  updateWppBtn();
}

function updateWppBtn() {
  const p = currentProduct;
  const msg = encodeURIComponent(
    `Olá! Tenho interesse na seguinte camisa:\n\n` +
    `👕 *${p.time} - ${p.nome}*\n` +
    `📏 Tamanho: ${selectedSize || 'A definir'}\n\n` +
    `Poderia me passar mais informações?`
  );
  document.getElementById('modalWppBtn').href = `https://wa.me/${WPP}?text=${msg}`;
}

function quickBuy(id) {
  const p = produtos.find(x => x.id === id);
  const msg = encodeURIComponent(
    `Olá! Tenho interesse na seguinte camisa:\n\n` +
    `👕 *${p.time} - ${p.nome}*\n` +
    `📏 Tamanho: A definir\n\n` +
    `Poderia me passar mais informações?`
  );
  window.open(`https://wa.me/${WPP}?text=${msg}`, '_blank');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal')) closeModalBtn();
}

function closeModalBtn() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════
   INIT
══════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderGrid();
  resetQSTimer();
});