const input = require('../input');
const log = console.log;
const sum = (a, b) => a + b;

const predict = (sequence, predictFn) => {
  const first = sequence[0];
  if (sequence.every((value) => value === first)) return first;

  const differences = [];
  for (let i = 1; i < sequence.length; ++i) {
    differences.push(sequence[i] - sequence[i - 1]);
  }

  const prediction = predict(differences, predictFn);
  return predictFn(sequence, prediction);
};

const histories = input(__dirname, './input.txt')
  .split('\n')
  .map((history) => history.split(' '))
  .map((history) => history.map((n) => +n));

const sumOfNextValues = histories
  .map((history) =>
    predict(history, (sequence, prediction) => sequence.at(-1) + prediction),
  )
  .reduce(sum);
log(`Solution pt.1 ${sumOfNextValues}`);

const sumOfPreviousValues = histories
  .map((history) =>
    predict(history, (sequence, prediction) => sequence[0] - prediction),
  )
  .reduce(sum);
log(`Solution pt.2 ${sumOfPreviousValues}`);
