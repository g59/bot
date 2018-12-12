"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@slack/client");
const moment_1 = __importDefault(require("moment"));
const defaultOptions = {
    color: 'warning',
    image_url: 'https://68.media.tumblr.com/adac611ed299098bbfd5527cacb1feb5/tumblr_o6v2n6Dwqn1vp0h0go1_500.gif',
    text: 'if not active',
    title_link: 'https://get.slack.help/hc/en-us/articles/201563847',
    title: 'Please archive this channel'
};
/**
 * @name ActiveReminder
 * @param {number} MAX_DATES
 * @param {any} POST_OPTIONS
 * @param {any} attachments
 */
class ActiveReminder {
    constructor(MAX_DATES = 14, POST_OPTIONS = {}, attachments = {}) {
        this._web = new client_1.WebClient(process.env.SLACK_API_TOKEN);
        this._MAX_DATES = MAX_DATES;
        this._POST_OPTIONS = POST_OPTIONS;
        this._attachments = attachments;
    }
    /**
     * post remind message
     * @return {Promise} channels.history
     */
    async postRemindMessage() {
        const { channels } = await this._web.channels.list({
            exclude_archived: true
        });
        channels.map(({ id }) => this.checkLastMessage(id));
    }
    /**
     * check last message timestamp
     * @param  {string}  id channel.id
     * @return {Promise}    chat.postMessage
     */
    async checkLastMessage(id) {
        const { messages } = await this._web.channels.history(id, { count: 1 });
        const last = moment_1.default.unix(messages[0].ts);
        if (moment_1.default()
            .subtract(this._MAX_DATES, 'days')
            .isAfter(last)) {
            this.postMessage(id);
        }
    }
    /**
     * post slack messages
     * @param  {string}  id channel.id
     * @return {Promise}    chat.postMessage
     */
    async postMessage(id) {
        const options = {
            ...defaultOptions,
            ...this._POST_OPTIONS
        };
        await this._web.chat.postMessage(id, '', {
            icon_emoji: ':video_game:',
            username: 'solaire',
            attachments: `${JSON.stringify([options])}`,
            ...this._attachments
        });
    }
}
exports.default = ActiveReminder;
//# sourceMappingURL=index.js.map