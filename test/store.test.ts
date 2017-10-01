import 'mocha'
import { random } from 'faker'
import assert from 'assert'

import * as Store from '../src/store'

const s = new Store(random.alphaNumeric())

describe('', () => {
  afterEach(() => {
    assert(typeof s._key() === 'string')
    s.clearAll(s._key())
  })

  it('after clear', () => {
    return s.top(-1, (rank: any) => {
      assert(rank.length === 0)
    })
  })

  it('++ & --', done => {
    const key = random.alphaNumeric()
    const score1 = random.number({ max: 10 })
    s.up(key, score1, (d: any) => {
      assert(d === score1.toString())
      done()
    })

    const score2 = random.number({ min: 0, max: 10 })
    s.up(key, score2, (d: any) => {
      assert(d === (score1 + score2).toString())
      done()
    })

    s.down(key, score2, (d: any) => {
      assert(d === score1.toString())
    })

    s.random(random.alphaNumeric(), (d: any) => {
      assert(parseInt(d, 10) === 1)
    })

    s.top(-1, rank => {
      assert(rank.length === 4)
      const max = parseInt(rank[1], 10)
      for (let i = 0; i < rank.length; i += 2) {
        assert(typeof rank[i] === 'string')
        assert(parseInt(rank[i + 1], 10) <= max)
      }
      done()
    })

    s.lowest(-1, rank => {
      assert(rank.length === 4)
      const min = parseInt(rank[1], 10)
      for (let i = 0; i < rank.length; i += 2) {
        assert(typeof rank[i] === 'string')
        assert(parseInt(rank[i + 1], 10) >= min)
      }
      done()
    })
  })
})
