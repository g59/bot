import { createClient, RedisClient } from 'redis'
import { random } from 'lodash'
import Raven from 'raven'
import { CronJob } from 'cron'
import * as moment from 'moment'

import { RAVEN_DSN, REDIS_URL, TIMEZONE, INTERVAL } from './const'

export default class Karma {
  private _SET: string
  private _PREFIX: string
  private client: RedisClient
  constructor (PREFIX: string) {
    this._PREFIX = PREFIX

    if (RAVEN_DSN) {
      Raven.config(RAVEN_DSN).install()
    }

    this.client = createClient({ url: REDIS_URL })
    this.client.on('error', (err?: Error) => {
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
        if (prev === this._SET) {
          return
        }
        this.clearAll(prev)
      },
      start: false,
      timeZone: TIMEZONE
    })
    cron.start()
  }
  _key (month: number = moment().month()) {
    return `${this._PREFIX}:${moment().year()}:${month / INTERVAL}`
  }
  clearAll (key: string) {
    this.client.ZREMRANGEBYSCORE(key, 0, -1)
  }
  top (n: number, cb: Function) {
    this.client.zrevrange(
      this._key(),
      0,
      n,
      'WITHSCORES',
      (err: any, res: any) => {
        if (err) {
          Raven.captureException(err)
        }
        cb(res)
      }
    )
  }
  lowest (n: number, cb: Function) {
    this.client.zrange(
      this._key(),
      0,
      n,
      'WITHSCORES',
      (err: any, res: any) => {
        if (err) {
          Raven.captureException(err)
        }
        cb(res)
      }
    )
  }
  up (key: string, n: number, cb: (cnt: number) => void): void {
    this.client.zincrby(this._key(), n, key, (err: any, res: any) => {
      if (err) {
        Raven.captureException(err)
      }
      cb(res)
    })
  }
  down (key: string, n: number, cb: (cnt: number) => void): void {
    this.up(key, n * -1, cb)
  }
  random (
    key: string,
    cb: (cnt: number) => void,
    min: number = 1,
    max: number = 1
  ): void {
    this.up(key, random(min, max), cb)
  }
}
