import { createClient, RedisClient, Callback } from 'redis'
import { random } from 'lodash'
import Sentry from '@sentry/node'
import { CronJob } from 'cron'
import * as moment from 'moment'
import { RAVEN_DSN, REDIS_URL, TIMEZONE, INTERVAL } from './const'

export default class Karma {
  private _PREFIX: string
  private client: RedisClient
  constructor (PREFIX: string) {
    this._PREFIX = PREFIX

    if (RAVEN_DSN) {
      Sentry.init({ dsn: RAVEN_DSN, debug: process.env.NODE_ENV === 'test' })
    }

    this.client = createClient({ url: REDIS_URL })
    this.client.on('error', err => {
      if (err) {
        throw err
      }
    })

    const cron = new CronJob({
      cronTime: `00 25 04 01 */${INTERVAL} *`,
      onTick: () => {
        const prev = this._key(
          moment()
            .subtract(1, 'months')
            .month()
        )
        this.clearAll(prev)
      },
      start: false,
      timeZone: TIMEZONE
    })
    if (process.env.NODE_ENV === 'test') {
      return
    }
    cron.start()
  }

  quit () {
    this.client.quit()
  }

  _key (month: number = moment().month()) {
    return `${this._PREFIX}:${moment().year()}:${month / INTERVAL}`
  }

  clearAll (key: string) {
    this.client.ZREMRANGEBYSCORE(key, 0, -1)
  }

  top (n: number, cb: Callback<string[]>) {
    this.client.zrevrange(this._key(), 0, n, 'WITHSCORES', (err, res) => {
      if (err) {
        Sentry.captureException(err)
      }
      cb(err, res)
    })
  }

  lowest (n: number, cb: Callback<string[]>) {
    this.client.zrange(this._key(), 0, n, 'WITHSCORES', (err, res) => {
      if (err) {
        Sentry.captureException(err)
      }
      cb(err, res)
    })
  }

  up (key: string, n: number, cb: Callback<string>): void {
    this.client.zincrby(this._key(), n, key, (err, res) => {
      if (err) {
        Sentry.captureException(err)
      }
      cb(err, res)
    })
  }

  down (key: string, n: number, cb: Callback<string>): void {
    this.up(key, n * -1, cb)
  }

  random (
    key: string,
    cb: Callback<string>,
    min: number = 1,
    max: number = 1
  ): void {
    this.up(key, random(min, max), cb)
  }
}
