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
    this.stageDuration = 8000; // 8 seconds total
    this.startTime = 0;
  }
  
  start() {
    console.log('📢 Marketing Stage - Starting...');
    this.startTime = Date.now();
    
    // Create marketing stage content
    const stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = `
      <div class="marketing-stage">
        <div class="marketing-content">
          <h2 class="marketing-title">🎯 Marketing Mentor</h2>
          <div class="text-crawl">
            <p>Welcome to Sweetwater Arcade! You're about to help customers find their perfect gear.</p>
            <p>Each customer has unique needs - from bedroom producers to touring professionals.</p>
            <p>Your awareness and skill will guide them to the right solutions.</p>
          </div>
          <div class="multiplier-gift">
            <div class="multiplier-text">Baseline Multiplier Gift</div>
            <div class="multiplier-value">×${this.game.configs.marketing?.baselineMultiplier || 1.2}</div>
          </div>
          <div class="continue-prompt">Press SPACE to continue...</div>
        </div>
      </div>
    `;
    
    // Update awareness with baseline multiplier
    this.game.updateAwareness(0); // This will set it to baseline
    
    // Start timer
    this.startTimer();
    
    // Setup keyboard listener for this stage
    this.setupKeyboardListener();
  }
  
  setupKeyboardListener() {
    this.keyHandler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.completeStage();
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  }
  
  startTimer() {
    const updateTimer = () => {
      const elapsed = Date.now() - this.startTime;
      const remaining = Math.max(0, this.stageDuration - elapsed);
      
      this.game.gameState.timer = remaining / 1000;
      this.game.updateHUD();
      
      if (remaining > 0) {
        requestAnimationFrame(updateTimer);
      } else {
        // Auto-advance if time runs out
        this.completeStage();
      }
    };
    
    requestAnimationFrame(updateTimer);
  }
  
  completeStage() {
    console.log('📢 Marketing Stage - Complete!');
    
    // Remove keyboard listener
    document.removeEventListener('keydown', this.keyHandler);
    
    // Apply baseline multiplier
    const baselineMultiplier = this.game.configs.marketing?.baselineMultiplier || 1.2;
    this.game.gameState.awareness = baselineMultiplier;
    this.game.updateHUD();
    
    // Show completion effect
    const multiplierGift = document.querySelector('.multiplier-gift');
    if (multiplierGift) {
      multiplierGift.style.animation = 'giftGlow 0.5s ease-in-out forwards';
    }
    
    // Brief pause then next stage
    setTimeout(() => {
      this.game.nextStage();
    }, 1500);
  }
  
  handleKeyPress(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      this.completeStage();
    }
  }
}

class WildCustomerStage {
  constructor(game) {
    this.game = game;
    this.stageDuration = 6000; // 6 seconds total
    this.startTime = 0;
  }
  
  start() {
    console.log('👤 Wild Customer Stage - Starting...');
    this.startTime = Date.now();
    
    // Select random persona
    const persona = this.game.selectRandomPersona();
    
    // Create wild customer stage content
    const stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = `
      <div class="wild-customer-stage">
        <div class="customer-content">
          <h2 class="customer-title">A wild customer appeared!</h2>
          <div class="customer-sprite">${this.getPersonaEmoji(persona.personaId)}</div>
          <div class="customer-name">${persona.name}</div>
          <div class="customer-description">${this.getPersonaDescription(persona.personaId)}</div>
          <div class="customer-cta">Needs: ${this.getPersonaNeeds(persona.personaId)}</div>
          <div class="continue-prompt">Press SPACE to help them...</div>
        </div>
      </div>
    `;
    
    // Start timer
    this.startTimer();
    
    // Setup keyboard listener for this stage
    this.setupKeyboardListener();
  }
  
  getPersonaEmoji(personaId) {
    const emojis = {
      'bedroom_producer': '🎵',
      'touring_pro': '🎸',
      'choir_director': '🎤',
      'studio_engineer': '🎛️'
    };
    return emojis[personaId] || '🎵';
  }
  
  getPersonaDescription(personaId) {
    const descriptions = {
      'bedroom_producer': 'Creating beats in their home studio',
      'touring_pro': 'Professional musician on the road',
      'choir_director': 'Leading vocal ensembles',
      'studio_engineer': 'Crafting perfect recordings'
    };
    return descriptions[personaId] || 'Music maker';
  }
  
  getPersonaNeeds(personaId) {
    const needs = {
      'bedroom_producer': 'Studio equipment & software',
      'touring_pro': 'Reliable gear for live shows',
      'choir_director': 'Live sound & microphones',
      'studio_engineer': 'Mixing monitors & interfaces'
    };
    return needs[personaId] || 'Music gear';
  }
  
  setupKeyboardListener() {
    this.keyHandler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.completeStage();
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  }
  
  startTimer() {
    const updateTimer = () => {
      const elapsed = Date.now() - this.startTime;
      const remaining = Math.max(0, this.stageDuration - elapsed);
      
      this.game.gameState.timer = remaining / 1000;
      this.game.updateHUD();
      
      if (remaining > 0) {
        requestAnimationFrame(updateTimer);
      } else {
        // Auto-advance if time runs out
        this.completeStage();
      }
    };
    
    requestAnimationFrame(updateTimer);
  }
  
  completeStage() {
    console.log('👤 Wild Customer Stage - Complete!');
    
    // Remove keyboard listener
    document.removeEventListener('keydown', this.keyHandler);
    
    // Brief pause then next stage
    setTimeout(() => {
      this.game.nextStage();
    }, 1000);
  }
  
  handleKeyPress(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      this.completeStage();
    }
  }
}

class SalesStage {
  constructor(game) {
    this.game = game;
    this.stageDuration = 120000; // 2 minutes - more time to play
    this.startTime = 0;
    
    // Snake game properties
    this.boardWidth = 20;
    this.boardHeight = 12;
    this.snake = [];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.pickup = null;
    this.gameRunning = false;
    this.gameSpeed = 250; // milliseconds between moves - slightly slower start
    this.gameLoop = null;
    
    // Persona-based pickups
    this.personaPickups = {
      'bedroom_producer': ['🎛️', '🎧', '💻', '🎹'],
      'touring_pro': ['🎸', '🎤', '🔌', '📻'],
      'choir_director': ['🎤', '📢', '🎵', '🎼'],
      'studio_engineer': ['🎛️', '🔊', '📡', '🎚️']
    };
    
    this.neutralPickups = ['🎵', '🎶', '🎼', '🎤'];
  }
  
  start() {
    console.log('🛒 Sales Stage (Snake) - Starting...');
    this.startTime = Date.now();
    
    // Create snake game content
    const stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = `
      <div class="sales-stage">
        <div class="snake-game-container">
          <h2 class="snake-title">🛒 Sales Department</h2>
          <div class="snake-board" id="snake-board"></div>
          <div class="game-info">
            <div>Length: <span id="snake-length">3</span></div>
            <div>Preferred: <span id="preferred-count">0</span></div>
            <div>Neutral: <span id="neutral-count">0</span></div>
          </div>
          <div class="controls">
            Use <kbd>WASD</kbd> or <kbd>Arrow Keys</kbd> to move
          </div>
          <div class="game-over" id="game-over">
            <h3>Time for a Break!</h3>
            <p>You helped the customer find lots of gear!</p>
            <div class="ceo-rescue">
              CEO: "Amazing work! Ready to help the next customer?"
            </div>
            <p>Press <kbd>SPACE</kbd> to continue</p>
          </div>
        </div>
      </div>
    `;
    
    this.initSnakeGame();
    this.startTimer();
    this.setupKeyboardListener();
  }
  
  initSnakeGame() {
    // Initialize snake in center
    this.snake = [
      { x: 10, y: 6 },
      { x: 9, y: 6 },
      { x: 8, y: 6 }
    ];
    
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    
    this.renderBoard();
    this.spawnPickup();
    this.startGameLoop();
  }
  
  renderBoard() {
    const board = document.getElementById('snake-board');
    board.innerHTML = '';
    
    // Create grid cells
    for (let y = 0; y < this.boardHeight; y++) {
      for (let x = 0; x < this.boardWidth; x++) {
        const cell = document.createElement('div');
        cell.dataset.x = x;
        cell.dataset.y = y;
        
        // Check if this cell has snake
        const snakeSegment = this.snake.find(segment => segment.x === x && segment.y === y);
        if (snakeSegment) {
          if (snakeSegment === this.snake[0]) {
            cell.classList.add('snake-head');
          } else {
            cell.classList.add('snake-segment');
          }
        }
        
        // Check if this cell has pickup
        if (this.pickup && this.pickup.x === x && this.pickup.y === y) {
          cell.classList.add('pickup');
          if (this.pickup.preferred) {
            cell.classList.add('pickup-preferred');
          }
        }
        
        board.appendChild(cell);
      }
    }
  }
  
  spawnPickup() {
    let x, y;
    do {
      x = Math.floor(Math.random() * this.boardWidth);
      y = Math.floor(Math.random() * this.boardHeight);
    } while (this.snake.some(segment => segment.x === x && segment.y === y));
    
    // 30% chance for preferred pickup
    const isPreferred = Math.random() < 0.3;
    const persona = this.game.gameState.currentPersona;
    
    let emoji;
    if (isPreferred && persona) {
      const personaEmojis = this.personaPickups[persona.personaId] || this.neutralPickups;
      emoji = personaEmojis[Math.floor(Math.random() * personaEmojis.length)];
    } else {
      emoji = this.neutralPickups[Math.floor(Math.random() * this.neutralPickups.length)];
    }
    
    this.pickup = { x, y, preferred: isPreferred, emoji };
  }
  
  startGameLoop() {
    this.gameRunning = true;
    this.gameLoop = setInterval(() => {
      this.updateSnake();
    }, this.gameSpeed);
  }
  
  updateSnake() {
    if (!this.gameRunning) return;
    
    // Update direction
    this.direction = { ...this.nextDirection };
    
    // Move head
    const head = { ...this.snake[0] };
    head.x += this.direction.x;
    head.y += this.direction.y;
    
    // Check wall collision - turn snake instead of game over
    if (head.x < 0 || head.x >= this.boardWidth || head.y < 0 || head.y >= this.boardHeight) {
      this.handleWallCollision(head);
      return;
    }
    
    // Check self collision - only game over if awareness is very low
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.handleSelfCollision();
      return;
    }
    
    this.snake.unshift(head);
    
    // Check pickup collision
    if (this.pickup && head.x === this.pickup.x && head.y === this.pickup.y) {
      this.collectPickup();
    } else {
      // Remove tail if no pickup collected
      this.snake.pop();
    }
    
    this.renderBoard();
    this.updateGameInfo();
  }
  
  collectPickup() {
    const points = this.pickup.preferred ? 100 : 25;
    this.game.addScore(points);
    
    // Update awareness for preferred pickups
    if (this.pickup.preferred) {
      this.game.updateAwareness(0.1);
    }
    
    // Update counters
    const preferredCount = document.getElementById('preferred-count');
    const neutralCount = document.getElementById('neutral-count');
    
    if (this.pickup.preferred) {
      preferredCount.textContent = parseInt(preferredCount.textContent) + 1;
    } else {
      neutralCount.textContent = parseInt(neutralCount.textContent) + 1;
    }
    
    this.spawnPickup();
    
    // Increase speed slightly (but not too fast)
    if (this.gameSpeed > 120) {
      this.gameSpeed -= 3;
      clearInterval(this.gameLoop);
      this.startGameLoop();
    }
  }
  
  handleWallCollision(head) {
    // Turn snake to avoid wall - choose a safe direction
    const safeDirections = [];
    
    // Check which directions are safe
    if (this.direction.x !== 1) safeDirections.push({ x: -1, y: 0 }); // Left
    if (this.direction.x !== -1) safeDirections.push({ x: 1, y: 0 }); // Right
    if (this.direction.y !== 1) safeDirections.push({ x: 0, y: -1 }); // Up
    if (this.direction.y !== -1) safeDirections.push({ x: 0, y: 1 }); // Down
    
    // Choose a random safe direction
    const newDirection = safeDirections[Math.floor(Math.random() * safeDirections.length)];
    this.nextDirection = newDirection;
    
    // Move head in new direction
    const newHead = { ...this.snake[0] };
    newHead.x += newDirection.x;
    newHead.y += newDirection.y;
    
    // Make sure new position is valid
    if (newHead.x >= 0 && newHead.x < this.boardWidth && 
        newHead.y >= 0 && newHead.y < this.boardHeight) {
      this.snake.unshift(newHead);
      this.snake.pop(); // Remove tail to keep same length
    }
    
    // Lose a small amount of awareness for hitting wall
    this.game.updateAwareness(-0.05);
    
    console.log('🔄 Hit wall! Snake turned safely.');
  }
  
  handleSelfCollision() {
    // Only game over if awareness is very low (below 0.5)
    if (this.game.gameState.awareness < 0.5) {
      this.gameOver();
      return;
    }
    
    // Otherwise, just lose awareness and continue
    this.game.updateAwareness(-0.2);
    
    // Shrink snake by 1 segment as penalty
    if (this.snake.length > 3) {
      this.snake.pop();
    }
    
    console.log('⚠️ Hit yourself! Lost awareness and shrunk snake.');
  }
  
  updateGameInfo() {
    document.getElementById('snake-length').textContent = this.snake.length;
  }
  
  gameOver() {
    this.gameRunning = false;
    clearInterval(this.gameLoop);
    
    // Show game over screen
    document.getElementById('game-over').style.display = 'block';
    
    // Setup space key to continue
    this.gameOverKeyHandler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.completeStage();
      }
    };
    document.addEventListener('keydown', this.gameOverKeyHandler);
  }
  
  setupKeyboardListener() {
    this.keyHandler = (e) => {
      if (!this.gameRunning) return;
      
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          e.preventDefault();
          if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
          break;
        case 'KeyS':
        case 'ArrowDown':
          e.preventDefault();
          if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
          break;
        case 'KeyA':
        case 'ArrowLeft':
          e.preventDefault();
          if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
          break;
        case 'KeyD':
        case 'ArrowRight':
          e.preventDefault();
          if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
          break;
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  }
  
  startTimer() {
    const updateTimer = () => {
      const elapsed = Date.now() - this.startTime;
      const remaining = Math.max(0, this.stageDuration - elapsed);
      
      this.game.gameState.timer = remaining / 1000;
      this.game.updateHUD();
      
      if (remaining > 0) {
        requestAnimationFrame(updateTimer);
      } else {
        // Time's up - just stop the timer, don't end the game
        console.log('⏰ Time's up! Game continues until you crash...');
        // Timer stops counting but game keeps running
      }
    };
    
    requestAnimationFrame(updateTimer);
  }
  
  completeStage() {
    console.log('🛒 Sales Stage - Complete!');
    
    // Clean up
    if (this.gameLoop) clearInterval(this.gameLoop);
    document.removeEventListener('keydown', this.keyHandler);
    if (this.gameOverKeyHandler) {
      document.removeEventListener('keydown', this.gameOverKeyHandler);
    }
    
    // Brief pause then next stage
    setTimeout(() => {
      this.game.nextStage();
    }, 1000);
  }
  
  handleKeyPress(e) {
    // Handled by setupKeyboardListener
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
