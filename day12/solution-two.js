const input = require('../input');
const log = console.log;

const generateCombinations = ({ springs, groups }, cache = {}) => {
  if (!springs.length) return groups.length ? 0 : 1;
  if (!groups.length) return springs.includes('#') ? 0 : 1;

  const key = JSON.stringify({ springs, groups });
  if (cache[key]) return cache[key];

  let combinations = 0;

  const character = springs[0];
  if (['.', '?'].includes(character)) {
    combinations += generateCombinations(
      {
        springs: springs.slice(1),
        groups,
      },
      cache,
    );
  }

  const group = groups[0];
  if (character === '.') {
    cache[key] = combinations;
    return combinations;
  } else {
    if (
      group <= springs.length &&
      !springs.slice(0, group).includes('.') &&
      (group === springs.length || springs[group] !== '#')
    ) {
      combinations += generateCombinations(
        {
          springs: springs.slice(group + 1),
          groups: groups.slice(1),
        },
        cache,
      );
    }
  }

  cache[key] = combinations;
  return combinations;
};

const findPossibleCombinations = (records) => {
  let count = 0;

  for (const record of records) {
    count += generateCombinations(record);
    log(count);
  }

  return count;
};

const records = input(__dirname, 'input.txt')
  .split('\n')
  .map((record) => record.split(' '))
  .map(([springs, groups]) => ({
    springs: springs.split(''),
    groups: groups.split(',').map((n) => +n),
  }))
  .map(({ springs, groups }) => ({
    springs: Array(5).fill(springs).flat(),
    groups: Array(5).fill(groups).flat(),
  }));

log(`Solution pt.2 ${findPossibleCombinations(records)}`);
