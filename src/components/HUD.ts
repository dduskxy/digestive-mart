import { store, GameState } from '../state/store';

export class HUD {
  private container: HTMLDivElement;
  private unsubscribe: () => void;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'fixed bottom-6 right-6 pointer-events-none z-40';
    
    // Initial render
    this.render(store.state);

    // Subscribe to store updates
    this.unsubscribe = store.subscribe((state) => {
      this.render(state);
    });
  }

  private render(state: GameState) {
    // Hide completely, Supermarket provides its own floating button now
    this.container.style.opacity = '0';
    this.container.style.pointerEvents = 'none';
    this.container.innerHTML = '';
    return;

    this.container.innerHTML = `
      <div class="glass-panel p-4 rounded-[28px] border border-white/70 flex items-center gap-3 pointer-events-auto transition-transform hover:scale-[1.02] shadow-[0_12px_24px_rgba(75,58,52,0.12)]">
        <span class="text-2xl sm:text-3xl">🛒</span>
        <div class="flex flex-col items-start">
          <span class="text-[#5d4645] font-bold text-xs uppercase tracking-[0.15em]">Items</span>
          <span class="text-[#4a7ef5] font-black text-2xl sm:text-3xl">${state.cart?.length || 0} / 5</span>
        </div>
      </div>
    `;
  }

  getElement(): HTMLDivElement {
    return this.container;
  }

  public mount(parent: HTMLElement) {
    parent.appendChild(this.container);
  }

  destroy() {
    this.unsubscribe();
  }
}
