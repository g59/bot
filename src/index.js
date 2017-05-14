/* @flow */
import {WebClient} from '@slack/client'
import config from 'config'
import moment from 'moment'

const defaultOptions = {
  color: 'warning',
  image_url: 'https://68.media.tumblr.com/adac611ed299098bbfd5527cacb1feb5/tumblr_o6v2n6Dwqn1vp0h0go1_500.gif',
  text: 'if not active',
  title_link: 'https://get.slack.help/hc/en-us/articles/201563847',
  title: 'Please archive this channel'
}

export default class ActiveReminder {
  _web: WebClient
  _options: any
  _attachments: any
  constructor (postOptions: any = {}, attachments: any = {}) {
    const token = process.env.SLACK_API_TOKEN || config.get('slack.API_TOKEN')
    this._web = new WebClient(token)
    this._options = postOptions
    this._attachments = attachments
  }
  async fetchChannelsList () {
    const {channels} = await this._web.channels.list({
      exclude_archived: true
    })
    channels.map(({id}) => {
      this.checkLastMessage(id)
    })
  }
  async checkLastMessage (id: string) {
    const {messages} = await this._web.channels.history(id, {count: 1})
    const last = moment.unix(messages[0].ts)
    if (moment().subtract(14, 'days').isAfter(last)) {
      this.post(id)
    }
  }
  async post (id: string) {
    const options = Object.assign({}, defaultOptions, this._options)
    await this._web.chat.postMessage(
      id,
      '',
      Object.assign(
        {},
        {
          icon_emoji: ':video_game:',
          username: 'solaire',
          attachments: `${JSON.stringify([options])}`
        },
        this._attachments
      )
    )
  }
}
