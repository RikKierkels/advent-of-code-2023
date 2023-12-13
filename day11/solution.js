const input = require('../input');
const log = console.log;
const pairs = (array) =>
  array.flatMap((x, i) => array.slice(i + 1).map((y) => [x, y]));
const transpose = (array) =>
  array[0].map((_, col) => array.map((row) => row[col]));

const isEmptySpace = (n) => n === '.';
const toEmptyIndexes = (universe) =>
  universe.reduce(
    (indexes, row, index) =>
      row.every(isEmptySpace) ? [...indexes, index] : indexes,
    [],
  );
const findEmptySpace = (universe) => {
  return [toEmptyIndexes(universe), toEmptyIndexes(transpose(universe))];
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

const findShortestExpandedPath = (
  [[x1, y1], [x2, y2]],
  emptyRowIndexes,
  emptyColumnIndexes,
  expansion = 1,
) => {
  let distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);

  distance += emptyRowIndexes.reduce(
    (dist, index) =>
      (dist +=
        Math.min(y1, y2) < index && Math.max(y1, y2) > index ? expansion : 0),
    0,
  );

  distance += emptyColumnIndexes.reduce(
    (dist, index) =>
      (dist +=
        Math.min(x1, x2) < index && Math.max(x1, x2) > index ? expansion : 0),
    0,
  );

  return distance;
};

const findSumOfShortestExpandedPaths = (universe, expansion = 1) => {
  const galaxies = findGalaxies(universe);
  const [emptyRowIndexes, emptyColumnIndexes] = findEmptySpace(universe);

  return pairs(galaxies).reduce(
    (steps, pair) =>
      (steps += findShortestExpandedPath(
        pair,
        emptyRowIndexes,
        emptyColumnIndexes,
        expansion,
      )),
    0,
  );
};

const universe = input(__dirname, './input.txt')
  .split('\n')
  .map((row) => row.split(''));

log(`Solution pt.1 ${findSumOfShortestExpandedPaths(universe)}`);
log(`Solution pt.2 ${findSumOfShortestExpandedPaths(universe, 1_000_000 - 1)}`);
