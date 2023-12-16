const input = require('../input');
const log = console.log;

const DIRECTION = {
  UP: 'U',
  RIGHT: 'R',
  DOWN: 'D',
  LEFT: 'L',
};
const DIRECTIONS = {
  [DIRECTION.UP]: { y: -1, x: 0 },
  [DIRECTION.RIGHT]: { y: 0, x: 1 },
  [DIRECTION.DOWN]: { y: 1, x: 0 },
  [DIRECTION.LEFT]: { y: 0, x: -1 },
};

const isOutOfBounds = (seen, x, y) =>
  x < 0 || x >= seen[0].length || y < 0 || y >= seen.length;

const isVisited = (visited, x, y, direction) => visited[y][x] === direction;

const visit = (grid, visited, x, y, direction) => {
  if (isOutOfBounds(visited, x, y) || isVisited(visited, x, y, direction)) {
    return visited;
  }

  visited[y][x] = direction;
  const tile = grid[y][x];

  if (
    tile === '.' ||
    (tile === '-' && [DIRECTION.RIGHT, DIRECTION.LEFT].includes(direction)) ||
    (tile === '|' && [DIRECTION.UP, DIRECTION.DOWN].includes(direction))
  ) {
    const { x: xDirection, y: yDirection } = DIRECTIONS[direction];
    return visit(grid, visited, x + xDirection, y + yDirection, direction);
  }

  if (tile === '|' && [DIRECTION.RIGHT, DIRECTION.LEFT].includes(direction)) {
    return (
      visit(grid, visited, x, y - 1, DIRECTION.UP),
      visit(grid, visited, x, y + 1, DIRECTION.DOWN)
    );
  }

  if (tile === '-' && [DIRECTION.UP, DIRECTION.DOWN].includes(direction)) {
    return (
      visit(grid, visited, x - 1, y, DIRECTION.LEFT),
      visit(grid, visited, x + 1, y, DIRECTION.RIGHT)
    );
  }

  if (tile === '\\' && direction === DIRECTION.UP) {
    return visit(grid, visited, x - 1, y, DIRECTION.LEFT);
  }

  if (tile === '\\' && direction === DIRECTION.LEFT) {
    return visit(grid, visited, x, y - 1, DIRECTION.UP);
  }

  if (tile === '\\' && direction === DIRECTION.DOWN) {
    return visit(grid, visited, x + 1, y, DIRECTION.RIGHT);
  }

  if (tile === '\\' && direction === DIRECTION.RIGHT) {
    return visit(grid, visited, x, y + 1, DIRECTION.DOWN);
  }

  if (tile === '/' && direction === DIRECTION.UP) {
    return visit(grid, visited, x + 1, y, DIRECTION.RIGHT);
  }

  if (tile === '/' && direction === DIRECTION.LEFT) {
    return visit(grid, visited, x, y + 1, DIRECTION.DOWN);
  }

  if (tile === '/' && direction === DIRECTION.DOWN) {
    return visit(grid, visited, x - 1, y, DIRECTION.LEFT);
  }

  if (tile === '/' && direction === DIRECTION.RIGHT) {
    return visit(grid, visited, x, y - 1, DIRECTION.UP);
  }
};

const sum = (grid) =>
  grid.reduce(
    (total, row) => total + row.filter((column) => column !== '.').length,
    0,
  );

const start = (grid, x, y, direction) => {
  const visited = Array(grid.length)
    .fill()
    .map(() => Array(grid[0].length).fill('.'));
  return visit(grid, visited, x, y, direction);
};

const findMaxEnergizedTilesConfig = (grid) => {
  const visited = [];

  for (let y = 0; y < grid.length; y++) {
    visited.push(start(grid, 0, y, DIRECTION.RIGHT));
    visited.push(start(grid, grid[0].length - 1, y, DIRECTION.LEFT));
  }

  for (let x = 0; x < grid[0].length; x++) {
    visited.push(start(grid, x, 0, DIRECTION.DOWN));
    visited.push(start(grid, 0, grid.length - 1, DIRECTION.UP));
  }

  return visited.reduce((max, _visited) => Math.max(max, sum(_visited)), 0);
};

const grid = input(__dirname, './input.txt')
  .split('\n')
  .map((line) => line.split(''));

log(`Solution pt.1 ${sum(start(grid, 0, 0, DIRECTION.RIGHT))}`);
log(`Solution pt.2 ${findMaxEnergizedTilesConfig(grid)}`);
