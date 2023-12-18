const input = require('../input');
const log = console.log;

const DIRECTION = {
  UP: 'U',
  RIGHT: 'R',
  DOWN: 'D',
  LEFT: 'L',
  0: 'R',
  1: 'D',
  2: 'L',
  3: 'U',
};
const DIRECTIONS = {
  [DIRECTION.UP]: { y: -1, x: 0 },
  [DIRECTION.RIGHT]: { y: 0, x: 1 },
  [DIRECTION.DOWN]: { y: 1, x: 0 },
  [DIRECTION.LEFT]: { y: 0, x: -1 },
};

const solve = (plan) => {
  let yDistancePrevious = 0,
    xDistancePrevious = 0,
    yDistance = 0,
    xDistance = 0,
    area = 0,
    points = 0;

  for (let index = 0; index < plan.length; index++) {
    const direction = DIRECTIONS[plan[index][0]];
    const distance = plan[index][1];

    yDistancePrevious = yDistance;
    xDistancePrevious = xDistance;
    yDistance += direction.y * distance;
    xDistance += direction.x * distance;
    area += xDistancePrevious * yDistance - xDistance * yDistancePrevious;
    points += distance;
  }

  return Math.abs(area / 2) + points / 2 + 1;
};

const rawInput = input(__dirname, 'input.txt');

const toPlan = (input) => input.split('\n').map((line) => line.split(' '));
const toPartOnePlan = (input) =>
  toPlan(input).map(([direction, distance]) => [direction, +distance]);
const toPartTwoPlan = (input) =>
  toPlan(input).map(([, , color]) => [
    DIRECTION[color.at(-2)],
    parseInt(color.slice(2, -2), 16),
  ]);

log(`Solution pt.1 ${solve(toPartOnePlan(rawInput))}`);
log(`Solution pt.2 ${solve(toPartTwoPlan(rawInput))}`);
