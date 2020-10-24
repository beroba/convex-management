import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as lapAndBoss from '../convex/lapAndBoss'
import * as manage from '../convex/manage'
import * as situation from '../convex/situation'
import * as list from '../plan/list'
import {NtoA} from 'alphabet-to-number'

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
    case /cb convex/.test(command): {
      const arg = command.replace('/cb convex ', '')
      changeConvex(arg, msg)
      return 'Change of convex management'
    }
    case /cb boss now/.test(command): {
      currentBossNow()
      return 'Show ckurrent boss'
    }

    case /cb boss next/.test(command): {
      moveForward()
      return 'Advance to next lap and boss'
    }

    case /cb boss previous/.test(command): {
      moveReturn()
      return 'Advance to previous lap and boss'
    }

    case /cb boss/.test(command): {
      const arg = command.replace('/cb boss ', '')
      changeBoss(arg, msg)
      return 'Change laps and boss'
    }

    case /cb plan/.test(command): {
      const arg = command.replace('/cb plan ', '')
      planList(arg)
      return 'Display convex plan list'
    }

    case /cb over/.test(command): {
      const arg = command.replace('/cb over ', '')
      simultConvexCalc(arg, msg)
      return 'Simultaneous convex carryover calculation'
    }

    case /cb help/.test(command): {
      msg.reply('ここを確認しなさい！\nhttps://github.com/beroba/convex-management/blob/master/docs/command.md')
      return 'Show help'
    }
  }
}

/**
 * 引数で渡されたプレイヤーidの凸状況を変更する
 * @param arg プレイヤーidと凸状況
 * @param msg DiscordからのMessage
 */
const changeConvex = async (arg: string, msg: Discord.Message) => {
  // 凸状況を更新
  const result = await manage.Update(arg, msg)
  if (!result) return

  // 凸状況に報告
  situation.Report()
}

/**
 * #進行に現在の周回数とボスを報告
 */
const currentBossNow = async () => {
  // #進行に現在の周回数とボスを報告
  lapAndBoss.ProgressReport()
}

/**
 * 現在の周回数とボスを次に進め、報告をする
 */
const moveForward = async () => {
  // 次のボスに進める
  await lapAndBoss.Next()
  // 凸状況に報告
  situation.Report()
}

/**
 * 現在の周回数とボスを前に戻し、報告をする
 */
const moveReturn = async () => {
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
  // 任意のボスへ移動させる
  const result = await lapAndBoss.Update(arg)
  if (!result) return msg.reply('形式が違うわ、やりなおし！')

  // 凸状況に報告
  situation.Report()
}

/**
 * 凸予定一覧を表示する。
 * 引数にボス番号がある場合、そのボスの予定一覧を表示する
 * @param arg ボス番号
 */
const planList = async (arg: string) => {
  // 引数にボス番号があるか確認
  if (/^[a-e]$/i.test(arg)) {
    // ボス番号の凸予定一覧を表示
    list.Output(arg)
  } else if (/^[1-5]$/i.test(arg)) {
    // ボス番号の凸予定一覧を表示
    list.Output(NtoA(arg))
  } else {
    // 凸予定一覧を全て表示
    list.AllOutput()
  }
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
  const word = 'ダメージの高い方を先に通した方が持ち越し時間が長くなるわよ！'
  msg.reply(`\`\`\`A ${overCalc(A, B)}s\nB ${overCalc(B, A)}s\`\`\`${word}`)
}
