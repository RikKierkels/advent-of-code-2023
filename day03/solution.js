const input = require('../input');
const log = console.log;
const matchAll = (pattern) => (string) => [...string.matchAll(pattern)] ?? [];
const range = (start, length) => [...Array(length)].map((_, i) => start + i);
const unique = (xs) => [...new Set(xs)];

const schematic = input(__dirname, './input.txt');
const lines = schematic.split('\n');
const lineLength = lines[0].length;
const characters = lines.join('');

const numbers = matchAll(/(\d+)/g)(characters).map((match) => ({
  number: +match[0],
  indexes: range(match.index, match[0].length),
}));

const symbols = matchAll(/([^\d.])+/g)(characters).map((match) => ({
  symbol: match[0],
  indexes: range(match.index, match[0].length),
}));

const hasSymbolForIndex = (index) =>
  symbols.some(({ indexes }) => indexes.includes(index));
const findNumberForIndex = (index) =>
  numbers.find(({ indexes }) => indexes.includes(index));

const createAdjacentIndexes = (indexes) => {
  const start = indexes.at(0);
  const end = indexes.at(-1);

  const normalizedIndex = start % lineLength;
  const isFirstInLine = normalizedIndex === 0;
  const isLastInline = normalizedIndex === lineLength - 1;

  let adjacentIndexes = [
    ...indexes.map((i) => i - lineLength), // top
    ...indexes.map((i) => i + lineLength), // bottom
  ];

  if (!isFirstInLine) {
    adjacentIndexes = [
      ...adjacentIndexes,
      start - 1, // left
      start - lineLength - 1, // left top
      start + lineLength - 1, // left bottom
    ];
  }

  if (!isLastInline) {
    adjacentIndexes = [
      ...adjacentIndexes,
      end + 1, // right
      end - lineLength + 1, // right top
      end + lineLength + 1, // right bottom
    ];
  }

  return adjacentIndexes;
};

const sumOfPartNumbers = numbers.reduce((total, { number, indexes }) => {
  const adjacentIndexes = createAdjacentIndexes(indexes);
  const isPartNumber = adjacentIndexes.some(hasSymbolForIndex);
  return isPartNumber ? (total += number) : total;
}, 0);
log(`Solution pt.1 ${sumOfPartNumbers}`);

const sumOfGearRatios = symbols
  .filter(({ symbol }) => symbol === '*')
  .map(({ indexes }) => createAdjacentIndexes(indexes))
  .map((adjacentIndexes) =>
    adjacentIndexes
      .map(findNumberForIndex)
      .filter((number) => !!number)
      .map(({ number }) => number),
  )
  .map(unique)
  .filter((numbers) => numbers.length === 2)
  .reduce((total, numbers) => total + numbers[0] * numbers[1], 0);
log(`Solution pt.2 ${sumOfGearRatios}`);
