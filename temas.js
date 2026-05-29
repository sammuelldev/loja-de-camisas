/* ══════════════════════════════════════════════
   SISTEMA DE TEMAS POR LIGA — Arquibancada Store
   Cada liga tem sua identidade visual completa
══════════════════════════════════════════════ */

const temas = {

  todos: {
    nome: 'Arquibancada Store',
    cor:        '#00e676',
    cor2:       '#00c853',
    corRgb:     '0, 230, 118',
    bg:         '#080808',
    bgRgb:      '8, 8, 8',
    glow:       'rgba(0, 230, 118, 0.15)',
    glowForte:  'rgba(0, 230, 118, 0.35)',
    particula:  '#00e676',
    hero:       'hero-bg.jpg',
    heroPos:    'center',
  },

  premier: {
    nome: 'Premier League',
    cor:        '#7c3aed',
    cor2:       '#6d28d9',
    corRgb:     '124, 58, 237',
    bg:         '#07040f',
    bgRgb:      '7, 4, 15',
    glow:       'rgba(124, 58, 237, 0.15)',
    glowForte:  'rgba(124, 58, 237, 0.4)',
    particula:  '#7c3aed',
    hero:       'hero-premier.jpg',
    heroPos:    'center 30%',
  },

  laliga: {
    nome: 'La Liga',
    cor:        '#f59e0b',
    cor2:       '#d97706',
    corRgb:     '245, 158, 11',
    bg:         '#0f0900',
    bgRgb:      '15, 9, 0',
    glow:       'rgba(245, 158, 11, 0.15)',
    glowForte:  'rgba(245, 158, 11, 0.4)',
    particula:  '#f59e0b',
    hero:       'hero-laliga.jpg',
    heroPos:    'center 30%',
  },

  bundesliga: {
    nome: 'Bundesliga',
    cor:        '#ef4444',
    cor2:       '#dc2626',
    corRgb:     '239, 68, 68',
    bg:         '#0f0404',
    bgRgb:      '15, 4, 4',
    glow:       'rgba(239, 68, 68, 0.15)',
    glowForte:  'rgba(239, 68, 68, 0.4)',
    particula:  '#ef4444',
    hero:       'hero-bundesliga.jpg',
    heroPos:    'center 30%',
  },

  brasileirao: {
    nome: 'Brasileirão',
    cor:        '#22c55e',
    cor2:       '#16a34a',
    corRgb:     '34, 197, 94',
    bg:         '#020f05',
    bgRgb:      '2, 15, 5',
    glow:       'rgba(34, 197, 94, 0.15)',
    glowForte:  'rgba(34, 197, 94, 0.4)',
    particula:  '#22c55e',
    hero:       'hero-brasileirao.jpg',
    heroPos:    'center 30%',
  },

  seriea: {
    nome: 'Série A',
    cor:        '#3b82f6',
    cor2:       '#2563eb',
    corRgb:     '59, 130, 246',
    bg:         '#02040f',
    bgRgb:      '2, 4, 15',
    glow:       'rgba(59, 130, 246, 0.15)',
    glowForte:  'rgba(59, 130, 246, 0.4)',
    particula:  '#3b82f6',
    hero:       'hero-seriea.jpg',
    heroPos:    'center 30%',
  },

  ligue1: {
    nome: 'Ligue 1',
    cor:        '#06b6d4',
    cor2:       '#0891b2',
    corRgb:     '6, 182, 212',
    bg:         '#020a0f',
    bgRgb:      '2, 10, 15',
    glow:       'rgba(6, 182, 212, 0.15)',
    glowForte:  'rgba(6, 182, 212, 0.4)',
    particula:  '#06b6d4',
    hero:       'hero-ligue1.jpg',
    heroPos:    'center 30%',
  },

  selecoes: {
    nome: 'Seleções',
    cor:        '#eab308',
    cor2:       '#ca8a04',
    corRgb:     '234, 179, 8',
    bg:         '#0f0c00',
    bgRgb:      '15, 12, 0',
    glow:       'rgba(234, 179, 8, 0.15)',
    glowForte:  'rgba(234, 179, 8, 0.4)',
    particula:  '#eab308',
    hero:       'hero-selecoes.jpg',
    heroPos:    'center 30%',
  },

};

/* ══════════════════════
   APLICAR TEMA
══════════════════════ */
let temaAtual = 'todos';
let particulasInterval = null;

function aplicarTema(liga) {
  const tema = temas[liga] || temas.todos;
  temaAtual  = liga;
  const root = document.documentElement;

  // Fade out
  document.body.style.transition = 'background 0.8s ease';

  // Aplicar variáveis CSS
  root.style.setProperty('--green',      tema.cor);
  root.style.setProperty('--green2',     tema.cor2);
  root.style.setProperty('--cor-rgb',    tema.corRgb);
  root.style.setProperty('--bg',         tema.bg);
  root.style.setProperty('--bg-rgb',     tema.bgRgb);
  root.style.setProperty('--glow',       tema.glow);
  root.style.setProperty('--glow-forte', tema.glowForte);

  document.body.style.background = tema.bg;

  // Hero
  const heroBg = document.querySelector('.hero-bg');
  const heroOv = document.querySelector('.hero-overlay');
  if (heroBg) {
    heroBg.style.opacity = '0';
    setTimeout(() => {
      heroBg.style.backgroundImage    = `url('${tema.hero}')`;
      heroBg.style.backgroundPosition = tema.heroPos;
      heroBg.style.opacity = '1';
    }, 300);
  }
  if (heroOv) {
    heroOv.style.background = `linear-gradient(90deg,
      rgba(${tema.bgRgb}, 0.97) 0%,
      rgba(${tema.bgRgb}, 0.75) 45%,
      rgba(${tema.bgRgb}, 0.1) 100%)`;
  }

  // Label da liga ativa no hero
  atualizarLigaLabel(tema.nome, liga);

  // Partículas
  iniciarParticulas(tema.particula, liga);

  // Flash de transição
  flashTransicao(tema.cor);
}

/* ══════════════════════
   FLASH DE TRANSIÇÃO
══════════════════════ */
function flashTransicao(cor) {
  let flash = document.getElementById('ligaFlash');
  if (!flash) {
    flash = document.createElement('div');
    flash.id = 'ligaFlash';
    flash.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      pointer-events: none; opacity: 0;
      transition: opacity 0.15s ease;
    `;
    document.body.appendChild(flash);
  }
  flash.style.background = `radial-gradient(ellipse at center, ${cor}18 0%, transparent 70%)`;
  flash.style.opacity = '1';
  setTimeout(() => { flash.style.opacity = '0'; }, 400);
}

/* ══════════════════════
   LABEL DA LIGA NO HERO
══════════════════════ */
function atualizarLigaLabel(nome, liga) {
  let label = document.getElementById('heroLigaLabel');
  if (!label) return;
  if (liga === 'todos') {
    label.style.opacity = '0';
    return;
  }
  label.textContent = nome;
  label.style.opacity = '1';
  label.style.color = 'var(--green)';
}

/* ══════════════════════
   PARTÍCULAS
══════════════════════ */
function iniciarParticulas(cor, liga) {
  // Para partículas anteriores
  clearInterval(particulasInterval);
  const container = document.getElementById('particulas');
  if (!container) return;
  container.innerHTML = '';
  if (liga === 'todos') return;

  function criarParticula() {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 1;
    const x    = Math.random() * 100;
    const dur  = Math.random() * 6 + 4;
    const delay = Math.random() * 2;
    p.style.cssText = `
      position: absolute;
      left: ${x}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${cor};
      opacity: ${Math.random() * 0.5 + 0.1};
      animation: particulaSubir ${dur}s ${delay}s ease-in forwards;
      pointer-events: none;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), (dur + delay) * 1000);
  }

  // Criar partículas iniciais
  for (let i = 0; i < 12; i++) setTimeout(criarParticula, i * 150);

  // Continuar criando
  particulasInterval = setInterval(criarParticula, 600);
}