import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import * as status from '../../io/status'
import * as schedule from '../../io/schedule'
import * as lapAndBoss from '../convex/lapAndBoss'
import * as manage from '../convex/manage'
import * as situation from '../convex/situation'
import * as cancel from '../plan/cancel'
import * as list from '../plan/list'
import {NtoA} from 'alphabet-to-number'

/**
 * クラバト用のコマンド
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const ClanBattle = async (command: string, msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.CLAN_BATTLE, msg.channel)) return

  switch (true) {
    case /cb convex/.test(command): {
      const arg = command.replace('/cb convex ', '')
      await manage.Update(arg, msg)
      return 'Change of convex management'
    }

    case /cb boss now/.test(command): {
      // #進行に現在の周回数とボスを報告
      lapAndBoss.ProgressReport()
      return 'Show current boss'
    }

    case /cb boss next/.test(command): {
      // 次のボスに進める
      await lapAndBoss.Next()
      // 凸状況に報告
      await situation.Report()
      return 'Advance to next lap and boss'
    }

    case /cb boss previous/.test(command): {
      // 前のボスに戻す
      await lapAndBoss.Previous()
      // 凸状況に報告
      await situation.Report()
      return 'Advance to previous lap and boss'
    }

    case /cb boss/.test(command): {
      const arg = command.replace('/cb boss ', '')
      await changeBoss(arg, msg)
      return 'Change laps and boss'
    }

    case /cb complete plan/.test(command): {
      const arg = command.replace('/cb complete plan ', '')
      planComplete(arg, msg)
      return 'All reset plan'
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

    case /cb task/.test(command): {
      addTaskKillRoll(msg)
      return 'Add task kill roll'
    }

    case /cb update report/.test(command): {
      updateReport(msg)
      return 'Convex situation updated'
    }

    case /cb reflect cal/.test(command): {
      reflectOnCal(msg)
      return 'Reflect spreadsheet values ​​in Cal'
    }

    case /cb help/.test(command): {
      msg.reply('ここを確認しなさい！\nhttps://github.com/beroba/convex-management/blob/master/docs/command.md')
      return 'Show help'
    }
  }
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
 * 引数に渡されたユーザーの凸予定を全て消す
 * @param arg 凸予定を消すユーザーのidかメンション
 * @param msg DiscordからのMessage
 */
const planComplete = async (arg: string, msg: Discord.Message) => {
  // 引数が無い場合は終了
  if (arg === '/cb complete plan') return msg.reply('凸予定をリセットする人が分からないわ')

  // メンションからユーザーidだけを取り除く
  const id = util.Format(arg).replace(/[^0-9]/g, '')

  // 凸予定を全て削除する
  await cancel.AllComplete(id)

  msg.reply('凸予定をリセットしたわ')
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
  const [HP, A, B] = arg.replace(/　/g, ' ').split(' ').map(Number)
  const word = 'ダメージの高い方を先に通した方が持ち越し時間が長くなるわよ！'
  msg.reply(`\`\`\`A ${overCalc(HP, A, B)}s\nB ${overCalc(HP, B, A)}s\`\`\`${word}`)
}

/**
 * 持ち越しの計算をする
 * 計算式: 持ち越し時間 = 90 - (残りHP * 90 / 与ダメージ - 20)  // 端数切り上げ
 * @param HP ボスのHP
 * @param a AのHP
 * @param b BのHP
 * @return 計算結果
 */
const overCalc = (HP: number, a: number, b: number): number => Math.ceil(90 - (((HP - a) * 90) / b - 20))

/**
 * メッセージ送信者にタスキルロールを付与する
 * @param msg DiscordからのMessage
 */
const addTaskKillRoll = (msg: Discord.Message) => {
  // 既にタスキルしてるか確認する
  const isRole = msg.member?.roles.cache.some(r => r.id === Settings.ROLE_ID.TASK_KILL)

  if (isRole) {
    msg.reply('既にタスキルしてるわ')
  } else {
    // タスキルロールを付与する
    msg.member?.roles.add(Settings.ROLE_ID.TASK_KILL)

    msg.reply('タスキルロールを付けたわよ！')
  }
}

/**
 * 凸状況を更新する
 * @param msg DiscordからのMessage
 */
const updateReport = async (msg: Discord.Message) => {
  // #凸状況を更新
  situation.Report()
  await list.SituationEdit()

  msg.reply('凸状況を更新したわよ！')
}

/**
 * スプレッドシートの値をキャルに反映させる
 * @param msg DiscordからのMessage
 */
const reflectOnCal = async (msg: Discord.Message) => {
  // スプレッドシートの値を反映
  await current.ReflectOnCal()
  await status.ReflectOnCal()
  await schedule.ReflectOnCal()

  // #凸状況を更新
  situation.Report()

  msg.reply('スプレッドシートの値をキャルに反映させたわよ！')
}
