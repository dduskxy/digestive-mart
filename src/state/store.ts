import { FoodItem } from '../data/foods';

export type Stage = '01_Welcome' | '02_Hygiene' | '03_Supermarket' | '04_DigestionJourney' | '05_SummaryReport';

export interface GameState {
  stage: Stage;
  player: {
    name: string;
    avatar: string;
  };
  cart: FoodItem[];
  settings: {
    volume: number;
  };
  stats: {
    hp: number;
    xp: number;
    level: number;
    energy: number;
  };
  combo: {
    count: number;
    multiplier: number;
  };
  timer: {
    timeLeft: number;
    isRunning: boolean;
  };
  budget: number;
}

class Store {
  state: GameState;
  listeners: ((state: GameState) => void)[] = [];

  constructor() {
    this.state = this.getDefaultState();
  }

  private getDefaultState(): GameState {
    return {
      player: { name: '', avatar: '👦' },
      cart: [],
      stage: '01_Welcome',
      settings: { volume: 1 },
      stats: {
        hp: 100,
        xp: 0,
        level: 1,
        energy: 100,
      },
      combo: {
        count: 0,
        multiplier: 1.0,
      },
      timer: {
        timeLeft: 60,
        isRunning: false,
      },
      budget: 1000,
    };
  }

  subscribe(listener: (state: GameState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.state));
  }

  update(newStatePart: Partial<GameState>) {
    this.state = { ...this.state, ...newStatePart };
    this.notify();
  }

  setPlayer(name: string, avatar: string) {
    this.update({ player: { ...this.state.player, name, avatar } });
  }

  setStage(stage: Stage) {
    this.update({ stage });
  }

  addToCart(item: FoodItem) {
    if (this.state.cart.length < 5) {
      this.update({ cart: [...this.state.cart, item] });
    }
  }

  removeFromCart(index: number) {
    const newCart = [...this.state.cart];
    newCart.splice(index, 1);
    this.update({ cart: newCart });
  }

  clearCart() {
    this.update({ cart: [] });
  }

  // New actions for extended state
  updateStats(stats: Partial<GameState['stats']>) {
    this.update({ stats: { ...this.state.stats, ...stats } });
  }

  updateCombo(combo: Partial<GameState['combo']>) {
    this.update({ combo: { ...this.state.combo, ...combo } });
  }

  updateTimer(timer: Partial<GameState['timer']>) {
    this.update({ timer: { ...this.state.timer, ...timer } });
  }

  setBudget(budget: number) {
    this.update({ budget });
  }

  reset() {
    this.state = this.getDefaultState();
    this.notify();
  }
}

export const store = new Store();
