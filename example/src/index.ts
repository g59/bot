import Reminder from "slack-channel-active-reminder";
import { LogLevel } from "@slack/web-api";
import Sentry = require("@sentry/node");

Sentry.init({ dsn: process.env.SENTRY_DSN });

const reminder = new Reminder(1, LogLevel.DEBUG);

const job = new CronJob({
  cronTime: "1 00 * * * 1-5",
  onTick: function() {
    try {
      reminder.postRemindMessage();
    } catch (e) {
      Sentry.captureException(e);
    }
  },
  start: false,
  timeZone: "Asia/Tokyo"
});
job.start();
