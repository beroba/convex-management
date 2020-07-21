import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * クラバト用のコマンド
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 */
export const ClanBattle = (command: string, msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.PROGRESS, msg.channel)) return

  switch (true) {
    case /cb over/.test(command):
      simultConvexCalc(command, msg)
      return 'Simultaneous convex carryover calculation'
  }
}

/**
 * 同時凸時の持ち越し計算を行う
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 */
const simultConvexCalc = (command: string, msg: Discord.Message) => {
  const [, , HP, A, B] = command.split(' ').map(Number)
  const overCalc = (b: number, a: number) => Math.ceil(90 - (((HP - b) * 90) / a - 20))
  msg.reply(`\`\`\`A ${overCalc(A, B)}s\nB ${overCalc(B, A)}s\`\`\`ダメージの高い方を先に通すことね`)
}
