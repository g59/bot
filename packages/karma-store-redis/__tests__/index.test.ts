import { datatype } from "faker";
import Store from "../src";

describe("Store", () => {
  let s: Store;
  beforeAll(async () => {
    s = new Store(datatype.string(30));
    await s.connect();
  });

  afterAll(async () => {
    await s.clearAll(s._key());
    await s.quit();
  });

  it("after clear", () => expect(s.top(-1)).resolves.toHaveLength(0));

  it("random", () => expect(s.random(datatype.string())).resolves.toBe(1));

  it("++ & --", async () => {
    const key = datatype.string();
    const score1 = datatype.number({ max: 10 });
    expect(s.up(key, score1)).resolves.toEqual(score1);

    const score2 = datatype.number({ min: 0, max: 10 });
    expect(s.up(key, score2)).resolves.toEqual(score1 + score2);
    expect(s.down(key, score2)).resolves.toEqual(score1);

    let ranks = await s.top(-1);
    expect(ranks).toHaveLength(2);
    const max = ranks[0].score;
    for (let i = 1; i < ranks.length; i++) {
      expect(ranks[i].score).toBeLessThan(max);
    }

    ranks = await s.lowest(-1);
    expect(ranks).toHaveLength(2);
    const min = ranks[0].score;
    for (let i = 1; i < ranks.length; i++) {
      expect(ranks[i].score).toBeGreaterThan(min);
    }
  });
});
