const input = require('../input');
const log = console.log;
const transpose = (array) =>
  array[0].map((_, col) => array.map((row) => row[col]));

const reflection = (pattern, allowedSmudges) => {
  const numberOfRows = pattern.length;
  const numberOfColumns = pattern[0].length;

  for (let mirror = 1; mirror < numberOfColumns; mirror++) {
    let smudges = 0;

    for (let row = 0; row < numberOfRows; row++) {
      for (
        let column = Math.max(0, mirror - (numberOfColumns - mirror));
        column < mirror;
        column++
      ) {
        const left = pattern[row][column];
        const right = pattern[row][mirror + (mirror - column - 1)];
        smudges += left !== right;
        if (smudges > allowedSmudges) break;
      }
      if (smudges > allowedSmudges) break;
    }

    if (smudges === allowedSmudges) return mirror;
  }

  return 0;
};

const summarize = (patterns, allowedSmudges) =>
  patterns.reduce((summary, pattern) => {
    summary += reflection(pattern, allowedSmudges);
    summary += reflection(transpose(pattern), allowedSmudges) * 100;
    return summary;
  }, 0);

const patterns = input(__dirname, 'input.txt')
  .split('\n\n')
  .map((pattern) => pattern.split('\n'))
  .map((pattern) => pattern.map((line) => line.split('')));

log(`Solution pt.1 ${summarize(patterns, 0)}`);
log(`Solution pt.2 ${summarize(patterns, 1)}`);
