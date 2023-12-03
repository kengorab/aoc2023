const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`

function processInput(input) {
  return input
    .trim()
    .split('\n')
    .map((l, idx) => {
      const gameId = idx + 1
      const cubeReveals = l.split(': ')[1].split('; ')
      const reveals = cubeReveals.map((reveal) => {
        return Object.fromEntries(
          reveal.split(', ').map((c) => {
            const [num, color] = c.split(' ')
            return [color, _.parseInt(num, 10)]
          }),
        )
      })
      return { gameId, reveals }
    })
}

const input = processInput(realInput)

let part1 = 0
let part2 = 0

for (const { gameId, reveals } of input) {
  const maxR = _.max(_.map(reveals, 'red'))
  const maxG = _.max(_.map(reveals, 'green'))
  const maxB = _.max(_.map(reveals, 'blue'))

  if (maxR <= 12 && maxG <= 13 && maxB <= 14) {
    part1 += gameId
  }

  part2 += maxR * maxG * maxB
}

console.log('part 1', part1) // 2204
console.log('part 2', part2) // 71036
