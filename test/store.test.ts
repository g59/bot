import { random } from 'faker'
import assert from 'assert'
import Store from '../src/store'

describe('Store', () => {
  let s: Store
  beforeEach(() => {
    s = new Store(random.alphaNumeric(30))
  })

  afterEach(() => {
    s.clearAll(s._key())
    s.quit()
  })

  it('after clear', done =>
    s.top(-1, (err, rank) => {
      assert(rank.length === 0)
      assert(err === null)
      done()
    }))

  it('random', done =>
    s.random(random.alphaNumeric(), (err, res) => {
      assert(parseInt(res, 10) === 1)
      assert(err === null)
      done()
    }))

  it('++ & --', done => {
    const key = random.alphaNumeric()
    const score1 = random.number({ max: 10 })
    s.up(key, score1, (_, d) => assert(d === score1.toString()))

    const score2 = random.number({ min: 0, max: 10 })
    s.up(key, score2, (err, now) => {
      assert(now === (score1 + score2).toString())
      assert(err === null)
      s.down(key, score2, (err2, next) => {
        assert(next === score1.toString())
        assert(err2 === null)
      })
    })

    s.top(-1, (err, rank) => {
      assert(rank.length === 2)
      assert(err === null)
      const max = parseInt(rank[1], 10)
      for (let i = 0; i < rank.length; i += 2) {
        assert(typeof rank[i] === 'string')
        assert(parseInt(rank[i + 1], 10) <= max)
      }
    })

    s.lowest(-1, (err, rank) => {
      assert(rank.length === 2)
      assert(err === null)
      const min = parseInt(rank[1], 10)
      for (let i = 0; i < rank.length; i += 2) {
        assert(typeof rank[i] === 'string')
        assert(parseInt(rank[i + 1], 10) >= min)
      }
      done()
    })
  })
})
