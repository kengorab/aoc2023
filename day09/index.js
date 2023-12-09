const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`

function processInput(input) {
  return input
    .trim()
    .split('\n')
    .map((l) => {
      return l.split(' ').map(_.parseInt)
    })
}

const input = processInput(realInput)

function calcDerivative(seq) {
  let allZero = true
  const D = []
  for (let i = 1; i < seq.length; i++) {
    const d = seq[i] - seq[i - 1]
    D.push(d)
    allZero &&= d === 0
  }

  return { allZero, D }
}

function calcDerivatives(seq) {
  const derivatives = []
  let d = calcDerivative(seq)
  derivatives.push(d.D)
  while (!d.allZero) {
    seq = d.D
    d = calcDerivative(seq)
    derivatives.push(d.D)
  }

  return derivatives
}

function findNext(seq, derivatives, part2 = false) {
  for (let i = derivatives.length - 2; i >= 0; i--) {
    const D = derivatives[i]
    const Dprev = derivatives[i + 1]
    if (part2) {
      D.push(_.last(D) - _.last(Dprev))
    } else {
      D.push(_.last(D) + _.last(Dprev))
    }
  }

  if (part2) {
    return _.last(seq) - _.last(derivatives[0])
  } else {
    return _.last(seq) + _.last(derivatives[0])
  }
}

function part1() {
  let sum = 0
  for (const seq of input) {
    sum += findNext(seq, calcDerivatives(seq))
  }
  return sum
}
console.log(part1()) // 2043677056

function part2() {
  let sum = 0
  for (const seq of input) {
    const Ds = calcDerivatives(seq)
    Ds.forEach((d) => d.reverse())
    seq.reverse()
    sum += findNext(seq, Ds, true)
  }
  return sum
}

console.log(part2()) // 1062
