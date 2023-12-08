const fs = require('fs')
const _ = require('lodash')
const { lcmMany } = require('../utils')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`

const demoInput2 = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`
const demoInput3 = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`

function processInput(input) {
  const sections = input.trim().split('\n\n')

  const instructions = sections[0].split('')

  const nodes = Object.fromEntries(
    sections[1].split('\n').map((l) => {
      const [start, ends] = l.split(' = ')
      const endNodes = ends.replace('(', '').replace(')', '').split(', ')

      return [start, endNodes]
    }),
  )

  return { instructions, nodes }
}

const input = processInput(realInput)

function follow(start, { instructions, nodes }) {
  let i = 0
  let node = start

  while (!node.endsWith('Z')) {
    const instr = instructions[i % instructions.length]
    if (instr === 'R') {
      node = nodes[node][1]
    } else if (instr === 'L') {
      node = nodes[node][0]
    } else {
      throw new Error(`Unknown direction ${instr}`)
    }

    i += 1
  }

  return i
}

function part1() {
  return follow('AAA', input)
}
console.log(part1()) // 17141

function part2() {
  const nodes = Object.keys(input.nodes).filter((name) => name.endsWith('A'))

  const stepCounts = nodes.map((node) => follow(node, input))

  return lcmMany(stepCounts)
}
console.log(part2()) // 10818234074807
