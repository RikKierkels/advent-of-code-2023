const input = require('../input');
const log = console.log;
const countOccurrences = (arr) =>
  arr.reduce((prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev), {});

const compareHands = (handOne, handTwo, weights) => {
  const category = handOne.category - handTwo.category;
  if (category !== 0) return category;

  for (let i = 0; i < handOne.cards.length; i++) {
    const cardOne = handOne.cards[i];
    const cardTwo = handTwo.cards[i];
    const score = (weights[cardOne] ?? cardOne) - (weights[cardTwo] ?? cardTwo);
    if (score !== 0) return score;
  }
  return 0;
};

const categorize = (hand) => {
  const occurrences = Object.values(countOccurrences(hand.cards));

  const category = occurrences.includes(5)
    ? 7
    : occurrences.includes(4)
    ? 6
    : occurrences.includes(3)
    ? occurrences.includes(2)
      ? 5
      : 4
    : occurrences.filter((n) => n === 2).length === 2
    ? 3
    : occurrences.filter((n) => n === 2).length === 1
    ? 2
    : 1;

  return { ...hand, category };
};

const jokerize = (hand) => {
  const occurrences = countOccurrences(hand.cards);
  const jokers = occurrences['J'];

  if (jokers === 0 || jokers === 5) return categorize(hand);

  const [highestOccurringCard] = Object.entries(occurrences)
    .filter(([card]) => card !== 'J')
    .sort(([, countOne], [, countTwo]) => countTwo - countOne)
    .at(0);

  let jokerizedCards = [...hand.cards];

  for (let i = 0; i < jokers; i++) {
    jokerizedCards = jokerizedCards.map((card) =>
      card === 'J' ? highestOccurringCard : card,
    );
  }

  return {
    ...hand,
    category: categorize({ ...hand, cards: jokerizedCards }).category,
  };
};

const hands = input(__dirname, './input.txt')
  .split('\n')
  .map((line) => line.split(' '))
  .map(([cards, bid]) => ({ cards: cards.split(''), bid: +bid }));

const winningsPartOne = hands
  .map(categorize)
  .sort((handOne, handTwo) =>
    compareHands(handOne, handTwo, { A: 14, K: 13, Q: 12, J: 11, T: 10 }),
  )
  .reduce((winnings, hand, index) => (winnings += hand.bid * (index + 1)), 0);

const winningsPartTwo = hands
  .map(jokerize)
  .sort((handOne, handTwo) =>
    compareHands(handOne, handTwo, { A: 14, K: 13, Q: 12, J: 1, T: 10 }),
  )
  .reduce((winnings, hand, index) => (winnings += hand.bid * (index + 1)), 0);

log(`Solution pt.1 ${winningsPartOne}`);
log(`Solution pt.2 ${winningsPartTwo}`);
