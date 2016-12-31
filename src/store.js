/* @flow */
const redis = require('redis')
const random = require('lodash').random

type Callback = (cnt: number) => void

const MEMBER = 'KARMASTORE'
const zadd = (client: redis, key, n, cb: Callback) => {
  client.zadd([key, n, MEMBER], (err, res) => {
    if (err) {
      console.error(err)
    }
    cb(res)
  })
}

const zincrby = (client: redis, key: string, n: number, cb: Callback) => {
  client.zincrby([key, n, MEMBER], (err, res) => {
    if (err) {
      console.error(err)
    }
    cb(res)
  })
}

module.exports = class Karma {
  MEMBER: string
  client: redis
  constructor () {
    this.client = redis.createClient(process.env.REDIS_URL)
    this.client.on('error', err => {
      if (err) {
        throw err
      }
    })
  }
  up (key: string, n: number, cb: Callback) {
    this.client.zscore(key, MEMBER, (err, res) => {
      if (err) {
        console.error(err)
      }
      console.log(res)
      if (res) {
        zincrby(this.client, key, res + n, cb)
        return
      }
      zadd(this.client, key, n, cb)
    })
  }
  down (key: string, n: number, cb: Callback) {
    this.up(key, n * -1, cb)
  }
  random (key: string, min: number = 1, max: number = 1, cb: Callback) {
    this.up(key, random(min, max), cb)
  }
}
