const deckEl = document.getElementById('deck');
const discardEl = document.getElementById('discard');
const handEl = document.getElementById('hand');
const knockBtn = document.getElementById('knock');
const passBtn = document.getElementById('pass');

// simple representation of cards
const deck = ['A\u2660', '2\u2660', '3\u2660', '4\u2660', '5\u2660'];
const hand = [];
const discard = [];

function bindPointer(element, handler) {
  ['click', 'touchstart'].forEach(evt =>
    element.addEventListener(evt, e => {
      e.preventDefault();
      handler();
    })
  );
}

function updateUI() {
  deckEl.textContent = `Deck (${deck.length})`;
  discardEl.textContent = discard.length ? discard[discard.length - 1] : 'Discard';
  handEl.innerHTML = '';
  hand.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.textContent = card;
    cardEl.className = 'card';
    bindPointer(cardEl, () => discardCard(index));
    handEl.appendChild(cardEl);
  });
}

function drawCard() {
  if (!deck.length) return;
  hand.push(deck.pop());
  updateUI();
}

function discardCard(index) {
  discard.push(hand.splice(index, 1)[0]);
  updateUI();
}

function knock() {
  console.log('Knock');
}

function pass() {
  console.log('Pass');
}

bindPointer(deckEl, drawCard);
bindPointer(knockBtn, knock);
bindPointer(passBtn, pass);

updateUI();
