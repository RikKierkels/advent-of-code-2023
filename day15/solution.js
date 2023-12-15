const input = require('../input');
const log = console.log;
const compose = (...fns) => (x) => fns.reduceRight((y, f) => f(y), x);
const map = (fn) => (array) => array.map(fn);
const reduce = (...args) => (array) => array.reduce(...args);
const sum = (a, b) => a + b;
const split = (separator) => (s) => s.split(separator);
const match = (regex) => (s) => (s.match(regex) ?? []).splice(1);

const hash = (current, character) => {
  current += character.charCodeAt(0);
  current *= 17;
  current %= 256;
  return current;
};

const putLensesInBoxes = (boxes, [label, operation, focal]) => {
  const box = compose(reduce(hash, 0), split(''))(label);

  if (!boxes[box]) {
    boxes[box] = [];
  }

  const index = boxes[box].findIndex((lens) => lens.label === label);
  const hasLens = index !== -1;

  if (operation === '-' && hasLens) {
    boxes[box].splice(index, 1);
  }

  if (operation === '=') {
    const lens = { label, focal: +focal };

    if (!hasLens) {
      boxes[box].push(lens);
    } else {
      boxes[box][index] = lens;
    }
  }

  return boxes;
};

const calculateFocusingPower = (total, box, boxIndex) => {
  total += reduce((totalOfBox, lens, lensIndex) => {
    totalOfBox += (boxIndex + 1) * (lensIndex + 1) * lens.focal;
    return totalOfBox;
  }, 0)(box);
  return total;
};

const sumOfHashResults = compose(
  reduce(sum),
  map(reduce(hash, 0)),
  map(split('')),
  split(','),
);

const focusingPower = compose(
  reduce(calculateFocusingPower, 0),
  reduce(putLensesInBoxes, []),
  map(match(/(\w+)([=-])(\d)*/)),
  split(','),
);

const sequence = input(__dirname, './input.txt');

log(`Solution pt.1 ${sumOfHashResults(sequence)}`);
log(`Solution pt.2 ${focusingPower(sequence)}`);
