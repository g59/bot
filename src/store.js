/* @flow */
const redis = require('redis')
const random = require('lodash').random

type Hook = (cnt: number) => void
type Score = { key: string, score: number }

module.exports = class Karma {
  SET: string
  client: redis
  constructor (name: string) {
    this.SET = name
    this.client = redis.createClient(process.env.REDIS_URL)
    this.client.on('error', err => {
      if (err) {
        throw err
      }
    })
  }
  top (n: number, cb: (rank: Score[]) => void) {
    this.client.zrange(this.SET, 0, n, 'WITHSCORES', (err, res) => {
      if (err) {
        console.error(err)
      }
      cb(res)
    })
  }
  up (key: string, n: number, cb: Hook): void {
    this.client.zincrby(this.SET, n, key, (err, res) => {
      if (err) {
        console.error(err)
      }
      cb(res)
    })
  }
  down (key: string, n: number, cb: Hook): void {
    this.up(key, n * -1, cb)
  }
  random (key: string, cb: Hook, min: number = 1, max: number = 1): void {
    this.up(key, random(min, max), cb)
  }
}
