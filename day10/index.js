const fs = require('fs')
const _ = require('lodash')
const { coord2str } = require('../utils')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
.....
.S-7.
.|.|.
.L-J.
.....
`
const demoInput2 = `
-L|F7
7S-7|
L|7||
-L-J|
L|-JF
`
const demoInput3 = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`
const demoInput4 = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`
const demoInput5 = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`
const demoInput6 = `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`

function processInput(input) {
  let start = '-1,-1'
  const lines = input.trim().split('\n')
  const height = lines.length
  const width = lines[0].length
  const map = Object.fromEntries(
    lines.flatMap((l, y) => {
      return l
        .split('')
        .map((p, x) => {
          if (p === 'S') {
            start = `${x},${y}`
          }
          return [`${x},${y}`, p]
        })
        .filter(([, p]) => p !== '.')
    }),
  )

  console.assert(start !== '-1,-1')
  return { width, height, map, start }
}

function possibilities(map, loc) {
  const curPipe = map[loc]
  const [x, y] = loc.split(',').map(_.parseInt)
  switch (curPipe) {
    case '|':
      return [`${x},${y - 1}`, `${x},${y + 1}`]
    case '-':
      return [`${x - 1},${y}`, `${x + 1},${y}`]
    case 'L':
      return [`${x},${y - 1}`, `${x + 1},${y}`]
    case 'J':
      return [`${x},${y - 1}`, `${x - 1},${y}`]
    case '7':
      return [`${x - 1},${y}`, `${x},${y + 1}`]
    case 'F':
      return [`${x + 1},${y}`, `${x},${y + 1}`]
    case 'S':
      const opts = []
      const up = map[`${x},${y - 1}`]
      if (up === '|' || up === '7' || up === 'F') {
        opts.push(`${x},${y - 1}`)
      }
      const down = map[`${x},${y + 1}`]
      if (down === '|' || down === 'L' || down === 'J') {
        opts.push(`${x},${y + 1}`)
      }
      const left = map[`${x - 1},${y}`]
      if (left === '-' || left === 'L' || left === 'F') {
        opts.push(`${x - 1},${y}`)
      }
      const right = map[`${x + 1},${y}`]
      if (right === '-' || right === 'J' || right === '7') {
        opts.push(`${x + 1},${y}`)
      }
      return opts
    default:
      throw new Error('uh oh')
  }
}

function followPath(start, map) {
  let [p] = possibilities(map, start)
  const seen = new Set([start, p])
  const path = [start, p]

  while (p !== start) {
    const nexts = possibilities(map, p).filter((p) => !seen.has(p))
    if (nexts.length === 0) break
    p = nexts[0]
    seen.add(p)
    path.push(p)
  }

  const steps = path.length / 2
  return { steps, path }
}

const { width, height, map, start } = processInput(realInput)
const { steps, path } = followPath(start, map)

function part1() {
  return steps
}
console.log(part1()) // 7066

function part2() {
  let res = 0

  const pathSet = new Set(path)
  map[start] = '7' // This only works for my real input and is not a general purpose solution
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pathSet.has(coord2str(x, y))) continue

      let wallCount = 0
      let sawDownwardPipe = false
      let sawUpwardPipe = false
      for (let dx = 0; x + dx < width; dx++) {
        const pt = coord2str(x + dx, y)
        if (!pathSet.has(pt)) continue

        const tile = map[pt]
        switch (tile) {
          case '|': {
            wallCount += 1
            break
          }
          case 'L': {
            sawUpwardPipe = true
            break
          }
          case 'J': {
            wallCount += sawUpwardPipe ? 2 : 1
            sawUpwardPipe = false
            sawDownwardPipe = false
            break
          }
          case '7': {
            wallCount += sawDownwardPipe ? 2 : 1
            sawUpwardPipe = false
            sawDownwardPipe = false
            break
          }
          case 'F':
            sawDownwardPipe = true
            break
        }
      }

      if (wallCount % 2 === 1) {
        res += 1
      }
    }
  }

  return res
}
console.log(part2()) // 401
