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

/** class */
export default class ActiveReminder {
  _web: WebClient
  _MAX_DATES: number
  _POST_OPTIONS: any
  _attachments: any
  constructor (MAX_DATES: number = 14, POST_OPTIONS: any = {}, attachments: any = {}) {
    const token = process.env.SLACK_API_TOKEN || config.get('slack.API_TOKEN')
    this._web = new WebClient(token)
    this._MAX_DATES = MAX_DATES
    this._POST_OPTIONS = POST_OPTIONS
    this._attachments = attachments
  }
  /**
   * post remind message
   * @return {Promise} channels.history
   */
  async postRemindMessage () {
    const {channels} = await this._web.channels.list({
      exclude_archived: true
    })
    channels.map(({id}) => {
      this.checkLastMessage(id)
    })
  }
  /**
   * check last message timestamp
   * @param  {string}  id channel.id
   * @return {Promise}    chat.postMessage
   */
  async checkLastMessage (id: string) {
    const {messages} = await this._web.channels.history(id, {count: 1})
    const last = moment.unix(messages[0].ts)
    if (moment().subtract(this._MAX_DATES, 'days').isAfter(last)) {
      this.postMessage(id)
    }
  }
  /**
   * post slack messages
   * @param  {string}  id channel.id
   * @return {Promise}    chat.postMessage
   */
  async postMessage (id: string) {
    const options = Object.assign({}, defaultOptions, this._POST_OPTIONS)
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
