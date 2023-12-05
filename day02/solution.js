const input = require('../input');
const log = console.log;
const match = (pattern) => (string) => string.match(pattern).splice(1) ?? [];
const max = (a, b) => (a > b ? a : b);

const extractMaximumNumberOfCubes = (sets) =>
  sets
    .split(';')
    .flatMap((set) => set.split(','))
    .map(match(/(.*) (.*)/))
    .reduce(
      (cubes, [cubeCount, cubeName]) => ({
        ...cubes,
        [cubeName]: max(cubes[cubeName], +cubeCount),
      }),
      { red: 0, green: 0, blue: 0 },
    );

const solve = (filterFn, reduceFn) =>
  input(__dirname, './input.txt')
    .split('\n')
    .map(match(/Game (\d+): (.*)/))
    .map(([id, sets]) => ({ id: +id, ...extractMaximumNumberOfCubes(sets) }))
    .filter(filterFn)
    .reduce(reduceFn, 0);

const one = solve(
  (game) => game.red < 13 && game.green < 14 && game.blue < 15,
  (sumOfIds, game) => sumOfIds + game.id,
);
log(`Solution pt.1 ${one}`);

const two = solve(
  () => true,
  (sumOfPowers, game) => sumOfPowers + game.red * game.green * game.blue,
);
log(`Solution pt.2 ${two}`);
