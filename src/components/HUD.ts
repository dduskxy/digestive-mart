import { store, GameState } from '../state/store';

export class HUD {
  private container: HTMLDivElement;
  private unsubscribe: () => void;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'fixed bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none z-40 gap-4 transition-opacity duration-300';
    
    // Initial render
    this.render(store.state);

    // Subscribe to store updates
    this.unsubscribe = store.subscribe((state) => {
      this.render(state);
    });
  }

  private render(state: GameState) {
    // Hide on '01_Welcome' and '05_SummaryReport'
    if (state.stage === '01_Welcome' || state.stage === '05_SummaryReport') {
        this.container.style.opacity = '0';
        this.container.style.pointerEvents = 'none';
        this.container.innerHTML = '';
        return;
    } else {
        this.container.style.opacity = '1';
    }

    const isSupermarket = state.stage === '03_Supermarket';

    // Timer logic color change
    let timerColor = 'text-green-400';
    if (state.timer.timeLeft <= 30) {
        timerColor = 'text-red-400 animate-pulse';
    } else if (state.timer.timeLeft <= 60) {
        timerColor = 'text-yellow-400';
    }

    const xpProgress = state.stats.xp % 100;

    this.container.innerHTML = `
      <!-- Left side: Stats (Compact & Beautiful) -->
      <div class="backdrop-blur-xl bg-black/40 p-4 rounded-3xl border-2 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 min-w-[200px] pointer-events-auto transition-transform hover:scale-105">
        
        <!-- Level Badge & XP -->
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 border-2 border-white shadow-[0_0_15px_rgba(250,204,21,0.6)] flex items-center justify-center flex-shrink-0">
                <span class="text-white font-black text-xl drop-shadow-md">${state.stats.level}</span>
            </div>
            <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-white/90 text-xs font-bold uppercase tracking-wider">Level</span>
                    <span class="text-yellow-300 text-xs font-black">XP ${state.stats.xp}</span>
                </div>
                <div class="w-full bg-black/60 h-2 rounded-full overflow-hidden shadow-inner border border-white/10">
                    <div class="bg-gradient-to-r from-yellow-200 to-yellow-500 h-full rounded-full transition-all duration-300" style="width: ${xpProgress}%"></div>
                </div>
            </div>
        </div>
        
        <div class="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-1"></div>
        
        <div class="space-y-2">
          <!-- HP Bar -->
          <div class="relative flex items-center gap-2">
            <span class="text-lg drop-shadow-md">❤️</span>
            <div class="flex-1 bg-black/60 h-4 rounded-full overflow-hidden border border-white/20 shadow-inner relative">
              <div class="bg-gradient-to-r from-red-600 via-red-500 to-pink-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.8)]" style="width: ${state.stats.hp}%"></div>
              <div class="absolute inset-0 flex justify-center items-center text-[10px] text-white font-black drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                ${state.stats.hp} / 100
              </div>
            </div>
          </div>

          <!-- Energy Bar -->
          <div class="relative flex items-center gap-2">
            <span class="text-lg drop-shadow-md">⚡</span>
            <div class="flex-1 bg-black/60 h-4 rounded-full overflow-hidden border border-white/20 shadow-inner relative">
              <div class="bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.8)]" style="width: ${state.stats.energy}%"></div>
              <div class="absolute inset-0 flex justify-center items-center text-[10px] text-white font-black drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                ${state.stats.energy} / 100
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Center: Timer & Combo -->
      <div class="flex flex-col items-center gap-3 mb-2 pointer-events-auto">
        <!-- Combo -->
        ${state.combo.count > 1 ? `
          <div class="backdrop-blur-md bg-gradient-to-r from-orange-500/90 to-red-600/90 px-6 py-1 rounded-full border-2 border-white shadow-[0_0_20px_rgba(255,100,0,0.9)] animate-bounce transform hover:scale-110 transition-transform cursor-default">
            <span class="text-2xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] italic">${state.combo.count}x COMBO! 🔥</span>
          </div>
        ` : '<div class="h-10"></div>'}
        
        <!-- Timer -->
        <div class="backdrop-blur-xl bg-black/50 px-8 py-3 rounded-2xl border-2 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-4 transition-transform hover:scale-105">
          <div class="flex items-center justify-center bg-black/40 rounded-full w-12 h-12 shadow-inner border border-white/10">
              <span class="text-2xl">⏱️</span>
          </div>
          <span class="text-5xl font-black ${timerColor} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-mono tracking-wider" style="font-family: 'Courier New', Courier, monospace;">
              ${this.formatTime(state.timer.timeLeft)}
          </span>
        </div>
      </div>

      <!-- Right side: Budget & Cart -->
      <div class="backdrop-blur-xl bg-black/40 p-5 rounded-3xl border-2 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-end justify-center min-w-[180px] pointer-events-auto transition-transform hover:scale-105 gap-2">
        <div class="flex flex-col items-end w-full">
            <span class="text-white/70 font-bold text-xs uppercase tracking-widest mb-1">Budget</span>
            <div class="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/10 shadow-inner w-full justify-end">
                <span class="text-2xl drop-shadow-md">🪙</span>
                <span class="text-green-400 font-black text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  ${state.budget}
                </span>
            </div>
        </div>
        
        ${isSupermarket ? `
        <div class="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-1"></div>
        <div class="flex flex-col items-end w-full">
            <span class="text-white/70 font-bold text-xs uppercase tracking-widest mb-1">Cart Items</span>
            <div class="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/10 shadow-inner w-full justify-end">
                <span class="text-xl drop-shadow-md">🛒</span>
                <span class="text-blue-300 font-black text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  ${state.cart?.length || 0}
                </span>
            </div>
        </div>
        ` : ''}
      </div>
    `;
  }

  private formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  public mount(parent: HTMLElement) {
    parent.appendChild(this.container);
  }

  public unmount() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.unsubscribe();
  }
}
