/* @flow */
import { WebClient } from '@slack/client'
import moment from 'moment'

const token = process.env.SLACK_API_TOKEN

const web = new WebClient(token)

web.channels.list({ exclude_archived: true }, (err: any, { channels }) => {
  if (err) {
    console.log('Error:', err)
    return
  }

  for (const i in channels) {
    web.channels.history(channels[i].id, { count: 1 }, (err, { messages }) => {
      if (err) {
        console.log('error:', err)
        return
      }
      const last = moment.unix(messages[0].ts)
      if (moment().subtract(14, 'days').isAfter(last)) {
        const opt = [
          {
            text: 'if not active',
            title: 'Please archive this channel',
            title_link: 'https://get.slack.help/hc/en-us/articles/201563847',
            color: 'warning'
          }
        ]
        web.chat.postMessage(
          channels[i].id,
          '',
          {
            icon_emoji: ':angel:',
            username: 'bot',
            attachments: `${JSON.stringify(opt)}`
          },
          (err: any, res) => {
            if (err) {
              console.log('error:', err)
            }
          }
        )
      }
    })
  }
})
