import 'mocha'
import { random } from 'faker'
import * as assert from 'power-assert'

import Store from '../src/store'

describe('Store', () => {
  const s = new Store('prefix')
  afterEach(() => s.clearAll(s._key()))

  it('after clear', () =>
    s.top(-1, (rank: any) => {
      assert(rank.length === 0)
    }))

  it('++ & --', done => {
    const key = random.alphaNumeric()
    const score1 = random.number({ max: 10 })
    s.up(key, score1, (d: any) => {
      assert(d === score1.toString())
    })

    const score2 = random.number({ min: 0, max: 10 })
    s.up(key, score2, (d: any) => {
      assert(d === (score1 + score2).toString())
      s.down(key, score2, (d: any) => {
        assert(d === score1.toString())
        done()
      })
    })

    // s.random(random.alphaNumeric(), (d: any) => {
    //   assert.equal(parseInt(d, 10), 1)
    // })

    // s.top(-1, (rank: any) => {
    //   assert(rank.length === 4)
    //   const max = parseInt(rank[1], 10)
    //   for (let i = 0; i < rank.length; i += 2) {
    //     assert(typeof rank[i] === 'string')
    //     assert(parseInt(rank[i + 1], 10) <= max)
    //   }
    // })

    //   s.lowest(-1, (rank: any) => {
    //     assert(rank.length === 4)
    //     const min = parseInt(rank[1], 10)
    //     for (let i = 0; i < rank.length; i += 2) {
    //       assert(typeof rank[i] === 'string')
    //       assert(parseInt(rank[i + 1], 10) >= min)
    //     }
    //     done()
    //   })
  })
})
