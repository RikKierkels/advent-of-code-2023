const input = require('../input');
const log = console.log;
const sum = (a, b) => a + b;

const generateCombinations = (characters, length) => {
  if (length === 0) return [''];
  if (length === 1) return characters;

  const combinations = [];

  for (const character of characters) {
    const subCombinations = generateCombinations(characters, length - 1);

    for (const subCombination of subCombinations) {
      const combination = subCombination + character;
      combinations.push(combination);
    }
  }

  return combinations;
};

const overlaps = (springs, combination) => {
  for (let i = 0; i < springs.length; i++) {
    if (springs[i] === '?') continue;
    if (springs[i] !== combination[i]) return false;
  }

  return true;
};

const createGroupMatcher = (groups) => {
  const last = groups.pop();
  return new RegExp(
    `^[^#]*(?<!#)${groups
      .map((group) => `#{${group}}[^#]+`)
      .join('')}#{${last}}`,
  );
};

const toNumberOfDamagedSprings = (s) => (s.match(/#/g) ?? []).length;

const findPossibleCombinations = (records) => {
  let numberOfCombinations = 0;

  for (const { springs, groups } of records) {
    const numberOfDamagedSprings = groups.reduce(sum);
    const matcher = createGroupMatcher(groups);
    const combinations = generateCombinations(['.', '#'], springs.length)
      .filter(
        (combination) =>
          toNumberOfDamagedSprings(combination) === numberOfDamagedSprings,
      )
      .filter((combination) => overlaps(springs, combination))
      .filter((combination) => matcher.test(combination));

    numberOfCombinations += combinations.length;
  }

  return numberOfCombinations;
};

const records = input(__dirname, 'input.example.txt')
  .split('\n')
  .map((record) => record.split(' '))
  .map(([springs, groups]) => ({
    springs: springs,
    groups: groups.split(',').map((n) => +n),
  }));

log(`Solution pt.1 ${findPossibleCombinations(records)}`);
// RIP this solution for part two :(
