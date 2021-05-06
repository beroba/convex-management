import * as Discord from 'discord.js'
import moji from 'moji'
import Option from 'type-of-option'

export const TL = async (msg: Discord.Message, time?: Option<string>) => {
  const content = new generate(msg.content, time).zenkakuToHankaku().toString()

  msg.reply(content)
}

class generate {
  content: string
  time: Option<string>

  constructor(content: string, time: Option<string>) {
    this.content = content
    this.time = time
  }

  zenkakuToHankaku() {
    this.content = moji(this.content).convert('ZE', 'HE').convert('ZS', 'HS').toString()
    return this
  }

  toString(): string {
    return this.content
  }
}
