/* @flow */
import {WebClient} from '@slack/client'
import {config} from 'config'
import moment from 'moment'

const defaultOptions = [
  {
    text: 'if not active',
    title: 'Please archive this channel',
    title_link: 'https://get.slack.help/hc/en-us/articles/201563847',
    color: 'warning'
  }
]

export default class ActiveReminder {
  web: WebClient
  constructor () {
    const token = process.env.SLACK_API_TOKEN || config.slack.API_TOKEN
    console.log(token)
    this.web = new WebClient(token)
  }
  async fetchChannelsList () {
    const {channels} = await this.web.channels.list({
      exclude_archived: true
    })
    channels.map(({id}) => {
      this.checkLastMessage(id)
    })
  }
  async checkLastMessage (id: string) {
    const {messages} = await this.web.channels.history(id, {count: 1})
    const last = moment.unix(messages[0].ts)
    if (moment().subtract(14, 'days').isAfter(last)) {
      this.post(id)
    }
  }
  async post (id: string, options: any) {
    options = options || defaultOptions
    await this.web.chat.postMessage(id, '', {
      icon_emoji: ':angel:',
      username: 'bot',
      attachments: `${JSON.stringify(options)}`
    })
  }
}
