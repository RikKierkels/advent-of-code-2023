const input = require('../input');
const log = console.log;
const compose = (...fns) => (x) => fns.reduceRight((y, f) => f(y), x);
const transpose = (array) =>
  array[0].map((_, col) => array.map((row) => row[col]));
const map = (fn) => (array) => array.map(fn);
const reduce = (...args) => (array) => array.reduce(...args);
const sort = (s) => s.split('').sort().join('');
const sortReversed = (s) => s.split('').sort().reverse().join('');
const sum = (a, b) => a + b;

const split = (separator) => (s) => s.split(separator);
const splitOnSupportBeam = split('#');
const splitOnCharacter = split('');

const join = (separator) => (s) => s.join(separator);
const joinOnSupportBeam = join('#');
const joinOnCharacter = join('');

const transposePlatform = compose(
  map(joinOnCharacter),
  transpose,
  map(splitOnCharacter),
);

const tiltY = (sort) =>
  compose(
    transposePlatform,
    transposePlatform,
    transposePlatform,
    map(joinOnSupportBeam),
    map(map(sort)),
    map(splitOnSupportBeam),
    transposePlatform,
  );

const tiltX = (sort) =>
  compose(map(joinOnSupportBeam), map(map(sort)), map(splitOnSupportBeam));

const tilt = {
  north: tiltY(sortReversed),
  east: tiltX(sort),
  south: tiltY(sort),
  west: tiltX(sortReversed),
};

const cycle = compose(tilt.east, tilt.south, tilt.west, tilt.north);

const cycleQuiteAlot = (platform) => {
  const cycles = 1000000000;
  const seen = {};

  for (let index = 1; index <= cycles; index++) {
    platform = cycle(platform);
    const key = platform.join('');
    const seenAt = seen[key];

    if (!seenAt) {
      seen[key] = index;
      continue;
    }

    if ((cycles - index) % (index - seenAt) === 0) {
      break;
    }
  }

  return platform;
};

const sumLoadOfRow = reduce(
  (load, character, index, characters) =>
    (load += character === 'O' ? characters.length - index : 0),
  0,
);

const sumLoadOfPlatform = compose(
  reduce(sum),
  map(sumLoadOfRow),
  map(splitOnCharacter),
  transposePlatform,
);

let platform = input(__dirname, './input.txt').split('\n');
const solvePartOne = compose(sumLoadOfPlatform, tilt.north);
const solvePartTwo = compose(sumLoadOfPlatform, cycleQuiteAlot);

log(`Solution pt.1 ${solvePartOne(platform)}`);
log(`Solution pt.2 ${solvePartTwo(platform)}`);
