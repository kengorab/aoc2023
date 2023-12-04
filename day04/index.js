const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`

function processInput(input) {
  return input
    .trim()
    .split('\n')
    .map((l, idx) => {
      const [, numbers] = l.split(': ')
      const [winning, given] = numbers.split(' | ')
      const W = winning.split(' ').filter(Boolean).map(_.parseInt)
      const G = given.split(' ').filter(Boolean).map(_.parseInt)
      return { cardNum: idx + 1, winning: W, given: G }
    })
}

const cards = processInput(realInput)

function part1() {
  return cards.reduce((acc, { winning, given }) => {
    const G = new Set(given)
    const W = winning.filter((w) => G.has(w))
    if (W.length) {
      return acc + Math.pow(2, W.length - 1)
    } else {
      return acc
    }
  }, 0)
}
console.log(part1()) // 25004

function part2() {
  const M = {}
  let total = cards.length

  const q = [...cards].reverse()
  while (q.length) {
    const { cardNum, winning, given } = q.pop()

    if (!M[cardNum]) {
      const G = new Set(given)
      const W = winning.filter((w) => G.has(w))
      const numW = W.length
      M[cardNum] = _.range(cardNum + 1, cardNum + 1 + numW)
    }

    total += M[cardNum].length

    for (const c of M[cardNum]) {
      q.push(cards[c - 1])
    }
  }

  return total
}
console.log(part2()) // 14427616
