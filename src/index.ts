import {
  ChatPostMessageArguments,
  MessageAttachment,
  WebClient
} from '@slack/client'
import moment from 'moment'

const defaultOptions: ChatPostMessageArguments = {
  channel: 'general',
  attachments: [
    {
      color: 'warning',
      title_link: 'https://get.slack.help/hc/en-us/articles/201563847',
      title: 'Please archive this channel',

      image_url:
        'https://68.media.tumblr.com/adac611ed299098bbfd5527cacb1feb5/tumblr_o6v2n6Dwqn1vp0h0go1_500.gif'
    }
  ],
  text: 'if not active'
}

export default class ActiveReminder {
  _web: WebClient
  _MAX_DATES: number
  _POST_OPTIONS: MessageAttachment
  constructor (
    MAX_DATES: number = 14,
    POST_OPTIONS: ChatPostMessageArguments = defaultOptions
  ) {
    this._web = new WebClient(process.env.SLACK_API_TOKEN)
    this._MAX_DATES = MAX_DATES
    this._POST_OPTIONS = POST_OPTIONS
  }

  async postRemindMessage () {
    const { channels } = (await this._web.conversations.list({
      exclude_archived: true,
      exclude_members: false
    })) as any
    channels.map(({ id }: any) => this.checkLastMessage(id))
  }

  async checkLastMessage (channel: string) {
    const { messages } = (await this._web.channels.history({
      count: 1,
      channel
    })) as any
    const last = moment.unix(messages[0].ts)
    if (
      moment()
        .subtract(this._MAX_DATES, 'days')
        .isAfter(last)
    ) {
      this.postMessage(channel)
    }
  }

  async postMessage (channel: string) {
    const options = {
      ...defaultOptions,
      ...this._POST_OPTIONS
    }

    await this._web.chat.postMessage({
      icon_emoji: ':video_game:',
      username: 'solaire',
      ...options,
      channel
    })
  }
}
