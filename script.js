// Mobile touch optimization
if ('ontouchstart' in window) {
  document.body.classList.add('touch-device');
  document.documentElement.style.fontSize = 'clamp(14px, 2.5vw, 16px)';
}

// Prevent zoom on double tap
document.addEventListener('touchend', (e) => {
  if (e.touches.length === 0) {
    // Touch ended
  }
}, false);

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
let candlesToClick = [];

// Falling candles animation
function createFallingCandles() {
  setInterval(() => {
    const candleId = candlesToClick.length;
    
    const candle = document.createElement('div');
    candle.className = 'falling-candle';
    candle.setAttribute('data-candle-id', candleId);
    candle.style.left = Math.random() * 100 + '%';
    candle.style.setProperty('--fall-duration', (10 + Math.random() * 5) + 's');
    candle.style.setProperty('--fall-delay', (Math.random() * 1) + 's');
    
    candle.innerHTML = `
      <div class="candle-glow"></div>
      <div class="candle-flame"></div>
      <div class="candle-body"></div>
    `;
    
    candle.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const id = parseInt(candle.getAttribute('data-candle-id'));
      
      if (!candlesClicked.has(id)) {
        candlesClicked.add(id);
        candle.classList.add('extinguished');
        
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
    
    document.body.appendChild(candle);
    candlesToClick.push(candle);
    
    setTimeout(() => {
      if (candle.parentNode) candle.remove();
    }, 18000);
  }, 2200);
}

// Start falling candles only on page 2
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    createFallingCandles();
  }, 100);
});

// Page visibility
function makeCardsVisible() {
  document.querySelectorAll('.message-card, .poem-card').forEach(card => {
    card.classList.add('visible');
  });
}

// Falling hearts background animation
function createFallingHearts() {
  setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.setProperty('--fall-duration', (8 + Math.random() * 6) + 's');
    heart.style.setProperty('--fall-delay', (Math.random() * 2) + 's');
    heart.style.fontSize = (16 + Math.random() * 20) + 'px';
    
    heart.addEventListener('click', (e) => {
      e.stopPropagation();
      showLoveMessage(e.clientX, e.clientY);
      heart.remove();
    });
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
      if (heart.parentNode) heart.remove();
    }, 15000);
  }, 400);
}

// Show love message when clicking falling hearts
function showLoveMessage(x, y) {
  const message = document.createElement('div');
  message.className = 'love-message';
  message.textContent = 'Я люблю тебя безумно сильно, зай 💕';
  message.style.left = x + 'px';
  message.style.top = y + 'px';
  
  document.body.appendChild(message);
  
  setTimeout(() => message.remove(), 3500);
}

createFallingHearts();

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

