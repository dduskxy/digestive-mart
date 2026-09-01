export class Agent {
  id: string;
  x: number;
  y: number;
  color: string;
  type: 'shopper' | 'staff';
  targetX: number | null = null;
  targetY: number | null = null;
  speed: number;
  state: string = 'idle';
  pathIndex: number = 0;
  waitTime: number = 0;

  constructor(id: string, x: number, y: number, type: 'shopper' | 'staff', color: string) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.speed = type === 'shopper' ? 1.5 + Math.random() : 0.8;
  }

  update(width: number, height: number, timeDelta: number) {
    if (this.type === 'staff') {
      // Staff wander in their designated zone
      if (this.targetX === null || this.targetY === null || Math.random() < 0.01) {
        this.targetX = this.x + (Math.random() - 0.5) * 60;
        this.targetY = this.y + (Math.random() - 0.5) * 60;
      }
    } else {
      // Shopper Logic - move through zones
      const pathPoints = [
        { x: this.x, y: this.y }, // Start (Entrance)
        { x: 125, y: 125 },       // Mouth Zone
        { x: 450, y: 350 },       // Stomach Zone
        { x: 175, y: 425 },       // Intestines Zone
        { x: width + 50, y: Math.random() * height } // Exit
      ];

      if (this.waitTime > 0) {
        this.waitTime -= timeDelta;
        return; // Wait at the current zone
      }

      if (this.pathIndex < pathPoints.length) {
        if (this.targetX === null) {
           const target = pathPoints[this.pathIndex];
           // Add some scatter so they don't all go to the exact same point
           this.targetX = target.x + (Math.random() - 0.5) * 80;
           this.targetY = target.y + (Math.random() - 0.5) * 80;
        }
      }

      if (this.pathIndex >= pathPoints.length) {
         // Re-enter the store once exited
         this.x = -20;
         this.y = Math.random() * height;
         this.pathIndex = 1; // Go to mouth
         this.targetX = null;
      }
    }

    if (this.targetX !== null && this.targetY !== null) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.speed) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.targetX = null;
        this.targetY = null;
        
        if (this.type === 'shopper') {
          this.pathIndex++;
          this.waitTime = 1000 + Math.random() * 2000; // Wait 1-3 seconds in the zone
        }
      } else {
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    
    if (this.type === 'staff') {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      
      ctx.fillStyle = '#fff';
      ctx.font = '12px sans-serif';
      const label = this.id.charAt(0).toUpperCase() + this.id.slice(1);
      ctx.fillText(label, this.x - 15, this.y - 12);
    }
  }
}

export class GameEngine {
  agents: Agent[] = [];
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  animationFrameId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  init() {
    // Create shopper agents
    for (let i = 0; i < 50; i++) {
      const agent = new Agent(
        `shopper_${i}`,
        -Math.random() * 200, // stagger entrances
        Math.random() * this.height,
        'shopper',
        '#3498db'
      );
      agent.pathIndex = 1;
      this.agents.push(agent);
    }

    // Create staff agents (Enzymes) in their zones
    this.agents.push(new Agent('amylase', 125, 125, 'staff', '#e74c3c')); // Mouth zone
    this.agents.push(new Agent('pepsin', 450, 350, 'staff', '#f1c40f')); // Stomach zone
    this.agents.push(new Agent('lipase', 175, 425, 'staff', '#2ecc71')); // Intestines zone
  }

  start() {
    let lastTime = performance.now();
    const loop = (time: number) => {
      const timeDelta = time - lastTime;
      lastTime = time;
      this.update(timeDelta);
      this.draw();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  update(timeDelta: number) {
    this.agents.forEach(agent => agent.update(this.width, this.height, timeDelta));
  }

  draw() {
    // Clear background
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw zones
    this.ctx.fillStyle = 'rgba(231, 76, 60, 0.2)'; // Mouth
    this.ctx.fillRect(50, 50, 150, 150);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px sans-serif';
    this.ctx.fillText('Mouth (Carbs)', 60, 70);

    this.ctx.fillStyle = 'rgba(241, 196, 15, 0.2)'; // Stomach
    this.ctx.fillRect(350, 250, 200, 200);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText('Stomach (Proteins)', 360, 270);

    this.ctx.fillStyle = 'rgba(46, 204, 113, 0.2)'; // Intestines
    this.ctx.fillRect(50, 350, 250, 150);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText('Intestines (Absorption)', 60, 370);

    // Draw agents
    // Draw staff on top of shoppers
    const shoppers = this.agents.filter(a => a.type === 'shopper');
    const staff = this.agents.filter(a => a.type === 'staff');
    
    shoppers.forEach(agent => agent.draw(this.ctx));
    staff.forEach(agent => agent.draw(this.ctx));
  }
}
