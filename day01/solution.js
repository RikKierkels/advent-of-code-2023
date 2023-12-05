const input = require('../input');
const log = console.log;
const regex = (pattern) => new RegExp(pattern, 'g');
const match = (pattern) => (string) => string.match(pattern) ?? [];
const matchAll = (pattern) => (string) =>
  [...string.matchAll(pattern)].map(([_, match]) => match) ?? [];

const digits = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const calibrate = (matcher) =>
  input(__dirname, './input.txt')
    .split('\n')
    .map(matcher)
    .map((matches) => [matches.at(0), matches.at(-1)])
    .map((matches) => matches.map((match) => digits[match] ?? match))
    .map((digits) => digits.join(''))
    .map((number) => +number)
    .reduce((sum, number) => sum + number, 0);

const matchOnlyDigits = match(regex(/\d/));
const one = calibrate(matchOnlyDigits);
log(`Solution pt.1 ${one}`);

const matchDigitsAndLetters = matchAll(
  regex(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/),
);
const two = calibrate(matchDigitsAndLetters);
log(`Solution pt.2 ${two}`);
