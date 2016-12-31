/* @flow */
const redis = require('redis')

module.exports = class Karma {
  client: redis
  constructor () {
    this.client = redis.createClient()
    this.client.on('error', err => {
      console.log('Error ' + err)
    })
  }
  up (thing: string, n: number): number {
    return 1
  }
  down (thing: string, n: number): number {
    return 1
  }
  random (thing: string, min: number = 1, max: number = 1): number {
    return 1
  }
}
