/* @flow */
import redis, { createClient } from 'redis'
import { random } from 'lodash'
import Raven from 'raven'
import { CronJob } from 'cron'
import moment from 'moment'

import {
  RAVEN_DSN,
  REDIS_URL,
  TIMEZONE,
  INTERVAL
} from './const'

type Hook = (cnt: number) => void
type Score = { key: string, score: number }

module.exports = class Karma {
  _SET: string
  _PREFIX: string
  client: redis
  constructor (PREFIX: string) {
    this._PREFIX = PREFIX
    this._SET = this._key()

    if (RAVEN_DSN) {
      Raven.config(RAVEN_DSN).install()
    }

    this.client = createClient(REDIS_URL)
    this.client.on('error', err => {
      if (err) {
        throw err
      }
    })

    const cron = new CronJob({
      cronTime: `00 25 04 01 */${INTERVAL} *`,
      onTick: () => {
        this.clean()
      },
      start: false,
      timeZone: TIMEZONE
    })
    cron.start()
  }
  _key (month: number = moment().month()) {
    return `${this._PREFIX}:${moment().year()}:${parseInt(month / INTERVAL)}`
  }
  clean () {
    const prev = this._key(moment().subtract(1, 'months').month())
    this.client.ZREMRANGEBYSCORE(prev, 0, -1)
  }
  top (n: number, cb: (rank: Score[]) => void) {
    this.client.zrange(this._SET, 0, n, 'WITHSCORES', (err, res) => {
      if (err) {
        Raven.captureException(err)
      }
      cb(res)
    })
  }
  up (key: string, n: number, cb: Hook): void {
    this.client.zincrby(this._SET, n, key, (err, res) => {
      if (err) {
        Raven.captureException(err)
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
