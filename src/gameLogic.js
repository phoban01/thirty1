// Game logic for Thirty-One card game.
// Provides scoring, draw/discard helpers, knocking, and round resolution.

/**
 * Card value map used for scoring.
 * Ace counts as 11, face cards as 10, others as their numeric value.
 */
const VALUES = {
  A: 11,
  K: 10,
  Q: 10,
  J: 10,
  10: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};

/**
 * Scores a hand of cards.
 *
 * Cards are objects in the form { suit: 'hearts', rank: 'A' }.
 * The score is the highest sum of card values of the same suit.
 * A three of a kind scores 30.5.
 *
 * @param {Array<{suit: string, rank: string}>} hand
 * @returns {number} Score of the hand.
 */
function scoreHand(hand) {
  if (hand.length === 3) {
    const ranks = hand.map(c => c.rank);
    if (ranks.every(r => r === ranks[0])) {
      return 30.5; // three of a kind
    }
  }

  const suitTotals = {};
  hand.forEach(card => {
    const value = VALUES[card.rank];
    suitTotals[card.suit] = (suitTotals[card.suit] || 0) + value;
  });
  const totals = Object.values(suitTotals);
  return totals.length ? Math.max(...totals) : 0;
}

/**
 * Draws the top card from the deck into a player's hand.
 *
 * @param {Array} deck Array representing the deck (top is end of array).
 * @param {Array} hand Player's hand to receive the card.
 * @returns {Object} The drawn card.
 */
function drawCard(deck, hand) {
  const card = deck.pop();
  if (card) hand.push(card);
  return card;
}

/**
 * Discards a card from a hand to the discard pile.
 *
 * @param {Array} hand Player's hand.
 * @param {number} index Index of the card to discard.
 * @param {Array} discardPile Discard pile array (top is end of array).
 * @returns {Object} The discarded card.
 */
function discardCard(hand, index, discardPile) {
  const [card] = hand.splice(index, 1);
  if (card) discardPile.push(card);
  return card;
}

/**
 * Marks that a player has knocked, signalling the final round.
 *
 * @param {Object} state Game state object containing player order and turn.
 * @param {number} playerIndex Index of the player who knocked.
 */
function knock(state, playerIndex) {
  state.knockedBy = playerIndex;
  state.finalTurn = true;
}

/**
 * Resolves a round of play and returns winner/loser info.
 *
 * @param {Object} state Game state containing players with hands.
 * @returns {{scores: number[], winner: number, loser: number}} result
 */
function resolveRound(state) {
  const scores = state.players.map(p => scoreHand(p.hand));
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const winner = scores.indexOf(maxScore);
  const loser = scores.indexOf(minScore);
  return { scores, winner, loser };
}

/**
 * Checks if a hand satisfies an automatic win condition (31 or three of a kind).
 *
 * @param {Array} hand Player hand.
 * @returns {boolean} True if the hand scores 31 or 30.5.
 */
function hasWinningHand(hand) {
  const score = scoreHand(hand);
  return score === 31 || score === 30.5;
}

module.exports = {
  scoreHand,
  drawCard,
  discardCard,
  knock,
  resolveRound,
  hasWinningHand,
};

