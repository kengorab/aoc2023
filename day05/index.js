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
// console.log(JSON.stringify(input, null, 2))

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

function part1() {
  const locs = input.seeds.map((seed) => [seed, drill(seed)])
  return _.minBy(locs, ([, loc]) => loc)[1]
}
// console.log(part1()) // 157211394

function part2() {
  // const seeds = _.chunk(input.seeds, 2).flatMap(([start, len]) => _.range(start, start + len))
  //
  // const locs = seeds.map((seed) => [seed, drill(seed)])
  // return _.minBy(locs, ([, loc]) => loc)[1]
  let minLoc = Infinity
  for (const [start, len] of _.chunk(input.seeds, 2)) {
    console.log(start)
    for (let seed = start; seed < start + len; seed++) {
      const loc = drill(seed)
      if (loc < minLoc) {
        minLoc = loc
      }
    }
  }
  return minLoc
}
console.log(part2())
