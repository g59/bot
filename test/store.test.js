/* @flow */
import test from 'ava'
import {random} from 'faker'
import Store from '../src/store'

const s = new Store(random.alphaNumeric())

test.afterEach(t => {
  t.is(typeof s._key(), 'string')
  s.clearAll(s._key())
})

test.cb('after clear', t => {
  s.top(-1, rank => {
    t.is(rank.length, 0)
    t.end()
  })
})

test.cb('++ & --', t => {
  const key = random.alphaNumeric()
  const score1 = random.number({max: 10})
  s.up(key, score1, d => {
    t.is(d, score1.toString())
  })

  const score2 = random.number({min: 0, max: 10})
  s.up(key, score2, d => {
    t.is(d, (score1 + score2).toString())
  })

  s.down(key, score2, d => {
    t.is(d, score1.toString())
  })

  s.random(random.alphaNumeric(), d => {
    t.is(parseInt(d, 10), 1)
  })

  s.top(-1, rank => {
    t.is(rank.length, 4)
    const max = parseInt(rank[1], 10)
    for (let i = 0; i < rank.length; i += 2) {
      t.true(typeof rank[i] === 'string')
      t.true(parseInt(rank[i + 1], 10) <= max)
    }
    t.end()
  })

  s.lowest(-1, rank => {
    t.is(rank.length, 4)
    const min = parseInt(rank[1], 10)
    for (let i = 0; i < rank.length; i += 2) {
      t.true(typeof rank[i] === 'string')
      t.true(parseInt(rank[i + 1], 10) >= min)
    }
    t.end()
  })
})
