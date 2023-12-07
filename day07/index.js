const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`

function processInput(input) {
  return input
    .trim()
    .split('\n')
    .map((l) => {
      const [hand, bid] = l.split(' ')
      return { hand, bid: parseInt(bid, 10) }
    })
}

const HIGH_CARD = 1
const ONE_PAIR = 2
const TWO_PAIR = 3
const THREE_KIND = 4
const FULL_HOUSE = 5
const FOUR_KIND = 6
const FIVE_KIND = 7

function baseScore(cards) {
  const counts = Object.values(_.groupBy(cards))
    .map((a) => a.length)
    .sort()
    .join('')

  switch (true) {
    case counts === '11111':
      return HIGH_CARD
    case counts === '1112':
      return ONE_PAIR
    case counts === '122':
      return TWO_PAIR
    case counts === '113':
      return THREE_KIND
    case counts === '23':
      return FULL_HOUSE
    case counts === '14':
      return FOUR_KIND
    case counts === '5':
      return FIVE_KIND
    default:
      throw new Error(`Unknown hand type: ${counts} (${cards})`)
  }
}

function scoreHand(hand, typeValues, jokersWild = false) {
  const cards = hand.split('')

  let base
  if (jokersWild && hand.includes('J')) {
    const types = Object.keys(typeValues).filter((t) => t !== 'J')
    base = _.max(
      types.map((t) => {
        const newHand = hand.replaceAll('J', t).split('')
        return baseScore(newHand)
      }),
    )
  } else {
    base = baseScore(cards)
  }

  return (
    base * 1000000000000 +
    typeValues[cards[0]] * 1000000000 +
    typeValues[cards[1]] * 10000000 +
    typeValues[cards[2]] * 100000 +
    typeValues[cards[3]] * 1000 +
    typeValues[cards[4]]
  )
}

const input = processInput(realInput)

function part1() {
  const cardTypes = 'AKQJT98765432'.split('')
  const types = Object.fromEntries(cardTypes.map((t, i) => [t, cardTypes.length - i]))

  return _.sum(_.sortBy(input, ({ hand }) => scoreHand(hand, types)).map(({ bid }, idx) => bid * (idx + 1)))
}
console.log(part1()) // 248453531

function part2() {
  const cardTypes = 'AKQT98765432J'.split('')
  const types = Object.fromEntries(cardTypes.map((t, i) => [t, cardTypes.length - i]))

  return _.sum(_.sortBy(input, ({ hand }) => scoreHand(hand, types, true)).map(({ bid }, idx) => bid * (idx + 1)))
}
console.log(part2()) // 248781813
