const input = require('../input');
const log = console.log;
const match = (regex) => (s) => (s.match(regex) ?? []).splice(1);
const multiply = (a, b) => a * b;

const parseInput = (input, parseRulesFn) => {
  let [workflows, parts] = input
    .split('\n\n')
    .map((block) => block.split('\n'));

  return {
    workflows: workflows
      .map(match(/(\w+){(.+)}/))
      .map(([name, rules]) => ({
        name,
        rules: parseRulesFn(rules),
      }))
      .reduce(
        (workflows, { name, rules }) => ({ ...workflows, [name]: rules }),
        {},
      ),
    parts: parts
      .map(match(/{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/))
      .map(([x, m, a, s]) => ({ x: +x, m: +m, a: +a, s: +s })),
  };
};

const parseRulesWithEvaluation = (rules) =>
  rules.split(',').map((rule) =>
    rule.indexOf(':') === -1
      ? { condition: () => true, to: rule }
      : {
          condition: ({ x, m, a, s }) => eval(rule.split(':')[0]),
          to: rule.split(':')[1],
        },
  );

const parseRulesWithCondition = (rules) =>
  rules.split(',').map((rule) =>
    rule.indexOf(':') === -1
      ? { hasCondition: false, to: rule }
      : {
          hasCondition: true,
          to: rule.split(':')[1],
          ...(() => {
            const [category, operation, value] = match(/([xmas])([<>])(\d+)/)(
              rule.split(':')[0],
            );
            return { category, operation, value: +value };
          })(),
        },
  );

const sumOfAcceptedParts = (input) => {
  const { workflows, parts } = parseInput(input, parseRulesWithEvaluation);

  let accepted = [];

  for (const part of parts) {
    let workflow = 'in';

    for (;;) {
      const rules = workflows[workflow];
      const to = rules.reduce(
        (to, rule) => (to ? to : rule.condition(part) ? rule.to : ''),
        '',
      );

      if (to === 'A') {
        accepted = [...accepted, part];
        break;
      }
      if (to === 'R') break;

      workflow = to;
    }
  }

  return accepted.reduce((total, { x, m, a, s }) => total + (x + m + a + s), 0);
};

const toRange = (min, max) => ({ min, max });

const distinctCombinationsOfRatings = (input) => {
  const { workflows } = parseInput(input, parseRulesWithCondition);
  const ranges = {
    x: toRange(1, 4001),
    m: toRange(1, 4001),
    a: toRange(1, 4001),
    s: toRange(1, 4001),
  };

  const findCombinations = (ranges, workflows, workflow) => {
    if (workflow === 'A') {
      return Object.values(ranges)
        .map(({ min, max }) => max - min)
        .reduce(multiply);
    }
    if (workflow === 'R') {
      return 0;
    }

    let total = 0;
    const rules = workflows[workflow];

    for (const { hasCondition, category, operation, value, to } of rules) {
      if (!hasCondition) {
        return (total += findCombinations(ranges, workflows, to));
      }

      const { min, max } = ranges[category];

      if (operation === '>' && min > value) {
        return total + findCombinations(ranges, workflows, to);
      }

      if (operation === '<' && max <= value) {
        return total + findCombinations(ranges, workflows, to);
      }

      if (operation === '>' && max > value + 1) {
        total += findCombinations(
          {
            ...ranges,
            [category]: toRange(value + 1, max),
          },
          workflows,
          to,
        );
        ranges = { ...ranges, [category]: toRange(min, value + 1) };
      }

      if (operation === '<' && min < value) {
        total += findCombinations(
          {
            ...ranges,
            [category]: toRange(min, value),
          },
          workflows,
          to,
        );
        ranges = { ...ranges, [category]: toRange(value, max) };
      }
    }

    return total;
  };

  return findCombinations(ranges, workflows, 'in');
};

const system = input(__dirname, './input.txt');

log(`Solution pt.1 ${sumOfAcceptedParts(system)}`);
log(`Solution pt.2 ${distinctCombinationsOfRatings(system)}`);
