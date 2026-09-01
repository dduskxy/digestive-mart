import { FoodItem } from '../data/foods';

export type Stage = '01_Welcome' | '02_Hygiene' | '03_Supermarket' | '04_DigestionJourney' | '05_SummaryReport';

export interface GameState {
  stage: Stage;
  player: {
    name: string;
    avatar: string;
    avatarImage?: string; // base64 selfie from camera or null
  };
  cart: FoodItem[];
  settings: {
    volume: number;
    cameraEnabled: boolean; // global toggle for ALL camera features
    cameraSensitivity: number; // 0.5 to 2.0, affects gesture detection
  };
  camera: {
    permissionStatus: 'unknown' | 'granted' | 'denied' | 'prompt';
    consentShown: boolean; // track if ConsentModal has been shown
    isActive: boolean; // whether camera stream is currently running
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
  hygiene: {
    cleanlinessScore: number; // 0-100, affects stage 4 difficulty
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
        cameraEnabled: false, // default to off until user consents
        cameraSensitivity: 1.0,
      },
      camera: {
        permissionStatus: 'unknown',
        consentShown: false,
        isActive: false,
      },
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
      hygiene: {
        cleanlinessScore: 50, // default mid-range; improved by stage 2
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

  // Camera & Settings Management
  setCameraConsent(consented: boolean) {
    this.update({
      settings: { ...this.state.settings, cameraEnabled: consented },
      camera: { ...this.state.camera, consentShown: true, permissionStatus: consented ? 'granted' : 'denied' },
    });
    // Persist to localStorage
    localStorage.setItem('digestive-mart-camera-consent', JSON.stringify({
      cameraEnabled: consented,
      timestamp: Date.now(),
    }));
  }

  setCameraPermission(status: 'granted' | 'denied' | 'prompt') {
    this.update({ camera: { ...this.state.camera, permissionStatus: status } });
  }

  setConsentShown(shown: boolean) {
    this.update({ camera: { ...this.state.camera, consentShown: shown } });
  }

  setCameraActive(active: boolean) {
    this.update({ camera: { ...this.state.camera, isActive: active } });
  }

  setCameraSensitivity(sensitivity: number) {
    this.update({ settings: { ...this.state.settings, cameraSensitivity: Math.max(0.5, Math.min(2.0, sensitivity)) } });
  }

  setAvatarImage(imageData: string) {
    this.update({ player: { ...this.state.player, avatarImage: imageData } });
  }

  updateHygiene(cleanlinessScore: number) {
    this.update({ hygiene: { cleanlinessScore: Math.max(0, Math.min(100, cleanlinessScore)) } });
  }

  reset() {
    this.state = this.getDefaultState();
    this.notify();
  }
}

export const store = new Store();
