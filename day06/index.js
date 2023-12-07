const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
// const demoInput = `
// Time:      7  15   30
// Distance:  9  40  200
// `
const demoInput = [
  { time: 7, dist: 9 },
  { time: 15, dist: 40 },
  { time: 30, dist: 200 },
]

/*


t: time
v: velocity
D: distance

D = vt
D = v(T - v) = vT - v^2

dD/dv = T - 2v
v_max => dD/dv => 0 = T/2

D = vT - v^2
9 = 7v - v^2
0 = -9 + 7v - v^2


 */

function part1() {
  // Good luck!
}
console.log(part1())
