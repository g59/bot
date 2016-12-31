/* @flow */
const redis = require('redis')
const random = require('lodash').random

type Hook = (cnt: number) => number

const KEY = 'KARMASTORE'

module.exports = class Karma {
  client: redis
  constructor () {
    this.client = redis.createClient(process.env.REDIS_URL)
    this.client.on('error', err => {
      if (err) {
        throw err
      }
    })
  }
  up (member: string, n: number, cb: Hook) {
    this.client.zscore(KEY, member, (err, prev) => {
      if (err) {
        return console.error(err)
      }
      if (prev) {
        return this.client.zincrby(KEY, n, member, (err, res) => {
          console.error(err, res)
          cb(res)
        })
      }
      return this.client.zadd([KEY, n, member], (err, res) => {
        console.error('add', err, res)
        cb(res)
      })
    })
  }
  down (key: string, n: number, cb: Hook) {
    this.up(key, n * -1, cb)
  }
  random (key: string, min: number = 1, max: number = 1, cb: Hook) {
    this.up(key, random(min, max), cb)
  }
}
