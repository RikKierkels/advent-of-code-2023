const input = require('../input');
const isPointInPolygon = require('point-in-polygon');
const log = console.log;

const [north, east, south, west] = [
  ['7', 'F', '|', 'S'],
  ['J', '7', '-', 'S'],
  ['L', 'J', '|', 'S'],
  ['L', 'F', '-', 'S'],
];

const connections = {
  '|': [north, [], south, []],
  '-': [[], east, [], west],
  L: [north, east, [], []],
  J: [north, [], [], west],
  7: [[], [], south, west],
  F: [[], east, south, []],
  '.': {},
  S: [north, south, east, west],
};

const createAdjacentIndexes = (index, lengthOfRow) => [
  index - lengthOfRow, // north
  index + 1, // east
  index + lengthOfRow, // south
  index - 1, // west
];

const traverse = (grid, lengthOfRow, indexOfCurrent) => {
  let hasLooped = false;
  let path = [];
  let indexOfPrevious = undefined;

  while (!hasLooped) {
    const current = grid[indexOfCurrent];

    const [indexOfNext, next] = createAdjacentIndexes(
      indexOfCurrent,
      lengthOfRow,
    )
      .map((index) => [index, grid[index]])
      .filter(([, tile], dir) => connections[current][dir].includes(tile))
      .filter(([index]) => index !== indexOfPrevious)
      .at(0);

    const x = indexOfNext % lengthOfRow;
    const y = Math.floor(indexOfNext / lengthOfRow);
    path.push([x, y]);

    hasLooped = next === 'S';
    indexOfPrevious = indexOfCurrent;
    indexOfCurrent = indexOfNext;
  }

  return path;
};

const findEnclosedTiles = (path, lines) => {
  let tiles = 0;
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (path.some(([pathX, pathY]) => pathX === x && pathY === y)) {
        continue;
      }

      tiles += isPointInPolygon([x, y], path);
    }
  }
  return tiles;
};

const rows = input(__dirname, './input.txt').split('\n');
const lengthOfRow = rows[0].length;

const grid = rows.join('');
const start = grid.indexOf('S');

const path = traverse(grid, lengthOfRow, start);
const enclosedTiles = findEnclosedTiles(path, rows);

log(`Solution pt.1 ${path.length / 2}`);
log(`Solution pt.2 ${enclosedTiles}`);
