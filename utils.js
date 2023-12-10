const _ = require('lodash')

function gcd(a, b) {
  return !b ? a : gcd(b, a % b)
}

function lcm(a, b) {
  return (a * b) / gcd(a, b)
}

function lcmMany(nums) {
  let ret = nums[0]
  for (const num of nums) {
    ret = lcm(ret, num)
  }
  return ret
}

function getNeighbors([x, y]) {
  return [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ]
}

function coord2str(x, y) {
  return `${x},${y}`
}
function str2coord(s) {
  return s.split(',').map(_.parseInt)
}

module.exports = {
  gcd,
  lcm,
  lcmMany,
  getNeighbors,
  coord2str,
  str2coord,
}
