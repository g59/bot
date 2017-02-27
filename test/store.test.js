/* @flow */
import test from 'ava'
import { random } from 'faker'
import Store from '../src/store'

test('store', t => {
  const s = new Store(random.word())
  t.is(typeof s.up, 'function')

  const score = random.number()

  let key = random.word()
  s.up(key, score, d => {
    t.is(d, score)
  })

  s.up(key, score, d => {
    t.is(d, score + score)
  })

  key = random.word()
  s.down(key, score, d => {
    t.is(d, score - score)
  })

  key = random.word()
  s.random(key, d => {
    t.true(d > 0)
  })

  t.is(typeof s._key(), 'string')

  s.top(-1, rank => {
    t.is(rank.length, 3)
    rank.forEach(d => {
      t.true(typeof d.key === 'string')
      t.true(typeof d.score === 'number')
    })
  })

  s.clean()
  s.top(-1, rank => {
    t.is(rank.length, 0)
  })
})
