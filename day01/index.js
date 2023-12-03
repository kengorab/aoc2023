const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync(`${__dirname}/input.txt`, { encoding: 'utf-8' })
const demoInput = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`
const demoInput2 = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`

function processInput(input) {
  return input
    .trim()
    .split('\n')
    .map((l) => {
      return l.split('')
    })
}

function part1() {
  const rows = processInput(realInput)

  return _.sum(
    rows.map((chars) => {
      const row = chars.filter((ch) => '0' <= ch && ch <= '9').map(_.parseInt)
      return _.first(row) * 10 + _.last(row)
    }),
  )
}
console.log(part1()) // 54605

// wrong too low 54926

function part2() {
  const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

  const rows = processInput(realInput)

  let sum = 0
  for (const row of rows) {
    let firstNum
    outer: for (let i = 0; i < row.length; i++) {
      const ch = row[i]
      if ('0' <= ch && ch <= '9') {
        firstNum = _.parseInt(ch)
        break
      } else {
        for (let j = 0; j < digits.length; j++) {
          const digit = digits[j]
          const slice = row.slice(i, i + digit.length).join('')
          if (slice === digit) {
            firstNum = j + 1
            break outer
          }
        }
      }
    }

    let lastNum
    outer: for (let i = row.length; i >= 0; i--) {
      const ch = row[i]
      if ('0' <= ch && ch <= '9') {
        lastNum = _.parseInt(ch)
        break
      } else {
        for (let j = 0; j < digits.length; j++) {
          const digit = digits[j]
          const slice = row.slice(i, i + digit.length).join('')
          if (slice === digit) {
            lastNum = j + 1
            break outer
          }
        }
      }
    }

    sum += firstNum * 10 + lastNum
  }

  return sum
}
console.log(part2())
