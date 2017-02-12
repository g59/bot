import test from 'ava'
import { random } from 'faker'
import Store from '../src/store'

test('store up', t => {
  const s = new Store()
  t.is(typeof s.up, 'function')
  const score = 1
  const key = random.word()
  s.up(key, score, d => {
    t.is(d, score)
  })
})
