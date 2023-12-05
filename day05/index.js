const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`

function processInput(input) {
  const sections = input.trim().split('\n\n')
  const [, seeds] = sections[0].split(': ')

  const seedToSoil = sections[1]
    .split('\n')
    .slice(1)
    .map((l) => l.split(' ').map(_.parseInt))
  const soilToFertilizer = sections[2]
    .split('\n')
    .slice(1)
    .map((l) => l.split(' ').map(_.parseInt))
  const fertilizerToWater = sections[3]
    .split('\n')
    .slice(1)
    .map((l) => l.split(' ').map(_.parseInt))
  const waterToLight = sections[4]
    .split('\n')
    .slice(1)
    .map((l) => l.split(' ').map(_.parseInt))
  const lightToTemp = sections[5]
    .split('\n')
    .slice(1)
    .map((l) => l.split(' ').map(_.parseInt))
  const tempToHumidity = sections[6]
    .split('\n')
    .slice(1)
    .map((l) => l.split(' ').map(_.parseInt))
  const humidityToLocation = sections[7]
    .split('\n')
    .slice(1)
    .map((l) => l.split(' ').map(_.parseInt))

  return {
    seeds: seeds.split(' ').filter(Boolean).map(_.parseInt),
    seedToSoil,
    soilToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemp,
    tempToHumidity,
    humidityToLocation,
  }
}

const input = processInput(realInput)

function resolve(src, ranges) {
  for (const [dstStart, srcStart, len] of ranges) {
    if (srcStart <= src && src < srcStart + len) {
      return dstStart + (src - srcStart)
    }
  }
  return src
}

function drill(seed) {
  const soil = resolve(seed, input.seedToSoil)
  const fert = resolve(soil, input.soilToFertilizer)
  const water = resolve(fert, input.fertilizerToWater)
  const light = resolve(water, input.waterToLight)
  const temp = resolve(light, input.lightToTemp)
  const humidity = resolve(temp, input.tempToHumidity)
  return resolve(humidity, input.humidityToLocation)
}

function resolveRev(dst, ranges) {
  for (const [dstStart, srcStart, len] of ranges) {
    if (dstStart <= dst && dst < dstStart + len) {
      return srcStart + (dst - dstStart)
    }
  }
  return dst
}

function drillRev(loc) {
  const humidity = resolveRev(loc, input.humidityToLocation)
  const temp = resolveRev(humidity, input.tempToHumidity)
  const light = resolveRev(temp, input.lightToTemp)
  const water = resolveRev(light, input.waterToLight)
  const fert = resolveRev(water, input.fertilizerToWater)
  const soil = resolveRev(fert, input.soilToFertilizer)
  return resolveRev(soil, input.seedToSoil)
}

function part1() {
  return _.min(input.seeds.map(drill))
}
console.log(part1()) // 157211394

function part2() {
  const seedRanges = _.chunk(input.seeds, 2);

  let loc = 0
  while (true) {
    const seed = drillRev(loc)
    for (const [seedStart, len] of seedRanges) {
      if (seedStart <= seed && seed < seedStart + len) {
        return loc
      }
    }
    loc += 1
  }
}
console.log(part2()) // 50855035
