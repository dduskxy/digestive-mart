import { store, GameState } from '../state/store';
import { SoundManager } from '../audio/SoundManager';

export class Navbar {
  private container: HTMLDivElement;
  private unsubscribe: () => void;
  private isMuted: boolean = false;
  private showSettings: boolean = false;
  private showPause: boolean = false;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'fixed top-0 left-0 right-0 z-50 pointer-events-auto flex flex-col items-center p-4 transition-all duration-300';
    
    this.render(store.state);

    this.unsubscribe = store.subscribe((state) => {
      this.render(state);
    });

    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('#btn-sound')) {
        this.isMuted = !this.isMuted;
        SoundManager.setMute(this.isMuted);
        this.render(store.state);
      }
      
      if (target.closest('#btn-settings')) {
        this.showSettings = true;
        this.render(store.state);
      }
      
      if (target.closest('#btn-close-settings')) {
        this.showSettings = false;
        this.render(store.state);
      }
      
      if (target.closest('#btn-pause')) {
        this.showPause = true;
        this.render(store.state);
      }

      if (target.closest('#btn-resume')) {
        this.showPause = false;
        this.render(store.state);
      }

      if (target.closest('#btn-restart')) {
        this.showPause = false;
        if (typeof store.reset === 'function') {
            store.reset();
        } else {
            // fallback if reset is not explicitly defined
            window.location.reload();
        }
        this.render(store.state);
      }

      if (target.closest('#btn-exit')) {
        this.showPause = false;
        if (typeof store.setStage === 'function') {
            store.setStage('01_Welcome');
        }
        this.render(store.state);
      }
    });

    this.container.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.id === 'volume-slider') {
        const vol = parseFloat(target.value);
        if (!this.isMuted) {
          SoundManager.setMasterVolume(vol);
        }
      }
    });
  }

  private getStageThaiName(stage: string): string {
    const names: Record<string, string> = {
      '01_Welcome': 'เมนูหลัก',
      '02_Hygiene': '🧼 ล้างมือ',
      '03_Supermarket': '🏪 ซูเปอร์มาร์เก็ต',
      '04_DigestionJourney': '🫁 การย่อยอาหาร',
      '05_SummaryReport': '🏆 สรุปผล'
    };
    return names[stage] || stage;
  }

  private getStageProgress(stage: string): number {
    const order = ['01_Welcome', '02_Hygiene', '03_Supermarket', '04_DigestionJourney', '05_SummaryReport'];
    const idx = order.indexOf(stage);
    return idx >= 0 ? (idx + 1) * 20 : 0;
  }

  private getStageColor(stage: string): string {
    const colors: Record<string, string> = {
      '01_Welcome': 'rgba(255,255,255,0.8)',
      '02_Hygiene': 'rgba(59,130,246,0.8)',
      '03_Supermarket': 'rgba(16,185,129,0.8)',
      '04_DigestionJourney': 'rgba(239,68,68,0.8)',
      '05_SummaryReport': 'rgba(245,158,11,0.8)'
    };
    return colors[stage] || 'rgba(255,255,255,0.8)';
  }

  private render(state: GameState) {
    const stageName = this.getStageThaiName(state.stage);
    const progress = this.getStageProgress(state.stage);
    const stageColor = this.getStageColor(state.stage);
    
    // Breadcrumbs
    const order = ['01_Welcome', '02_Hygiene', '03_Supermarket', '04_DigestionJourney', '05_SummaryReport'];
    const currentIndex = order.indexOf(state.stage);
    
    let dots = '';
    for (let i = 0; i < 5; i++) {
        if (i < currentIndex) {
            dots += `<div class="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>`;
        } else if (i === currentIndex) {
            dots += `<div class="w-4 h-4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] border-2 border-green-400"></div>`;
        } else {
            dots += `<div class="w-3 h-3 rounded-full bg-gray-400/50"></div>`;
        }
        if (i < 4) {
            dots += `<div class="w-6 h-1 bg-white/20 rounded-full"></div>`;
        }
    }

    const soundIcon = this.isMuted ? '🔇' : '🔊';

    let modals = '';
    if (this.showSettings) {
        modals += `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center">
            <div class="bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-md p-8 rounded-3xl border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.4)] max-w-sm w-full text-center">
                <h2 class="text-3xl font-black mb-6 text-indigo-900 drop-shadow-sm">⚙️ Settings</h2>
                <div class="mb-6 flex flex-col items-center">
                    <label class="text-lg font-bold text-gray-800 mb-2">Volume</label>
                    <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="1" class="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer">
                </div>
                <div class="mb-8 p-4 bg-indigo-100/80 rounded-xl text-indigo-800 text-sm font-semibold border border-indigo-200">
                    Theme: Digestion Mart 🍎
                </div>
                <button id="btn-close-settings" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 text-lg">Close</button>
            </div>
        </div>`;
    }

    if (this.showPause) {
        modals += `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center">
            <div class="bg-gradient-to-b from-purple-900/90 to-indigo-900/90 backdrop-blur-lg p-10 rounded-3xl border-4 border-white/50 shadow-[0_0_40px_rgba(167,139,250,0.6)] max-w-sm w-full text-center flex flex-col gap-4">
                <h2 class="text-4xl font-black mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">⏸ PAUSED</h2>
                <button id="btn-resume" class="bg-green-500 hover:bg-green-400 text-white font-bold py-4 px-6 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] transition-transform hover:scale-105 active:scale-95 text-xl">▶️ Resume</button>
                <button id="btn-restart" class="bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-6 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)] transition-transform hover:scale-105 active:scale-95 text-xl">🔄 Restart</button>
                <button id="btn-exit" class="bg-red-500 hover:bg-red-400 text-white font-bold py-4 px-6 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)] transition-transform hover:scale-105 active:scale-95 text-xl">🚪 Exit to Menu</button>
            </div>
        </div>`;
    }

    this.container.innerHTML = `
      <div class="w-full max-w-6xl mx-auto">
        <div class="w-full flex justify-between items-center px-6 py-3 backdrop-blur-xl bg-white/20 rounded-t-3xl rounded-b-xl border-t-4 border-l-4 border-r-4 border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
          
          <!-- Left side -->
          <div class="flex items-center gap-4 z-10">
            <div class="w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_\${stageColor}] border-4 border-white bg-white/40 transition-shadow duration-500" style="box-shadow: 0 0 20px \${stageColor};">
              \${state.player.avatar || '👦'}
            </div>
            <div class="flex flex-col">
              <span class="text-white font-black text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] tracking-wide">\${state.player.name || 'Player'}</span>
              <span class="text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-lg tracking-wider bg-black/30 px-3 py-1 rounded-full mt-1">\${stageName}</span>
            </div>
          </div>
          
          <!-- Center Dots -->
          <div class="flex items-center gap-2 z-10 hidden md:flex bg-black/20 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20 shadow-inner">
            \${dots}
          </div>

          <!-- Right Side -->
          <div class="flex items-center gap-4 z-10">
            <button id="btn-sound" class="w-14 h-14 rounded-full bg-white/30 hover:bg-white/50 border-2 border-white/70 transition-all shadow-md flex items-center justify-center text-2xl hover:scale-110 active:scale-95">
              \${soundIcon}
            </button>
            <button id="btn-settings" class="w-14 h-14 rounded-full bg-white/30 hover:bg-white/50 border-2 border-white/70 transition-all shadow-md flex items-center justify-center text-2xl hover:scale-110 active:scale-95">
              ⚙️
            </button>
            <button id="btn-pause" class="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 border-2 border-white transition-all shadow-[0_0_15px_rgba(100,100,255,0.6)] flex items-center justify-center text-white text-2xl hover:scale-110 active:scale-95 font-bold">
              ⏸
            </button>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full h-2 bg-black/30 rounded-b-3xl overflow-hidden border-b-2 border-l-2 border-r-2 border-white/30 backdrop-blur-md shadow-lg">
          <div class="h-full bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.8)]" style="width: \${progress}%"></div>
        </div>
      </div>
      \${modals}
    `;
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
