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
        <div class="fixed inset-0 bg-slate-900/55 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
            <div class="glass-panel w-full max-w-md rounded-[32px] p-7">
                <h2 class="text-3xl font-black mb-6 text-[#3d2a2a]">⚙️ ตั้งค่า</h2>
                <div class="mb-6 flex flex-col items-center">
                    <label class="text-lg font-bold text-[#5d4645] mb-2">ระดับเสียง</label>
                    <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="1" class="w-full accent-[#ff7c6b]">
                </div>
                <div class="mb-8 rounded-2xl bg-[#fff3ef] text-[#6e473d] border border-[#f8d9cf] px-4 py-3 text-sm font-semibold">
                    Theme: Digestion Mart 🍎
                </div>
                <button id="btn-close-settings" class="bg-gradient-to-r from-[#ff7c6b] to-[#ff9c62] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-[1.02] active:scale-95 text-lg">ปิด</button>
            </div>
        </div>`;
    }

    if (this.showPause) {
        modals += `
        <div class="fixed inset-0 bg-slate-900/55 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
            <div class="glass-panel w-full max-w-sm rounded-[32px] p-7 text-center">
                <h2 class="text-4xl font-black mb-6 text-[#3d2a2a]">⏸ หยุดชั่วคราว</h2>
                <div class="flex flex-col gap-3">
                  <button id="btn-resume" class="bg-gradient-to-r from-[#4ec28d] to-[#3ebc7c] text-white font-bold py-3 px-6 rounded-full shadow-[0_10px_20px_rgba(78,194,141,0.3)] transition-transform hover:scale-[1.02] active:scale-95 text-xl">▶️ ดำเนินการต่อ</button>
                  <button id="btn-restart" class="bg-gradient-to-r from-[#f7b32d] to-[#ef9d12] text-white font-bold py-3 px-6 rounded-full shadow-[0_10px_20px_rgba(247,179,45,0.25)] transition-transform hover:scale-[1.02] active:scale-95 text-xl">🔄 เริ่มใหม่</button>
                  <button id="btn-exit" class="bg-gradient-to-r from-[#ef5d5d] to-[#d94a4a] text-white font-bold py-3 px-6 rounded-full shadow-[0_10px_20px_rgba(239,93,93,0.25)] transition-transform hover:scale-[1.02] active:scale-95 text-xl">🚪 กลับเมนู</button>
                </div>
            </div>
        </div>`;
    }

    // If in welcome screen, don't show the navbar at all
    if (state.stage === '01_Welcome') {
        this.container.style.display = 'none';
        return;
    } else {
        this.container.style.display = 'flex';
    }

    this.container.innerHTML = `
      <div class="w-full max-w-6xl mx-auto flex items-start pointer-events-none mt-2 px-4">
        <div class="flex-1"></div>
        <div class="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/70 border border-white/60 shadow-sm backdrop-blur-md pointer-events-auto shrink-0">
          <span class="font-bold text-[#5f483f]">${stageName}</span>
          <div class="flex items-center gap-2">
            ${dots}
          </div>
        </div>
        <div class="flex-1 flex justify-end items-center gap-2 pointer-events-auto">
          <!-- Settings and Pause buttons removed as requested -->
        </div>
      </div>
      ${modals}
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
