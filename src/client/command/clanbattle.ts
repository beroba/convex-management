import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as lapAndBoss from '../convex/lapAndBoss'
import * as situation from '../convex/situation'
import * as date from '../convex/date'

/**
 * クラバト用のコマンド
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const ClanBattle = (command: string, msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.CLAN_BATTLE, msg.channel)) return

  // コマンド実行ユーザーかどうかを確認
  const isRole = msg.member?.roles.cache.some(r => Settings.COMMAND_ROLE.some((v: string) => v === r.id))
  if (!isRole) return

  switch (true) {
    case /cb over/.test(command): {
      const arg = command.replace('/cb over ', '')
      simultConvexCalc(arg, msg)
      return 'Simultaneous convex carryover calculation'
    }

    case /cb boss next/.test(command): {
      moveForward(msg)
      return 'Advance to next lap and boss'
    }

    case /cb boss previous/.test(command): {
      moveReturn(msg)
      return 'Advance to previous lap and boss'
    }

    case /cb boss/.test(command): {
      const arg = command.replace('/cb boss ', '')
      changeBoss(arg, msg)
      return 'Change laps and boss'
    }
  }
}

/**
 * 同時凸時の持ち越し計算を行う
 * @param arg HPとダメージA・B
 * @param msg DiscordからのMessage
 */
const simultConvexCalc = (arg: string, msg: Discord.Message) => {
  /**
   * 持ち越しの計算をする
   * 計算式: 持ち越し時間 = 90 - (残りHP * 90 / 与ダメージ - 20)  // 端数切り上げ
   * @param a AのHP
   * @param b BのHP
   * @return 計算結果
   */
  const overCalc = (a: number, b: number): number => Math.ceil(90 - (((HP - a) * 90) / b - 20))

  const [HP, A, B] = arg.replace('　', ' ').split(' ').map(Number)
  msg.reply(`\`\`\`A ${overCalc(A, B)}s\nB ${overCalc(B, A)}s\`\`\`ダメージの高い方を先に通すことね`)
}

/**
 * 現在の周回数とボスを次に進め、報告をする
 * @param msg DiscordからのMessage
 */
const moveForward = async (msg: Discord.Message) => {
  // クラバトの日じゃない場合は終了
  const day = await date.GetDay()
  if (!day) return msg.reply('今日はクラバトの日じゃないわ')

  await lapAndBoss.Next()
  msg.reply(await lapAndBoss.CurrentMessage())
  situation.Report()
}

/**
 * 現在の周回数とボスを前に戻し、報告をする
 * @param msg DiscordからのMessage
 */
const moveReturn = async (msg: Discord.Message) => {
  // クラバトの日じゃない場合は終了
  const day = await date.GetDay()
  if (!day) return msg.reply('今日はクラバトの日じゃないわ')

  await lapAndBoss.Practice()
  msg.reply(await lapAndBoss.CurrentMessage())
  situation.Report()
}

/**
 * 引数で指定した周回数とボスに変更する
 * @param arg 周回数とボス番号
 * @param msg DiscordからのMessage
 */
const changeBoss = async (arg: string, msg: Discord.Message) => {
  // クラバトの日じゃない場合は終了
  const day = await date.GetDay()
  if (!day) return msg.reply('今日はクラバトの日じゃないわ')

  lapAndBoss.Update(arg, msg)
  situation.Report()
}
