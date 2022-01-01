import { CronJob } from "cron";
import random from "lodash.random";
import moment from "moment";
import pino from "pino";
import { createClient } from "redis";

const INTERVAL: number =
  typeof process.env.INTERVAL === "string" ? Number(process.env.INTERVAL) : 3;
const debug = process.env.NODE_ENV === "test";

export default class Karma {
  private logger = pino();
  private _PREFIX: string;
  private client: ReturnType<typeof createClient>;
  constructor(PREFIX: string) {
    this._PREFIX = PREFIX;

    this.client = createClient({
      url: process.env.REDIS_URL,
    });
    this.client.on("error", (err) => this.logger.error(err));

    const cron = new CronJob({
      cronTime: `00 25 04 01 */${INTERVAL} *`,
      onTick: () => {
        const prev = this._key(moment().subtract(1, "months").month());
        this.clearAll(prev);
      },
      start: false,
      timeZone: process.env.TIMEZONE,
    });

    if (debug) {
      return;
    }
    cron.start();
  }

  connect() {
    return this.client.connect();
  }

  quit() {
    return this.client.quit();
  }

  _key(month: number = moment().month()) {
    return `${this._PREFIX}:${moment().year()}:${month / INTERVAL}`;
  }

  clearAll(key: string) {
    return this.client.zRemRangeByScore(key, 0, -1);
  }

  top(n: number) {
    return this.client.zRangeWithScores(this._key(), 0, n, { REV: true });
  }

  lowest(n: number) {
    return this.client.zRangeWithScores(this._key(), 0, n);
  }

  up(key: string, n: number) {
    return this.client.zIncrBy(this._key(), n, key);
  }

  down(key: string, n: number) {
    return this.up(key, n * -1);
  }

  random(key: string, min: number = 1, max: number = 1) {
    return this.up(key, random(min, max));
  }
}
