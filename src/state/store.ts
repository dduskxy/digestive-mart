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
    language: 'th' | 'en'; // Thai or English
  };
  progress: {
    stageScores: Record<Stage, number>; // 0-100 score for each stage
    cleanlinessScore: number; // 0-100, affects digestion journey difficulty
    totalScore: number; // cumulative across all stages
  };
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
      settings: { 
        volume: 1,
        language: 'th',
      },
      progress: {
        stageScores: {
          '01_Welcome': 0,
          '02_Hygiene': 0,
          '03_Supermarket': 0,
          '04_DigestionJourney': 0,
          '05_SummaryReport': 0,
        },
        cleanlinessScore: 50,
        totalScore: 0,
      },
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



  // Education & Progress Management
  setStageScore(stage: Stage, score: number) {
    const clampedScore = Math.max(0, Math.min(100, score));
    this.update({
      progress: {
        ...this.state.progress,
        stageScores: { ...this.state.progress.stageScores, [stage]: clampedScore },
      },
    });
    this.recalculateTotalScore();
  }

  updateCleanlinessScore(score: number) {
    const next = Math.max(0, Math.min(100, score));
    this.update({
      progress: { ...this.state.progress, cleanlinessScore: next },
    });
    this.recalculateTotalScore();
  }

  private recalculateTotalScore() {
    const scores = Object.values(this.state.progress.stageScores);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const weighted = Math.round((avg * 0.8) + (this.state.progress.cleanlinessScore * 0.2));
    this.update({
      progress: { ...this.state.progress, totalScore: Math.max(0, Math.min(100, weighted)) },
    });
  }

  setLanguage(lang: 'th' | 'en') {
    this.update({ settings: { ...this.state.settings, language: lang } });
    localStorage.setItem('digestive-mart-language', lang);
  }

  reset() {
    this.state = this.getDefaultState();
    this.notify();
  }
}

export const store = new Store();
