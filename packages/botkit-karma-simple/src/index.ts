import { Botkit } from "botkit";
import KarmaStore from "karma-store-redis";

function format(data: string, length = 2): string {
  if (data.length === length) {
    return data;
  }

  if (data.length < length) {
    length -= data.length;
    for (let i = 0; i < length; i++) {
      data = "0" + data;
    }
  }
  return data;
}

function formatRank(firstMsg: string, data: string[]): string[] {
  const response = [firstMsg];
  for (let i = 0; i < data.length; i += 2) {
    response.push(
      `${format((i / 2 + 1).toString())}. ${data[i]}: ${data[i + 1]}`
    );
  }
  return response;
}

export default class KarmaBot {
  private readonly botkit: Botkit;
  _store: KarmaStore;
  constructor(botkit: Botkit, storeName: string = "karmastore") {
    this.botkit = botkit;
    this._store = new KarmaStore(storeName);
  }
  protected thingWrapper(thing: string): string {
    return thing;
  }
  private plus() {
    this.botkit.hears(
      new RegExp("([^+\\s])\\+\\+(\\s|$)"),
      ["ambient"],
      async (bot, msg) => {
        const thing = this.thingWrapper(
          (
            msg.text!.match(/(\S+[^+\s])\+\+(\s|$)/) as string[]
          )[1].toLowerCase()
        );
        const n = 1;
        this._store.up(thing, n, (karma) => {
          bot.reply(msg, `level up! ${thing}: +${n} (Karma: ${karma})`);
        });
      }
    );
  }
  private minus(): void {
    this.botkit.hears(["([^-s])--(s|$)"], ["ambient"], async (bot, msg) => {
      const thing = this.thingWrapper(
        (msg.text!.match(/(\S+[^-\s])--(\s|$)/) as string[])[1].toLowerCase()
      );
      const n = 1;
      this._store.down(thing, n, (karma) => {
        bot.reply(msg, `oops! ${thing}: -${n} (Karma: ${karma})`);
      });
    });
  }
  private showTop(cnt: number = 5): void {
    this.botkit.hears(
      "karma best",
      ["direct_mention", "mention"],
      async (bot, msg) => {
        this._store.top(cnt, (_, top) => {
          bot.reply(msg, formatRank(`The Best:`, top).join("\n"));
        });
      }
    );
  }
  private showWorst(cnt: number = 5): void {
    this.botkit.hears(
      "karma worst",
      ["direct_mention", "mention"],
      async (bot, msg) => {
        this._store.lowest(cnt, (_, worst) => {
          if (worst) {
            bot.reply(msg, formatRank(`The Worst:`, worst).join("\n"));
          }
          return [];
        });
      }
    );
  }
  listen(): void {
    this.plus();
    this.minus();
    this.showTop();
    this.showWorst();
  }
}
