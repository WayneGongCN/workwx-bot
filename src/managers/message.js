const axios = require('axios')
const logger = require('../log')

class Message {
  constructor(option) {
    // this._option = option
    option.msgType && (this.msgtype = option.msgType)
    option.chatId && (this.chatid = option.chatId)
    option.visibleToUser && (this.visible_to_user = option.visibleToUser)
  }

  msgType(type) {
    this.msgtype = type
    return this
  }

  chatId(chatId) {
    if (!Array.isArray(chatId)) chatId = [chatId]
    this.chatid = chatId.join('|')
    return this
  }

  visible(users) {
    this.visibleToUser = users
    return this
  }

  send() {
    if ((this.msgtype === 'text' && !this.text.content) || (this.msgtype === 'markdwon' && !this.markdown.content) || !this.chatid)
      throw new Error('Error Message')

    return axios.post(process.env.WEB_HOOK_URL, this).then(res => {
      if (res.data.errcode === 0) return res.data
      else throw new Error(`[SEND_MESSAGE_ERROR] ${JSON.stringify(this)} ${JSON.stringify(res.data)}`)
    })
  }
}

class TextMessage extends Message {
  constructor(option) {
    super(option)
    this.msgtype = 'text'
    this.text = { content: '' }

    if (typeof option === 'string') this.text.content = option
    else {
      this.text.content = option.content
      this.mentioned_list = option.mentionedList
      this.mentioned_mobile_list = option.mentionedMobileList
    }
  }

  content(val) {
    this.text.content = String(val)
    return this
  }

  mention(users) {
    this.text.mentioned_list = users
    return this
  }

  mentionByMobile(users) {
    this.text.mentioned_mobile_list = users
    return this
  }
}

class MdMessage extends Message {
  constructor(option) {
    super(option)
    this.msgtype = 'markdown'
    this.markdown = { content: '' }

    if (typeof option === 'string') this.markdown.content = option
    else {
      this.markdown.content = option.content
      this.mentioned_list = option.mentionedList
      this.mentioned_mobile_list = option.mentionedMobileList
    }
  }

  content(val) {
    this.markdown.content = String(val)
    return this
  }

  attachments() {
    const attachment = {
      callback_id: 'button_two_row',
      actions: [
        {
          border_color: '2EAB49',
          text_color: '2EAB49',
          type: 'button',
          name: 'button_1',
          value: 'S',
          text: 'S',
          replace_text: '你已选择S',
        },
      ],
    }
    this.markdown.attachments = [attachment]
    return this
  }

  mention(users) {
    this.markdown.mentioned_list = users
    return this
  }

  mentionByMobile(users) {
    this.markdown.mentioned_mobile_list = users
    return this
  }
}

module.exports = {
  TextMessage,
  MdMessage,
}
