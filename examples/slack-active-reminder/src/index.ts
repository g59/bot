import { LogLevel } from "@slack/web-api";
import { CronJob } from "cron";
import Reminder from "slack-channel-active-reminder";

const reminder = new Reminder(7, LogLevel.DEBUG);

const job = new CronJob({
  cronTime: "1 00 * * * 1-5",
  onTick: function () {
    reminder.postRemindMessage();
  },
  start: false,
  timeZone: "Asia/Tokyo",
});
job.start();
