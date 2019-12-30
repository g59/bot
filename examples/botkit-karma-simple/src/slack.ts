import { Botkit } from "botkit";
import KarmaBot from "botkit-karma-simple";
import { SlackAdapter } from "botbuilder-adapter-slack";

const adapter = new SlackAdapter({
  botToken: process.env.SLACK_API_TOKEN
});
const controller = new Botkit({ adapter });

const instance = new KarmaBot(controller);
instance.listen();
