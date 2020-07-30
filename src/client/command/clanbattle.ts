import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * クラバト用のコマンド
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const ClanBattle = (command: string, msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.PROGRESS, msg.channel)) return

  switch (true) {
    case /cb over/.test(command): {
      const arg = command.replace('/cb over ', '')
      simultConvexCalc(arg, msg)
      return 'Simultaneous convex carryover calculation'
    }
  }
}

/**
 * 同時凸時の持ち越し計算を行う
 * @param arg HPとダメージA・B
 * @param msg DiscordからのMessage
 */
const simultConvexCalc = (arg: string, msg: Discord.Message) => {
  const [HP, A, B] = arg.split(' ').map(Number)
  const overCalc = (b: number, a: number) => Math.ceil(90 - (((HP - b) * 90) / a - 20))
  msg.reply(`\`\`\`A ${overCalc(A, B)}s\nB ${overCalc(B, A)}s\`\`\`ダメージの高い方を先に通すことね`)
}
