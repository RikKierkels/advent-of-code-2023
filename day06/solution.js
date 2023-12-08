const input = require('../input');
const log = console.log;
const zip = (xs, ys) => xs.map((x, i) => [x, ys[i]]);
const multiply = (x, y) => x * y;

const [times, distances] = input(__dirname, './input.txt')
  .replaceAll(/\s{2,}/g, ' ')
  .match(/Time:\s+([\s\d]+)\nDistance:\s+([\s\d]+)/)
  .splice(1)
  .map((line) => line.split(' ').map((n) => +n));

const race = (totalTime, record) => {
  let solutions = 0;
  for (let holdingTime = 0; holdingTime <= totalTime; holdingTime++) {
    const racingTime = totalTime - holdingTime;
    const travelled = holdingTime * racingTime;

    if (travelled <= record) continue;
    ++solutions;
  }
  return solutions;
};

const solutionsPartOne = zip(times, distances)
  .map(([time, record]) => race(time, record))
  .reduce(multiply);

const solutionsPartTwo = race(+times.join(''), +distances.join(''));

log(`Solution pt.1 ${solutionsPartOne}`);
log(`Solution pt.2 ${solutionsPartTwo}`);
