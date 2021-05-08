import * as Discord from 'discord.js'
import moji from 'moji'
import Option from 'type-of-option'

/**
 * TLを正しい書式に整形させる、
 * timeが指定されていた場合は、その持ち越し秒数にする
 * @param tl 整形させるTL
 * @param time 持ち越し秒数
 * @param msg DiscordからのMessage
 */
export const TL = async (tl: string, time: Option<string>, msg: Discord.Message) => {
  // TLの整形をする
  const content = new generate(tl, time) // 元になるクラスを生成
    .zenkakuToHankaku() // 全角を半角に変換
    .bracketSpaceAdjustment() // 括弧の前後スペースを調整
    .toString() // 文字列に戻す

  msg.reply(content)
}

class generate {
  tl: string
  time: Option<string>

  /**
   * TLを整形させるクラス
   * @param tl 整形させるTL
   * @param time 持ち越し秒数
   */
  constructor(tl: string, time: Option<string>) {
    this.tl = tl
    this.time = time
  }

  /**
   * 全角を半角に置き換える
   * @returns this
   */
  zenkakuToHankaku() {
    this.tl = moji(this.tl).convert('ZE', 'HE').convert('ZS', 'HS').toString()
    return this
  }

  /**
   * 括弧の前後スペースを調整する
   * @returns this
   */
  bracketSpaceAdjustment() {
    this.tl = this.tl
      .replace(/ *\( */g, '(')
      .replace(/ *\) */g, ')')
      .replace(/\(/g, ' (')
      .replace(/\)/g, ') ')
    return this
  }
  /**
   * 文字列に変換する
   * @returns 整形したTL
   */
  toString(): string {
    return this.tl
  }
}
