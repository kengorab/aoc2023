const fs = require('fs')
const _ = require('lodash')
const { getNeighbors } = require('../utils')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`

function processInput(input) {
  const lines = input.trim().split('\n')

  const symbols = []
  const numbers = []
  for (let r = 0; r < lines.length; r++) {
    const line = lines[r]
    let num = []
    let numStart = -1
    for (let c = 0; c < line.length; c++) {
      const ch = line[c]
      if ('0' <= ch && ch <= '9') {
        if (numStart === -1) numStart = c

        num.push(ch)
      } else {
        if (num.length) {
          numbers.push([[numStart, r], num.join('')])
          numStart = -1
          num = []
        }

        if (ch !== '.') {
          symbols.push([[c, r], ch])
        }
      }
    }

    if (num.length) {
      numbers.push([[numStart, r], num.join('')])
      numStart = -1
      num = []
    }
  }

  return { symbols, numbers }
}

const { symbols, numbers } = processInput(realInput)

function part1() {
  const reachable = Array(numbers.length).fill(false)
  for (const [loc] of symbols) {
    const neighbors = getNeighbors(loc)
    for (const [c, r] of neighbors) {
      for (let n = 0; n < numbers.length; n++) {
        const [[nX, nY], num] = numbers[n]
        if (r === nY && nX <= c && c < nX + num.length) {
          reachable[n] = true
          break
        }
      }
    }
  }

  let sum = 0
  for (let i = 0; i < reachable.length; i++) {
    if (reachable[i]) {
      sum += _.parseInt(numbers[i][1])
    }
  }

  return sum
}
console.log(part1()) // 525181

function part2() {
  let sum = 0
  for (const [loc, sym] of symbols) {
    if (sym !== '*') continue

    const neighbors = getNeighbors(loc)
    const nums = new Set()
    for (const [c, r] of neighbors) {
      for (let n = 0; n < numbers.length; n++) {
        const [[nX, nY], num] = numbers[n]
        if (r === nY && nX <= c && c < nX + num.length) {
          nums.add(_.parseInt(num, 10))
          break
        }
      }
    }
    if (nums.size === 2) {
      const [l, r] = [...nums]
      sum += l * r
    }
  }

  return sum
}
console.log(part2()) // 84289137
