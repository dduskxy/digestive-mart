class Store {
  constructor() {
    this.state = {
      player: {
        name: localStorage.getItem('dm_playerName') || '',
        avatar: localStorage.getItem('dm_playerAvatar') || '🙂',
      },
      stats: {
        immunity: parseInt(localStorage.getItem('dm_immunity')) || 50,
        germRisk: parseInt(localStorage.getItem('dm_germRisk')) || 0,
        energy: 0,
        fiber: 0,
        acidLevel: 50, // 0 to 100
        water: 50, // 0 to 100
        score: 0,
      },
      cart: [], // max 4 items
      stage: '01_Welcome', // Current game stage
      digestionProgress: {
        chews: 0,
        swallowed: false,
        digested: false,
        absorbed: 0,
        excreted: false
      }
    };
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  update(newStatePart) {
    this.state = {
      ...this.state,
      ...newStatePart
    };
    this.notify();
  }

  // Specific Actions
  setPlayer(name, avatar) {
    localStorage.setItem('dm_playerName', name);
    localStorage.setItem('dm_playerAvatar', avatar);
    this.update({ player: { name, avatar } });
  }

  updateStat(key, value) {
    const newStats = { ...this.state.stats, [key]: value };
    // Persist basic stats
    if (key === 'immunity') localStorage.setItem('dm_immunity', value);
    if (key === 'germRisk') localStorage.setItem('dm_germRisk', value);
    
    this.update({ stats: newStats });
  }
  
  incrementStat(key, amount) {
    this.updateStat(key, Math.max(0, Math.min(100, this.state.stats[key] + amount)));
  }

  addToCart(item) {
    if (this.state.cart.length < 4) {
      this.update({ cart: [...this.state.cart, item] });
    }
  }

  removeFromCart(itemId) {
    this.update({ cart: this.state.cart.filter(i => i.id !== itemId) });
  }

  clearCart() {
    this.update({ cart: [] });
  }

  setStage(stageName) {
    this.update({ stage: stageName });
  }
  
  resetDigestion() {
    this.update({
      digestionProgress: {
        chews: 0,
        swallowed: false,
        digested: false,
        absorbed: 0,
        excreted: false
      }
    });
  }
}

export const store = new Store();
