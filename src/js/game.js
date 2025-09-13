// Sweetwater Arcade - Main Game Engine
class SweetwaterArcade {
  constructor() {
    this.currentStage = 'title';
    this.gameState = {
      score: 0,
      awareness: 1.2, // Baseline from Marketing
      timer: 0,
      currentPersona: null,
      selectedUpgrade: null,
      stageStartTime: 0
    };
    
    this.configs = {};
    this.stages = {};
    
    this.init();
  }
  
  async init() {
    console.log('🎮 Sweetwater Arcade - Initializing...');
    
    // Load configs
    await this.loadConfigs();
    
    // Initialize stages
    this.initStages();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Show title screen
    this.showTitleScreen();
    
    console.log('✅ Game initialized successfully');
  }
  
  async loadConfigs() {
    try {
      const [marketing, personas, upgrades] = await Promise.all([
        fetch('./sweetwater-arcade-speckit-v2/config/marketing.json').then(r => r.json()),
        fetch('./sweetwater-arcade-speckit-v2/config/personas.json').then(r => r.json()),
        fetch('./sweetwater-arcade-speckit-v2/config/upgrades.json').then(r => r.json())
      ]);
      
      this.configs = { marketing, personas, upgrades };
      console.log('✅ Configs loaded:', this.configs);
    } catch (error) {
      console.error('❌ Failed to load configs:', error);
    }
  }
  
  initStages() {
    this.stages = {
      title: new TitleStage(this),
      marketing: new MarketingStage(this),
      wildCustomer: new WildCustomerStage(this),
      sales: new SalesStage(this),
      merch: new MerchStage(this),
      itHub: new ITHubStage(this),
      warehouse: new WarehouseStage(this),
      celebration: new CelebrationStage(this)
    };
  }
  
  setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      this.handleKeyPress(e);
    });
    
    // Menu button clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-item')) {
        this.handleMenuClick(e.target);
      }
    });
  }
  
  handleKeyPress(e) {
    const stage = this.stages[this.currentStage];
    if (stage && stage.handleKeyPress) {
      stage.handleKeyPress(e);
    }
  }
  
  handleMenuClick(button) {
    const action = button.dataset.action;
    
    switch (action) {
      case 'start':
        this.startGame();
        break;
      case 'credits':
        this.showCredits();
        break;
      case 'back':
        this.showTitleScreen();
        break;
    }
  }
  
  showTitleScreen() {
    this.currentStage = 'title';
    document.querySelector('.title-screen').style.display = 'flex';
    document.querySelector('.game-screen').style.display = 'none';
    
    // Reset game state
    this.gameState = {
      score: 0,
      awareness: this.configs.marketing?.baselineMultiplier || 1.2,
      timer: 0,
      currentPersona: null,
      selectedUpgrade: null,
      stageStartTime: 0
    };
    
    this.updateHUD();
  }
  
  startGame() {
    console.log('🚀 Starting Sweetwater Arcade...');
    this.currentStage = 'marketing';
    document.querySelector('.title-screen').style.display = 'none';
    document.querySelector('.game-screen').style.display = 'flex';
    
    this.stages.marketing.start();
  }
  
  showCredits() {
    // TODO: Implement credits screen
    console.log('📜 Credits screen - coming soon');
  }
  
  nextStage() {
    const stageOrder = [
      'marketing', 'wildCustomer', 'sales', 'merch', 'itHub', 'warehouse', 'celebration'
    ];
    
    const currentIndex = stageOrder.indexOf(this.currentStage);
    if (currentIndex < stageOrder.length - 1) {
      this.currentStage = stageOrder[currentIndex + 1];
      this.stages[this.currentStage].start();
    } else {
      // Game complete, back to title
      this.showTitleScreen();
    }
  }
  
  updateHUD() {
    document.querySelector('.timer').textContent = `${Math.floor(this.gameState.timer)}s`;
    document.querySelector('.score').textContent = `${this.gameState.score}`;
    
    const awarenessPercent = Math.min((this.gameState.awareness - 1) * 100, 100);
    document.querySelector('.awareness-fill').style.width = `${awarenessPercent}%`;
  }
  
  addScore(points) {
    this.gameState.score += Math.floor(points * this.gameState.awareness);
    this.updateHUD();
  }
  
  updateAwareness(amount) {
    this.gameState.awareness = Math.min(this.gameState.awareness + amount, 3.0);
    this.updateHUD();
    
    // Visual feedback for awareness bumps
    if (amount > 0) {
      document.querySelector('.awareness-bar').style.boxShadow = '0 0 20px var(--sw-gold)';
      setTimeout(() => {
        document.querySelector('.awareness-bar').style.boxShadow = 'none';
      }, 500);
    }
  }
  
  selectRandomPersona() {
    const personas = this.configs.personas || [];
    const availablePersonas = personas.filter(p => p.personaId !== this.gameState.currentPersona?.personaId);
    const randomPersona = availablePersonas[Math.floor(Math.random() * availablePersonas.length)];
    
    this.gameState.currentPersona = randomPersona || personas[0];
    console.log('👤 Selected persona:', this.gameState.currentPersona);
    
    return this.gameState.currentPersona;
  }
}

// Stage Classes (Basic implementations)
class TitleStage {
  constructor(game) {
    this.game = game;
  }
}

class MarketingStage {
  constructor(game) {
    this.game = game;
  }
  
  start() {
    console.log('📢 Marketing Stage - Starting...');
    // TODO: Implement text crawl and multiplier gift
    setTimeout(() => {
      this.game.nextStage();
    }, 2000);
  }
}

class WildCustomerStage {
  constructor(game) {
    this.game = game;
  }
  
  start() {
    console.log('👤 Wild Customer Stage - Starting...');
    this.game.selectRandomPersona();
    // TODO: Show customer sprite and flash/zoom
    setTimeout(() => {
      this.game.nextStage();
    }, 2000);
  }
}

class SalesStage {
  constructor(game) {
    this.game = game;
  }
  
  start() {
    console.log('🛒 Sales Stage (Snake) - Starting...');
    // TODO: Implement Snake game
    setTimeout(() => {
      this.game.nextStage();
    }, 5000);
  }
}

class MerchStage {
  constructor(game) {
    this.game = game;
  }
  
  start() {
    console.log('📦 Merch Stage (Tetris) - Starting...');
    // TODO: Implement Tetris game
    setTimeout(() => {
      this.game.nextStage();
    }, 5000);
  }
}

class ITHubStage {
  constructor(game) {
    this.game = game;
  }
  
  start() {
    console.log('💻 IT Hub Stage - Starting...');
    // TODO: Implement upgrade selection
    setTimeout(() => {
      this.game.nextStage();
    }, 3000);
  }
}

class WarehouseStage {
  constructor(game) {
    this.game = game;
  }
  
  start() {
    console.log('🏭 Warehouse Stage (Frogger) - Starting...');
    // TODO: Implement Frogger game
    setTimeout(() => {
      this.game.nextStage();
    }, 5000);
  }
}

class CelebrationStage {
  constructor(game) {
    this.game = game;
  }
  
  start() {
    console.log('🎉 Celebration Stage - Starting...');
    // TODO: Implement celebration screen
    setTimeout(() => {
      this.game.showTitleScreen();
    }, 5000);
  }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.game = new SweetwaterArcade();
});
