import assert from "node:assert";
import { faker } from "@faker-js/faker";
import { test } from "node:test";
import Store from "../src";

test("Store", {}, async (t) => {
  const s = new Store(faker.string.alphanumeric(30));
  await s.connect();

  await t.test("after clear", async () =>
    assert.strictEqual((await (s.top(-1))).length, 0));

  await t.test("random", async () =>
    assert.strictEqual(await s.random(faker.string.alphanumeric()), 1));

  await t.test("++ & --", async () => {
    const key = faker.string.alphanumeric();
    const score1 = faker.number.int({ max: 10 });
    assert.strictEqual(await s.up(key, score1), score1);

    const score2 = faker.number.int({ min: 0, max: 10 });
    assert.strictEqual(await s.up(key, score2), score1 + score2);
    assert.strictEqual(await s.down(key, score2), score1);

    let ranks = await s.top(-1);
    assert.strictEqual(ranks.length, 2);
    const max = ranks[0].score;
    for (let i = 1; i < ranks.length; i++) {
      assert.ok(ranks[i].score < max);
    }

    ranks = await s.lowest(-1);
    assert.strictEqual(ranks.length, 2);
    const min = ranks[0].score;
    for (let i = 1; i < ranks.length; i++) {
      assert.ok(ranks[i].score > min);
    }
  });

  await s.clearAll(s._key());
  await s.quit();
});
