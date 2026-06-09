const WPP = '5581998628808';
const sizes = ['P', 'M', 'G', 'GG', 'XGG'];
const PER_PAGE = 12;

let currentFilter = 'todos';
let currentSearch = '';
let selectedSize = '';
let currentProduct = null;
let currentPage = 1;
let qsIndex = 0;
const QS_TOTAL = 4;
let qsTimer = null;
let galleryIndex = 0;

/* ══════════════════════
   CARRINHO
══════════════════════ */
let cart = [];

function addToCart(product, size) {
  if (!size) {
    showCartToast('⚠️ Selecione um tamanho primeiro');
    return;
  }
  const existing = cart.find(i => i.id === product.id && i.size === size);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: product.id, time: product.time, nome: product.nome, img: product.img, size, qty: 1, price: product.precoPix || 99.99 });
  }
  renderCart();
  openCart();
  showCartToast('✅ Adicionado ao carrinho!');
}

function removeFromCart(id, size) {
  cart = cart.filter(i => !(i.id === id && i.size === size));
  renderCart();
}

function changeQty(id, size, delta) {
  const item = cart.find(i => i.id === id && i.size === size);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id, size);
  else renderCart();
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function renderCart() {
  const el = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const badge = document.getElementById('cartBadge');
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? 'flex' : 'none';

  if (cart.length === 0) {
    el.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <div>Seu carrinho está vazio</div>
      </div>`;
    totalEl.textContent = 'R$ 0,00';
    return;
  }

  el.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.img}" alt="${item.nome}">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-team">${item.time}</div>
        <div class="cart-item-name">${item.nome}</div>
        <div class="cart-item-size">Tamanho: <strong>${item.size}</strong></div>
        <div class="cart-item-price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
        <div class="cart-item-qty">
          <button onclick="changeQty(${item.id}, '${item.size}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, '${item.size}', 1)">+</button>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id}, '${item.size}')">🗑</button>
        </div>
      </div>
    </div>
  `).join('');

  totalEl.textContent = `R$ ${cartTotal().toFixed(2).replace('.', ',')}`;
}

function buildCartMsg() {
  const lines = cart.map(i =>
    `👕 *${i.time} - ${i.nome}*\n   Tamanho: ${i.size} | Qtd: ${i.qty} | R$ ${(i.price * i.qty).toFixed(2).replace('.', ',')}`
  ).join('\n\n');
  const total = cartTotal().toFixed(2).replace('.', ',');
  return encodeURIComponent(
    `Olá! Gostaria de fazer o seguinte pedido:\n\n${lines}\n\n` +
    `💰 *Total no Pix: R$ ${total}*\n\n` +
    `Poderia me passar mais informações para finalizar?`
  );
}

function checkoutCart() {
  if (cart.length === 0) return;
  window.open(`https://wa.me/${WPP}?text=${buildCartMsg()}`, '_blank');
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function showCartToast(msg) {
  const t = document.getElementById('cartToast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

/* ══════════════════════
   MAPA DE LABELS
══════════════════════ */
const ligaLabels = {
  todos:       'TODOS OS PRODUTOS',
  brasileirao: 'BRASILEIRÃO',
  laliga:      'LA LIGA',
  premier:     'PREMIER LEAGUE',
  bundesliga:  'BUNDESLIGA',
  seriea:      'SÉRIE A',
  ligue1:      'LIGUE 1',
  selecoes:    'SELEÇÕES',
};

/* ══════════════════════
   HERO DINÂMICO
══════════════════════ */
const heroBgMap = {
  premier:     { img: 'hero-premier.jpg',     position: 'center 30%' },
  ligue1:      { img: 'hero-ligue1.jpg',      position: 'center 30%' },
  bundesliga:  { img: 'hero-bundesliga.jpg',  position: 'center 30%' },
  brasileirao: { img: 'hero-brasileirao.jpg', position: 'center 30%' },
  seriea:      { img: 'hero-seriea.jpg',      position: 'center 30%' },
  selecoes:    { img: 'hero-selecoes.jpg',    position: 'center 30%' },
  laliga:      { img: 'hero-laliga.jpg',      position: 'center 30%' },
};
const heroBgDefault = { img: 'hero-bg.jpg', position: 'center' };

function updateHeroBg(liga) {
  const config = heroBgMap[liga] || heroBgDefault;
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;
  bg.style.opacity = '0';
  setTimeout(() => {
    bg.style.backgroundImage    = `url('${config.img}')`;
    bg.style.backgroundPosition = config.position;
    bg.style.opacity = '1';
  }, 300);
}

/* ══════════════════════
   VISIBILIDADE
══════════════════════ */
function updateSectionsVisibility(liga) {
  const qs  = document.querySelector('.quem-somos');
  const wpp = document.querySelector('.wpp-notice');
  const show = liga === 'todos';
  if (qs)  qs.style.display  = show ? '' : 'none';
  if (wpp) wpp.style.display = show ? '' : 'none';
}

/* ══════════════════════
   TÍTULO DINÂMICO
══════════════════════ */
function updateCatalogTitle(liga) {
  const titleEl   = document.getElementById('catalogTitle');
  const eyebrowEl = document.getElementById('catalogEyebrow');
  if (liga === 'todos') {
    titleEl.textContent   = 'TODOS OS PRODUTOS';
    eyebrowEl.textContent = '🛍️ Catálogo';
  } else {
    titleEl.textContent   = ligaLabels[liga] || liga.toUpperCase();
    eyebrowEl.textContent = '🛍️ Produtos';
  }
}

/* ══════════════════════
   QUEM SOMOS SLIDER
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
    const matchLiga   = currentFilter === 'todos' ? true : p.liga === currentFilter;
    const matchSearch = (p.time + ' ' + p.nome).toLowerCase().includes(currentSearch.toLowerCase());
    return matchLiga && matchSearch;
  });
}

function setFilter(liga, btn) {
  currentFilter = liga;
  currentPage   = 1;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  updateHeroBg(liga);
  updateSectionsVisibility(liga);
  updateCatalogTitle(liga);
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  renderGrid();
}

function filterProducts() {
  currentSearch = document.getElementById('searchInput').value;
  currentPage   = 1;
  renderGrid();
}

function scrollToCatalog() {
  setTimeout(() => document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' }), 100);
}

/* ══════════════════════
   TIPO LABEL
══════════════════════ */
function tipoLabel(tipo) {
  if (tipo === 'ProntaEntrega') return 'Pronta Entrega';
  return 'Pra Encomenda';
}

/* ══════════════════════
   SKELETON
══════════════════════ */
function skeletonCard() {
  return `
    <div class="card-skeleton">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line long"></div>
        <div class="skeleton-line price"></div>
      </div>
    </div>`;
}

/* ══════════════════════
   RENDER GRID
══════════════════════ */
function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = Array(4).fill(skeletonCard()).join('');

  setTimeout(() => {
    const all        = getFiltered();
    const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * PER_PAGE;
    const list  = all.slice(start, start + PER_PAGE);

    document.getElementById('countLabel').textContent =
      `${all.length} produto${all.length !== 1 ? 's' : ''}`;

    if (all.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:80px 0;color:#444;">
          <div style="font-size:48px;margin-bottom:16px;">🔍</div>
          <div style="font-size:16px;">Nenhum produto encontrado</div>
        </div>`;
      renderPagination(0);
      return;
    }

    grid.innerHTML = list.map((p, i) => `
      <div class="card" style="animation-delay:${i * 60}ms" onclick="openModal(${p.id})">
        <div class="card-img">
          <span class="liga-tag">${p.ligaLabel}</span>
          <img src="${p.img}" alt="${p.time} - ${p.nome}" loading="lazy">
        </div>
        <div class="card-body">
          <div class="card-team">${p.time}</div>
          <div class="card-name">${p.nome}</div>
          <div class="card-tipo">${tipoLabel(p.tipo)}</div>
          <div class="card-footer">
            <div>
              <div class="price-pix">R$ ${p.precoPix.toFixed(2).replace('.',',')} <span class="price-label-small">no Pix</span></div>
              <div class="price-card">R$ ${p.precoCartao.toFixed(2).replace('.',',')} · até 3x no cartão</div>
            </div>
            <button class="btn-wpp" onclick="event.stopPropagation(); quickBuy(${p.id})">
              💬 Comprar
            </button>
          </div>
        </div>
      </div>
    `).join('');

    renderPagination(totalPages);
  }, 300);
}

/* ══════════════════════
   PAGINAÇÃO
══════════════════════ */
function renderPagination(totalPages) {
  const el = document.getElementById('pagination');
  if (totalPages <= 1) { el.innerHTML = ''; return; }
  let html = `<button class="page-btn arrow" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&#8592;</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  html += `<button class="page-btn arrow" onclick="goPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>&#8594;</button>`;
  el.innerHTML = html;
}

function goPage(page) {
  currentPage = page;
  renderGrid();
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

/* ══════════════════════
   PÁGINA DO PRODUTO
══════════════════════ */
const descricoes = {
  Home:         'A camisa que define a temporada. Identidade, história e qualidade em cada detalhe do tecido.',
  Away:         'Fora de casa, mas com a mesma garra. A camisa de quem joga em qualquer campo.',
  Retrô:        'Uma era que não se esquece. Cada fio carrega a memória de um futebol que marcou gerações.',
  ProntaEntrega:'Disponível agora. Qualidade premium, entrega ágil, atendimento humano do começo ao fim.',
};

const medidas = [
  { tam: 'P',   altura: '165–170', peito: '88–92',   cintura: '76–80' },
  { tam: 'M',   altura: '170–175', peito: '92–96',   cintura: '80–84' },
  { tam: 'G',   altura: '175–180', peito: '96–100',  cintura: '84–88' },
  { tam: 'GG',  altura: '180–185', peito: '100–104', cintura: '88–92' },
  { tam: 'XGG', altura: '185–190', peito: '104–110', cintura: '92–98' },
];

function openModal(id) {
  currentProduct = produtos.find(p => p.id === id);
  selectedSize   = '';
  galleryIndex   = 0;

  const p     = currentProduct;
  const descr = descricoes[p.tipo] || descricoes.Home;
  const imgs  = p.imgs || [p.img];

  const page = document.getElementById('productPage');
  page.innerHTML = `
    <div class="pp-inner">

      <button class="pp-close" onclick="closePage()">✕</button>

      <!-- GALERIA -->
      <div class="pp-gallery">
        <div class="pp-gallery-main" id="ppMain">
          <img id="ppMainImg" src="${imgs[0]}" alt="${p.time}" onclick="zoomImg(this)">
          <div class="pp-zoom-hint">🔍 clique para ampliar</div>
        </div>
        ${imgs.length > 1 ? `
        <div class="pp-thumbs" id="ppThumbs">
          ${imgs.map((src, i) => `
            <div class="pp-thumb ${i === 0 ? 'active' : ''}" onclick="setGalleryImg(${i})">
              <img src="${src}" alt="">
            </div>`).join('')}
        </div>` : ''}
      </div>

      <!-- INFOS -->
      <div class="pp-info">
        <div class="pp-liga">${p.ligaLabel}</div>
        <div class="pp-team">${p.time}</div>
        <h1 class="pp-title">${p.nome}</h1>
        <div class="pp-tipo">${tipoLabel(p.tipo)}</div>
        <p class="pp-descr">${descr}</p>

        <!-- PREÇOS -->
        <div class="pp-prices">
          <div class="pp-price-row">
            <span class="pp-price-label">💸 Pix</span>
            <span class="pp-price-val green">R$ ${(p.precoPix || 99.99).toFixed(2).replace('.',',')}</span>
          </div>
          <div class="pp-price-row">
            <span class="pp-price-label">💳 Cartão</span>
            <div>
              <span class="pp-price-val">R$ ${(p.precoCartao || 109.99).toFixed(2).replace('.',',')}</span>
              <span class="pp-price-sub">até 3x sem juros</span>
            </div>
          </div>
        </div>

        <!-- TAMANHOS -->
        <div class="pp-size-label">Escolha o tamanho</div>
        <div class="pp-sizes">
          ${sizes.map(s => `<button class="pp-size-btn" onclick="selectPageSize('${s}', this)">${s}</button>`).join('')}
        </div>

        <!-- TABELA DE MEDIDAS -->
        <details class="pp-medidas">
          <summary>📏 Tabela de medidas</summary>
          <table class="pp-table">
            <thead>
              <tr><th>Tam.</th><th>Altura (cm)</th><th>Peito (cm)</th><th>Cintura (cm)</th></tr>
            </thead>
            <tbody>
              ${medidas.map(m => `
                <tr><td>${m.tam}</td><td>${m.altura}</td><td>${m.peito}</td><td>${m.cintura}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </details>

        <!-- CAMPO DE NOME -->
        <div class="pp-name-wrap">
          <input type="text" id="ppName" class="pp-name-input"
            placeholder="Seu nome (opcional)" oninput="updatePageWppBtn()">
        </div>

        <!-- BOTÕES -->
        <div class="pp-actions">
          <button class="pp-cart-btn" onclick="handleAddToCart()">
            🛒 Adicionar ao carrinho
          </button>
          <a class="pp-wpp-btn" id="ppWppBtn" href="#" target="_blank">
            💬 Comprar pelo WhatsApp
          </a>
        </div>

        <!-- VOLTAR -->
        <button class="pp-back-btn" onclick="closePage()">← Voltar ao catálogo</button>
      </div>

    </div>

    <!-- ZOOM -->
    <div class="pp-zoom-overlay" id="ppZoom" onclick="closeZoom()">
      <img id="ppZoomImg" src="" alt="">
    </div>
  `;

  updatePageWppBtn();
  page.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function handleAddToCart() {
  if (!selectedSize) {
    showCartToast('⚠️ Selecione um tamanho primeiro');
    return;
  }
  addToCart(currentProduct, selectedSize);
}

function setGalleryImg(i) {
  galleryIndex = i;
  const imgs = currentProduct.imgs || [currentProduct.img];
  document.getElementById('ppMainImg').src = imgs[i];
  document.querySelectorAll('.pp-thumb').forEach((t, idx) => t.classList.toggle('active', idx === i));
}

function selectPageSize(s, btn) {
  selectedSize = s;
  document.querySelectorAll('.pp-size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.querySelectorAll('.pp-table tbody tr').forEach((tr, i) => {
    tr.classList.toggle('active-row', medidas[i]?.tam === s);
  });
  updatePageWppBtn();
}

function updatePageWppBtn() {
  const p    = currentProduct;
  if (!p) return;
  const nome = document.getElementById('ppName')?.value.trim() || '';
  const saudacao = nome ? `Olá, meu nome é *${nome}*!` : 'Olá!';
  const msg  = encodeURIComponent(
    `${saudacao} Tenho interesse na seguinte camisa:\n\n` +
    `👕 *${p.time} - ${p.nome}*\n` +
    `📏 Tamanho: ${selectedSize || 'A definir'}\n\n` +
    `Poderia me passar mais informações?`
  );
  const btn = document.getElementById('ppWppBtn');
  if (btn) btn.href = `https://wa.me/${WPP}?text=${msg}`;
}

function zoomImg(img) {
  const zoom = document.getElementById('ppZoom');
  document.getElementById('ppZoomImg').src = img.src;
  zoom.classList.add('open');
}
function closeZoom() {
  document.getElementById('ppZoom')?.classList.remove('open');
}

function closePage() {
  document.getElementById('productPage').classList.remove('open');
  document.body.style.overflow = '';
}

function quickBuy(id) {
  const p   = produtos.find(x => x.id === id);
  const msg = encodeURIComponent(
    `Olá! Tenho interesse na seguinte camisa:\n\n` +
    `👕 *${p.time} - ${p.nome}*\n` +
    `📏 Tamanho: A definir\n\n` +
    `Poderia me passar mais informações?`
  );
  window.open(`https://wa.me/${WPP}?text=${msg}`, '_blank');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal')) closePage();
}
function closeModalBtn() { closePage(); }

/* ══════════════════════
   TECLADO
══════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeZoom(); closePage(); closeCart(); }
});

/* ══════════════════════
   INIT
══════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderGrid();
  renderCart();
  resetQSTimer();
});