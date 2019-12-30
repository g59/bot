import {
  ChatPostMessageArguments,
  MessageAttachment,
  WebClient,
  AttachmentAction,
  LogLevel
} from "@slack/web-api";
import moment from "moment";

const defaultOptions: ChatPostMessageArguments = {
  channel: "general",
  attachments: [
    {
      color: "warning",
      title_link: "https://get.slack.help/hc/en-us/articles/201563847",
      title: "Please archive this channel",

      image_url:
        "https://68.media.tumblr.com/adac611ed299098bbfd5527cacb1feb5/tumblr_o6v2n6Dwqn1vp0h0go1_500.gif"
    }
  ],
  text: "if not active"
};

export default class ActiveReminder {
  web: WebClient;
  _MAX_DATES: number;
  _POST_OPTIONS: MessageAttachment;
  constructor(
    MAX_DATES: number = 14,
    logLevel: LogLevel = LogLevel.INFO,
    POST_OPTIONS: ChatPostMessageArguments = defaultOptions
  ) {
    const API_TOKEN = process.env.SLACK_API_TOKEN;
    if (!API_TOKEN) {
      throw new Error("Invalid config");
    }
    this.web = new WebClient(API_TOKEN, {
      logLevel
    });
    this._MAX_DATES = MAX_DATES;
    this._POST_OPTIONS = POST_OPTIONS;
  }

  async postRemindMessage() {
    const { channels } = await this.web.conversations.list({
      exclude_archived: true,
      exclude_members: false
    });
    (channels as Array<AttachmentAction>).map(({ id }: AttachmentAction) =>
      this.checkLastMessage(id!)
    );
  }

  private async checkLastMessage(channel: string) {
    const { messages } = await this.web.channels.history({
      count: 1,
      channel
    });
    const last = moment((messages as Array<MessageAttachment>)[0].ts);
    if (
      moment()
        .subtract(this._MAX_DATES, "days")
        .isAfter(last)
    ) {
      this.postMessage(channel);
    }
  }

  private async postMessage(channel: string) {
    const options: ChatPostMessageArguments = {
      ...defaultOptions,
      ...this._POST_OPTIONS
    };

    await this.web.chat.postMessage({
      icon_emoji: ":video_game:",
      username: "solaire",
      ...options,
      channel
    });
  }
}
