<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [slack-channel-active-reminder](#slack-channel-active-reminder)
  - [Install](#install)
  - [Usage](#usage)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# slack-channel-active-reminder

[![npm version](https://badge.fury.io/js/slack-channel-active-reminder.svg)](https://www.npmjs.com/package/slack-channel-active-reminder)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Install

```sh
npm install slack-channel-active-reminder
```

## Usage

```typescript
const { CronJob } = require("cron");
const Reminder = require("slack-channel-active-reminder").default;

const reminder = new Reminder();

const job = new CronJob({
  cronTime: "0 00 18 * * 1-5",
  onTick: function () {
    reminder.postRemindMessage();
  },
  start: false,
  timeZone: "Asia/Tokyo",
});
job.start();
```

## License

MIT
