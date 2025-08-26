const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let cardWidth = 60;
let cardHeight = 90;
let deckPos = { x: 0, y: 0 };
const playerHand = [];
const buttons = [];
let animations = [];

const suits = ['\u2660', '\u2665', '\u2666', '\u2663'];
const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let deck = [];

function createDeck() {
  deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
}

function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function positionHand() {
  const spacing = cardWidth + 10;
  const totalWidth = cardWidth + (playerHand.length - 1) * spacing;
  const startX = canvas.width / 2 - totalWidth / 2;
  playerHand.forEach((card, index) => {
    card.x = startX + index * spacing;
    card.y = canvas.height - cardHeight - 100;
  });
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  cardWidth = Math.min(canvas.width, canvas.height) * 0.08;
  cardHeight = cardWidth * 1.4;

  deckPos = {
    x: canvas.width / 2 - cardWidth / 2,
    y: canvas.height / 2 - cardHeight / 2,
  };

  const btnWidth = cardWidth * 2;
  const btnHeight = cardHeight * 0.5;
  const padding = 20;
  buttons.length = 0;
  buttons.push({
    x: canvas.width / 2 - btnWidth / 2,
    y: canvas.height - btnHeight - padding,
    w: btnWidth,
    h: btnHeight,
    text: 'Deal',
    action: dealCard,
  });

  positionHand();
}

function drawTable() {
  ctx.fillStyle = '#0a5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDeck() {
  if (deck.length > 0) {
    ctx.fillStyle = '#005';
    ctx.fillRect(deckPos.x, deckPos.y, cardWidth, cardHeight);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(deckPos.x, deckPos.y, cardWidth, cardHeight);
  }
}

function drawCard(card, x, y) {
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(x, y, cardWidth, cardHeight);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = card.suit === '\u2665' || card.suit === '\u2666' ? '#d00' : '#000';
  ctx.font = `${cardWidth * 0.4}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(card.rank, x + cardWidth * 0.1, y + cardHeight * 0.1);
  ctx.fillText(card.suit, x + cardWidth * 0.1, y + cardHeight * 0.5);
}

function drawButtons() {
  ctx.font = `${cardHeight * 0.3}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const btn of buttons) {
    ctx.fillStyle = '#333';
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.fillStyle = '#fff';
    ctx.fillText(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
  }
}

function drawPlayerHand() {
  for (const card of playerHand) {
    drawCard(card, card.x, card.y);
  }
}

function drawAnimations() {
  for (const anim of animations) {
    drawCard(anim.card, anim.currentX, anim.currentY);
  }
}

function draw() {
  drawTable();
  drawDeck();
  drawPlayerHand();
  drawAnimations();
  drawButtons();
}

function dealCard() {
  if (deck.length === 0) {
    createDeck();
    shuffle();
  }
  const card = deck.pop();
  playerHand.push({ ...card });
  positionHand();
  const target = playerHand[playerHand.length - 1];
  playerHand.pop();
  animateCard(card, deckPos.x, deckPos.y, target.x, target.y, 500);
}

function animateCard(card, fromX, fromY, toX, toY, duration) {
  animations.push({
    card,
    fromX,
    fromY,
    toX,
    toY,
    duration,
    start: null,
    currentX: fromX,
    currentY: fromY,
  });
}

function updateAnimations(timestamp) {
  animations = animations.filter(anim => {
    if (!anim.start) anim.start = timestamp;
    const progress = Math.min((timestamp - anim.start) / anim.duration, 1);
    anim.currentX = anim.fromX + (anim.toX - anim.fromX) * progress;
    anim.currentY = anim.fromY + (anim.toY - anim.fromY) * progress;
    if (progress >= 1) {
      playerHand.push({ ...anim.card, x: anim.toX, y: anim.toY });
      positionHand();
      return false;
    }
    return true;
  });
}

function loop(timestamp) {
  updateAnimations(timestamp);
  draw();
  requestAnimationFrame(loop);
}

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  for (const btn of buttons) {
    if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
      btn.action();
    }
  }
});

window.addEventListener('resize', resizeCanvas);

createDeck();
shuffle();
resizeCanvas();
requestAnimationFrame(loop);
