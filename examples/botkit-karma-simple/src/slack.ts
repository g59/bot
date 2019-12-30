import { Botkit } from "botkit";
import KarmaBot from "botkit-karma-simple";
import { SlackAdapter } from "botbuilder-adapter-slack";

const adapter = new SlackAdapter({
  botToken: process.env.SLACK_API_TOKEN,
  clientSecret: process.env.clientSecret,
  clientSigningSecret: process.env.clientSigningSecret,
  verificationToken: process.env.verificationToken,
  redirectUri: `https://${process.env.SLACK_DOMAIN}/install/auth`
});
const controller = new Botkit({ adapter });

const instance = new KarmaBot(controller);
instance.listen();
