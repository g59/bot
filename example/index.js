/* @flow */
require('babel-register')
const Reminder = require('../src').default

const reminder = new Reminder()
reminder.postRemindMessage()
