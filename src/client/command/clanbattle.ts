import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as lapAndBoss from '../convex/lapAndBoss'
import * as situation from '../convex/situation'
import * as date from '../convex/date'
import * as list from '../reservate/list'

/**
 * クラバト用のコマンド
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const ClanBattle = (command: string, msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.CLAN_BATTLE, msg.channel)) return

  switch (true) {
    case /cb boss now/.test(command): {
      currentBossNow(msg)
      return 'Show ckurrent boss'
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

    case /cb rev/.test(command): {
      const arg = command.replace('/cb rev ', '')
      reservateList(arg, msg)
      return 'Display convex reservation list'
    }

    case /cb over/.test(command): {
      const arg = command.replace('/cb over ', '')
      simultConvexCalc(arg, msg)
      return 'Simultaneous convex carryover calculation'
    }
  }
}

/**
 * #進行に現在の周回数とボスを報告
 * @param msg DiscordからのMessage
 */
const currentBossNow = async (msg: Discord.Message) => {
  // クラバトの日じゃない場合は終了
  const day = await date.GetDay()
  if (!day) return msg.reply('今日はクラバトの日じゃないわ')

  // #進行に現在の周回数とボスを報告
  lapAndBoss.ProgressReport()
}

/**
 * 同時凸の持ち越し計算を行う
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

  const [HP, A, B] = arg.replace(/　/g, ' ').split(' ').map(Number)
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

  // 次のボスに進める
  await lapAndBoss.Next()
  // 凸状況に報告
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

  // 前のボスに戻す
  await lapAndBoss.Previous()
  // 凸状況に報告
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

  // 任意のボスへ移動させる
  const bool = await lapAndBoss.Update(arg)
  if (!bool) return msg.reply('形式が違うわ、やりなおし！')

  // 凸状況に報告
  situation.Report()
}

/**
 * 凸予定一覧を表示する。
 * 引数にボス番号がある場合、そのボスの予定一覧を表示する
 * @param arg ボス番号
 * @param msg DiscordからのMessage
 */
const reservateList = async (arg: string, msg: Discord.Message) => {
  // クラバトの日じゃない場合は終了
  const day = await date.GetDay()
  if (!day) return msg.reply('今日はクラバトの日じゃないわ')

  // 引数にボス番号があるか確認
  if (/^(a|b|c|d|e)$/i.test(arg)) {
    // ボス番号の凸予定一覧を表示
    list.Output(arg)
  } else {
    // 凸予定一覧を全て表示
    list.AllOutput()
  }
}
