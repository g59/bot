const assert = require('assert')
const random = require('faker').random

describe('store', () => {
  const Store = require('../src/store')
  it('load', () => {
    assert(Store)
  })

  it('up', done => {
    const s = new Store()
    assert(typeof s.up === 'function')
    const score = 1
    const key = random.word()
    s.up(key, score, d => {
      assert(d === score)
    })

    s.up(key, score, d => {
      assert(d === score * 2)
      done()
    })
  })
})
