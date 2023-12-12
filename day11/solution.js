const input = require('../input');
const log = console.log;
const insert = (array, index, value) => array.splice(index, 0, value);
const arrayFrom = (length) => Array.from({ length }).map((_, i) => i);
const pairs = (array) =>
  array.flatMap((x, i) => array.slice(i + 1).map((y) => [x, y]));

const findEmptySpace = (universe) => {
  const isEmptySpace = (n) => n === '.';

  const emptyRowIndexes = universe.reduce(
    (indexes, row, index) =>
      row.every(isEmptySpace) ? [...indexes, index] : indexes,
    [],
  );

  const emptyColumnIndexes = arrayFrom(universe[0].length).reduce(
    (indexes, index) =>
      universe.map((row) => row[index]).every(isEmptySpace)
        ? [...indexes, index]
        : indexes,
    [],
  );

  return [emptyRowIndexes, emptyColumnIndexes];
};

const expand = (universe) => {
  const [emptyRowIndexes, emptyColumnIndexes] = findEmptySpace(universe);

  emptyRowIndexes.forEach((indexOfRow, offset) =>
    insert(
      universe,
      indexOfRow + offset,
      arrayFrom(universe[0].length).map((_) => '.'),
    ),
  );

  emptyColumnIndexes.forEach((indexOfColumn, offset) =>
    universe.forEach((row) => insert(row, indexOfColumn + offset, '.')),
  );

  return universe;
};

const findGalaxies = (universe) => {
  const lengthOfRow = universe[0].length;

  return [
    ...universe
      .map((row) => row.join(''))
      .join('')
      .matchAll(/#/g),
  ].map(({ index }) => [index % lengthOfRow, Math.floor(index / lengthOfRow)]);
};

const path = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const universe = expand(
  input(__dirname, './input.txt')
    .split('\n')
    .map((row) => row.split('')),
);
const galaxies = findGalaxies(universe);
const steps = pairs(galaxies).reduce(
  (steps, pair) => (steps += path(pair[0], pair[1])),
  0,
);

log(`Solution pt.1 ${steps}`);
log(`Solution pt.2 ${2}`);
