import './styles/main.css';
import { store, Stage } from './state/store';
import renderWelcome from './stages/01_Welcome';
import { renderHygiene } from './stages/02_Hygiene';
import { renderSupermarket } from './stages/03_Supermarket';
import renderDigestionJourney from './stages/04_DigestionJourney';
import { renderSummaryReport } from './stages/05_SummaryReport';
import { SoundManager } from './audio/SoundManager';
import { HUD } from './components/HUD';
import { Navbar } from './components/Navbar';

const app = document.getElementById('app')!;

// ─── Persistent UI ───────────────────────────────────────────────────────────
const navbar = new Navbar();
const hud = new HUD();
navbar.mount(document.body);
hud.mount(document.body);

// ─── Stage → body class map ───────────────────────────────────────────────────
const STAGE_CLASS: Record<Stage, string> = {
  '01_Welcome':         'stage-welcome',
  '02_Hygiene':         'stage-hygiene',
  '03_Supermarket':     'stage-supermarket',
  '04_DigestionJourney':'stage-digestion',
  '05_SummaryReport':   'stage-summary',
};

// ─── Transition type per route ────────────────────────────────────────────────
const TRANSITIONS: Partial<Record<Stage, string>> = {
  '02_Hygiene':          'slide-up',
  '03_Supermarket':      'slide-right',
  '04_DigestionJourney': 'zoom-in',
  '05_SummaryReport':    'fade-scale',
};

// ─── Inject transition styles once ───────────────────────────────────────────
(function injectStyles() {
  const s = document.createElement('style');
  s.textContent = `
    #app { position:relative; width:100%; min-height:100vh; overflow-x:hidden; }

    /* exit */
    .tx-exit { animation: txExit 350ms ease-in forwards; }
    /* entrances */
    .tx-slide-up   { animation: txSlideUp   420ms cubic-bezier(.22,1,.36,1) forwards; }
    .tx-slide-right{ animation: txSlideRight 420ms cubic-bezier(.22,1,.36,1) forwards; }
    .tx-zoom-in    { animation: txZoomIn    420ms cubic-bezier(.22,1,.36,1) forwards; }
    .tx-fade-scale { animation: txFadeScale 450ms ease forwards; }
    .tx-fade       { animation: txFade      350ms ease forwards; }

    @keyframes txExit        { to { opacity:0; transform:scale(.96); } }
    @keyframes txSlideUp     { from { opacity:0; transform:translateY(48px); } to { opacity:1; transform:translateY(0); } }
    @keyframes txSlideRight  { from { opacity:0; transform:translateX(-48px); } to { opacity:1; transform:translateX(0); } }
    @keyframes txZoomIn      { from { opacity:0; transform:scale(.9); } to { opacity:1; transform:scale(1); } }
    @keyframes txFadeScale   { from { opacity:0; transform:scale(1.06); } to { opacity:1; transform:scale(1); } }
    @keyframes txFade        { from { opacity:0; } to { opacity:1; } }
  `;
  document.head.appendChild(s);
})();

// ─── Loading spinner overlay ─────────────────────────────────────────────────
function showLoader(): HTMLElement {
  const loader = document.createElement('div');
  loader.id = '__stage-loader';
  loader.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:200;background:rgba(255,255,255,.15);backdrop-filter:blur(4px);pointer-events:none;';
  const spin = document.createElement('div');
  spin.style.cssText = 'font-size:52px;animation:spin 1.2s linear infinite;';
  spin.textContent = '🍽️';
  loader.appendChild(spin);
  document.body.appendChild(loader);
  return loader;
}

// ─── Stage renderer factory ───────────────────────────────────────────────────
function buildStage(stage: Stage): HTMLElement {
  switch (stage) {
    case '01_Welcome':          return renderWelcome();
    case '02_Hygiene':          return renderHygiene();
    case '03_Supermarket':      return renderSupermarket();
    case '04_DigestionJourney': return renderDigestionJourney();
    case '05_SummaryReport':    return renderSummaryReport();
    default:                    return renderWelcome();
  }
}

// ─── Core mount function ──────────────────────────────────────────────────────
let transitioning = false;

async function mountStage(stage: Stage, isFirst = false) {
  if (transitioning) return;
  transitioning = true;

  // Update body class for global CSS targeting
  Object.values(STAGE_CLASS).forEach(c => document.body.classList.remove(c));
  document.body.classList.add(STAGE_CLASS[stage]);

  const txClass = TRANSITIONS[stage] ?? 'fade';
  const loader = showLoader();

  if (!isFirst) {
    // Exit animation on current content
    app.classList.add('tx-exit');
    await delay(300);
  }

  // Swap content
  try {
    const el = buildStage(stage);
    app.className = '';
    app.innerHTML = '';
    app.appendChild(el);

    // Entrance animation
    app.classList.add(`tx-${txClass}`);
    await delay(420);
    app.classList.remove(`tx-${txClass}`);
  } catch (err) {
    console.error('[DigestiveMart] Stage render failed:', err);
    const errEl = document.createElement('div');
    errEl.className = 'flex items-center justify-center h-screen text-red-500 font-bold text-2xl text-center p-8';
    errEl.textContent = '⚠️ เกิดข้อผิดพลาด กรุณารีเฟรชหน้า';
    app.innerHTML = '';
    app.appendChild(errEl);
  }

  loader.remove();
  transitioning = false;
}

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

// ─── Sound init on first interaction ─────────────────────────────────────────
let soundInitialized = false;
window.addEventListener('click', () => {
  if (!soundInitialized) {
    SoundManager.init();
    soundInitialized = true;
  }
}, { once: true });

// ─── Subscribe to stage changes ───────────────────────────────────────────────
let lastStage = store.state.stage;
store.subscribe((state) => {
  if (state.stage !== lastStage) {
    lastStage = state.stage;
    mountStage(state.stage);
  }
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
async function boot() {
  // Remove initial-loader div from index.html if present
  document.getElementById('initial-loader')?.remove();
  await mountStage(store.state.stage, true);
}

boot();
