import { random } from "faker";
import Store from "../src";

describe("Store", () => {
  let s: Store;
  beforeEach(() => {
    s = new Store(random.alphaNumeric(30));
  });

  afterEach(() => {
    s.clearAll(s._key());
    s.quit();
  });

  it("after clear", (done) =>
    s.top(-1, (err, rank) => {
      expect(rank).toHaveLength(0);
      expect(err === null).toBeTruthy();
      done();
    }));

  it("random", (done) =>
    s.random(random.alphaNumeric(), (err, res) => {
      expect(parseInt(res, 10) === 1).toBeTruthy();
      expect(err === null).toBeTruthy();
      done();
    }));

  it("++ & --", (done) => {
    const key = random.alphaNumeric();
    const score1 = random.number({ max: 10 });
    s.up(key, score1, (_, d) => expect(d === score1.toString()).toBeTruthy());

    const score2 = random.number({ min: 0, max: 10 });
    s.up(key, score2, (err, now) => {
      expect(now === (score1 + score2).toString()).toBeTruthy();
      expect(err === null).toBeTruthy();
      s.down(key, score2, (err2, next) => {
        expect(next === score1.toString()).toBeTruthy();
        expect(err2 === null).toBeTruthy();
      });
    });

    s.top(-1, (err, rank) => {
      expect(rank).toHaveLength(2);
      expect(err).toBeNull();
      const max = parseInt(rank[1], 10);
      for (let i = 0; i < rank.length; i += 2) {
        expect(typeof rank[i]).toBe("string");
        expect(parseInt(rank[i + 1], 10) <= max).toBeTruthy();
      }
    });

    s.lowest(-1, (err, rank) => {
      expect(rank).toHaveLength(2);
      expect(err === null).toBeTruthy();
      const min = parseInt(rank[1], 10);
      for (let i = 0; i < rank.length; i += 2) {
        expect(typeof rank[i] === "string").toBeTruthy();
        expect(parseInt(rank[i + 1], 10) >= min).toBeTruthy();
      }
      done();
    });
  });
});
