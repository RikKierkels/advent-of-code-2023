const input = require('../input');
const log = console.log;
const match = (pattern) => (string) => string.match(pattern).splice(1) ?? [];

let [instructions, nodes] = match(/^([RL]+)\n{2}([\w\s=,()]*)$/)(
  input(__dirname, './input.txt'),
);

instructions = instructions
  .split('')
  .map((instruction) => (instruction === 'L' ? 0 : 1));

nodes = nodes
  .split('\n')
  .map(match(/(\w{3}) = \((\w{3}), (\w{3})\)/))
  .reduce(
    (nodes, [from, left, right]) => ({
      ...nodes,
      [from]: [left, right],
    }),
    {},
  );

const navigateByCamel = (from, to, instructions, nodes) => {
  let steps = 0;

  while (from !== to) {
    const instruction = instructions[steps % instructions.length];
    from = nodes[from][instruction];
    steps++;
  }

  return steps;
};

const navigateByGhost = (from, to, instructions, nodes) => {
  // see: https://en.wikipedia.org/wiki/Euclidean_algorithm
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a, b) => (a * b) / gcd(a, b);

  const froms = Object.keys(nodes).filter((node) => node.endsWith(from));
  const fromSteps = froms.map(() => 0);

  for (let i = 0; i < froms.length; i++) {
    let steps = 0;
    from = froms[i];

    while (!from.endsWith(to)) {
      const instruction = instructions[steps % instructions.length];
      from = nodes[from][instruction];
      steps++;
    }

    fromSteps[i] = steps;
  }

  return fromSteps.reduce(lcm, 1);
};

log(`Solution pt.1 ${navigateByCamel('AAA', 'ZZZ', instructions, nodes)}`);
log(`Solution pt.2 ${navigateByGhost('A', 'Z', instructions, nodes)}`);
