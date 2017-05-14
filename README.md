# slack-channel-active-reminder

[![npm version](https://badge.fury.io/js/slack-channel-active-reminder.svg)](https://www.npmjs.com/package/slack-channel-active-reminder) [![Build Status](https://travis-ci.org/9renpoto/slack-channel-active-reminder.svg?branch=master)](https://travis-ci.org/9renpoto/slack-channel-active-reminder) [![dependencies Status](https://david-dm.org/9renpoto/slack-channel-active-reminder/status.svg)](https://david-dm.org/9renpoto/slack-channel-active-reminder) [![devDependencies Status](https://david-dm.org/9renpoto/slack-channel-active-reminder/dev-status.svg)](https://david-dm.org/9renpoto/slack-channel-active-reminder?type=dev) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Install

```sh
npm install slack-channel-active-reminder
```

## Usage

```javascript
const CronJob = require('cron').CronJob
const Reminder = require('slack-channel-active-reminder').default

const reminder = new Reminder()

const job = new CronJob({
  cronTime: '0 00 18 * * 1-5',
  onTick: function () {
    reminder.postRemindMessage()
  },
  start: false,
  timeZone: 'Asia/Tokyo'
})
job.start()
```

## License

MIT
