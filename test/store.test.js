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

  s.down(key, score, d => {
    t.is(d, score - score)
  })

  key = random.word()
  s.random(key, d => {
    t.true(d > 0)
  })
})
