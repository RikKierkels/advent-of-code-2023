const input = require('../input');
const log = console.log;
const match = (pattern) => (string) => string.match(pattern).splice(1) ?? [];
const chunk = (xs, size) =>
  xs.reduce(
    (acc, x, i) => (
      i % size ? acc[acc.length - 1].push(x) : acc.push([x]), acc
    ),
    [],
  );
const split = (c) => (s) => s.split(c);
const splitOnWhiteSpace = split(' ');
const splitOnNewLine = split('\n');
const min = (a, b) => Math.min(a, b);
const almanacRegex = /seeds: ([\s\d]+)\nseed-to-soil map:\n([\s\d]+)\nsoil-to-fertilizer map:\n([\s\d]+)\nfertilizer-to-water map:\n([\s\d]+)\nwater-to-light map:\n([\s\d]+)\nlight-to-temperature map:\n([\s\d]+)\ntemperature-to-humidity map:\n([\s\d]+)\nhumidity-to-location map:\n([\s\d]+)/;

const ConversionMap = (map) => {
  const lines = map.map(([destination, source, length]) => ({
    hasSource: (n) => n >= source && n < source + length,
    getDestination: (n) => n - source + destination,
  }));

  return {
    getDestination: (n) =>
      lines.find((line) => line.hasSource(n))?.getDestination(n) ?? n,
  };
};

const almanac = input(__dirname, './input.txt');
const [seeds, ...maps] = match(almanacRegex)(almanac)
  .map((match) => splitOnNewLine(match.replace(/\n$/, '')))
  .map((seedsOrMap) =>
    seedsOrMap.length === 1
      ? seedsOrMap.flatMap(splitOnWhiteSpace).map((n) => +n)
      : ConversionMap(
          seedsOrMap.map(splitOnWhiteSpace).map((line) => line.map((n) => +n)),
        ),
  );

const minLocationPartOne = seeds
  .map((seed) =>
    maps.reduce((location, map) => map.getDestination(location), seed),
  )
  .reduce(min);

const minLocationPartTwo = Number.MAX_VALUE;

for (const [start, length] of chunk(seeds, 2)) {
  for (let offset = 0; offset < length; offset++) {
    const seed = start + offset;
    const location = maps.reduce(
      (location, map) => map.getDestination(location),
      seed,
    );
    minLocationPartTwo = min(location, minLocationPartTwo);
  }
}

log(`Solution pt.1 ${minLocationPartOne}`);
log(`Solution pt.2 ${minLocationPartTwo}`);
