// Heart canvas animation
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const hearts = [];

class BurstHeart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 12;
    this.vy = (Math.random() - 0.5) * 12 - 5;
    this.life = 1;
    this.decay = 0.015;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.15;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2;
    this.life -= this.decay;
    this.angle += this.spin;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = '#e8577a';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('❤️', 0, 0);
    ctx.restore();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].draw();
    if (hearts[i].life <= 0) {
      hearts.splice(i, 1);
    }
  }
  
  requestAnimationFrame(animate);
}
animate();

// Main heart interactions
const mainHeart = document.getElementById('mainHeart');
let heartClicked = false;

mainHeart.addEventListener('click', function(e) {
  heartClicked = true;
  
  // Create burst hearts
  const rect = mainHeart.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 20; i++) {
    hearts.push(new BurstHeart(centerX, centerY));
  }
  
  // Play music
  const audio = document.getElementById('backgroundMusic');
  audio.play().catch(e => console.log('Audio play error:', e));
  
  // Go to page 2
  setTimeout(() => {
    scrollToPage(2);
  }, 500);
});

// Candles tracking
let candlesClicked = new Set();
const totalCandles = 5;

// Candles setup
function createCandles() {
  const container = document.getElementById('candlesContainer');
  const positions = [
    { x: 10, y: 20 },
    { x: 25, y: 25 },
    { x: 75, y: 25 },
    { x: 90, y: 20 },
    { x: 50, y: 15 }
  ];
  
  positions.forEach((pos, i) => {
    const candle = document.createElement('div');
    candle.className = 'candle';
    candle.setAttribute('data-candle-id', i);
    candle.style.setProperty('--cdelay', (i * 0.3) + 's');
    candle.style.left = pos.x + '%';
    candle.style.top = pos.y + '%';
    
    candle.innerHTML = `
      <div class="candle-glow"></div>
      <div class="candle-flame"></div>
      <div class="candle-body"></div>
      <div class="candle-label">Нажми</div>
    `;
    
    candle.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const candleId = parseInt(candle.getAttribute('data-candle-id'));
      
      if (!candlesClicked.has(candleId)) {
        candlesClicked.add(candleId);
        candle.style.opacity = '0.5';
        
        // Create burst hearts from candle
        const rect = candle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let j = 0; j < 10; j++) {
          hearts.push(new BurstHeart(centerX, centerY));
        }
      }
      
      // Check if all candles are clicked
      if (candlesClicked.size === totalCandles) {
        setTimeout(() => {
          scrollToPage(3);
        }, 300);
      }
    });
    
    container.appendChild(candle);
  });
}
createCandles();

// Page visibility
function makeCardsVisible() {
  document.querySelectorAll('.message-card, .poem-card').forEach(card => {
    card.classList.add('visible');
  });
}

// Scroll navigation
function scrollToPage(pageNum) {
  document.getElementById('page' + pageNum).scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    makeCardsVisible();
  }, 100);
}

// Intersection Observer for animation on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.message-card, .poem-card').forEach(card => {
  observer.observe(card);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') scrollToPage(parseInt(document.querySelector('.page:in-viewport')?.id.replace('page','')) + 1);
  if (e.key === 'ArrowUp') scrollToPage(Math.max(1, parseInt(document.querySelector('.page:in-viewport')?.id.replace('page','')) - 1));
});

