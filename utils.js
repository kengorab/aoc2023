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

module.exports = {
  gcd,
  lcm,
  lcmMany,
}
