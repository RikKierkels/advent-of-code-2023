const input = require('../input');
const log = console.log;
const match = (pattern) => (string) => string.match(pattern).splice(1) ?? [];
const range = (start, length) => [...Array(length)].map((_, i) => start + i);
const intersect = (xs, ...ys) =>
  [...new Set(xs)].filter((x) => ys.every((y) => y.includes(x)));
const toNumberArray = (s) => s.split(' ').map(Number);

const cards = input(__dirname, './input.txt')
  .replaceAll(/\s{2,}/g, ' ')
  .split('\n')
  .map(match(/Card\s+(\d+):\s+([^\|]+)\|\s+([^\|]+)/))
  .map(([id, winning, owned]) => ({
    id: +id,
    winning: intersect(toNumberArray(winning), toNumberArray(owned)),
  }));

const totalAmountOfPoints = cards
  .filter(({ winning }) => winning.length)
  .map(({ winning }) => 2 ** (winning.length - 1))
  .reduce((total, score) => total + score, 0);

const totalAmountOfScratchCards = cards
  .map((card) => card.winning.length)
  .reduce(
    (copies, numberOfWinningCards, index) => {
      if (!numberOfWinningCards) return copies;
      range(1, numberOfWinningCards).forEach(
        (n) => (copies[index + n] += copies[index]),
      );
      return copies;
    },
    cards.map(() => 1),
  )
  .reduce((total, numberOfCards) => total + numberOfCards);

log(`Solution pt.1 ${totalAmountOfPoints}`);
log(`Solution pt.2 ${totalAmountOfScratchCards}`);
