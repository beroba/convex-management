import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {NtoA} from 'alphabet-to-number'
import * as command from './'
import * as util from '../../util'
import * as status from '../../io/status'
import * as schedule from '../../io/schedule'
import * as format from '../convex/format'
import * as lapAndBoss from '../convex/lapAndBoss'
import * as manage from '../convex/manage'
import * as situation from '../convex/situation'
import * as list from '../plan/list'

/**
 * クラバト用のコマンド
 * @param content 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const ClanBattle = async (content: string, msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.CLAN_BATTLE, msg.channel)) return

  switch (true) {
    case /cb tl/i.test(content): {
      await tlController('/cb tl', content, msg)
      return 'TL shaping'
    }

    case /cb convex/.test(content): {
      await convexController('/cb convex', content, msg)
      return 'Change of convex management'
    }

    case /cb boss now/.test(content): {
      await bossNowController('/cb boss now', content, msg)
      return 'Show current boss'
    }

    case /cb boss next/.test(content): {
      // 次のボスに進める
      await lapAndBoss.Next()

      // メンバー全員の状態を取得
      const members = await status.Fetch()
      // 凸状況に報告
      situation.Report(members)

      return 'Advance to next lap and boss'
    }

    case /cb boss back/.test(content):
    case /cb boss previous/.test(content): {
      // 前のボスに戻す
      await lapAndBoss.Previous()

      // メンバー全員の状態を取得
      const members = await status.Fetch()
      // 凸状況に報告
      situation.Report(members)

      return 'Advance to previous lap and boss'
    }

    case /cb boss/.test(content): {
      const arg = content.replace('/cb boss ', '')
      await changeBoss(arg, msg)
      return 'Change laps and boss'
    }

    case /cb delete plan/.test(content): {
      const arg = content.replace('/cb delete plan ', '')
      deletePlan(arg, msg)
      return 'Delete plan'
    }

    case /cb plan/.test(content): {
      const arg = content.replace('/cb plan ', '')
      planList(arg)
      return 'Display convex plan list'
    }

    case /cb over/.test(content): {
      const arg = content.replace('/cb over ', '')
      simultConvexCalc(arg, msg)
      return 'Simultaneous convex carryover calculation'
    }

    case /cb task/.test(content): {
      addTaskKillRoll(msg)
      return 'Add task kill roll'
    }

    case /cb update report/.test(content): {
      // メンバー全員の状態を取得
      const members = await status.Fetch()
      // 凸状況に報告
      situation.Report(members)

      // 凸予定一覧を取得
      const plans = await schedule.Fetch()
      await list.SituationEdit(plans)

      msg.reply('凸状況を更新したわよ！')
      return 'Convex situation updated'
    }

    case /cb help/.test(content): {
      msg.reply('ここを確認しなさい！\nhttps://github.com/beroba/convex-management/blob/master/docs/command.md')
      return 'Show help'
    }
  }
}

/**
 * `/cb tl`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const tlController = async (_command: string, _content: string, _msg: Discord.Message) => {
  /**
   * 引数からtimeを作成する、作成できない場合はnullを返す
   * @param args 受け取った引数
   * @returns time
   */
  const toTime = (args: string): Option<string> => {
    // `.|;`を`:`に置き換える
    const time = args.replace(/\.|;/g, ':')

    // 引数の書式が正しい書式か確認
    const isNaN = Number.isNaN(Number(time.replace(':', '')))

    return isNaN ? null : time
  }

  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // TL部分の生成
  const tl = _msg.content.split('\n').slice(1).join('\n')

  // timeを作成
  const time = args && toTime(args)

  // TLの整形をする
  await format.TL(tl, time, _msg)
}

/**
 * `/cb convex`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const convexController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // 更新先の凸状況を取得
  const state = util
    .Format(args ?? '')
    .replace(/<.+>/, '') // プレイヤーIDを省く
    .trim()

  // 凸状況を更新する
  await manage.Update(state, _msg)
}

/**
 * `/cb boss now`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const bossNowController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // #進行に現在の周回数とボスを報告
  await lapAndBoss.ProgressReport()
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

  // メンバー全員の状態を取得
  const members = await status.Fetch()
  // 凸状況に報告
  situation.Report(members)
}

/**
 * 引数に渡されたidの凸予定を消す
 * @param arg 凸予定を消すユーザーのidかメンション
 * @param msg DiscordからのMessage
 */
const deletePlan = async (arg: string, msg: Discord.Message) => {
  // 引数が無い場合は終了
  if (arg === '/cb complete plan') return msg.reply('削除する凸予定のidを指定しないと消せないわ')

  // メンションからユーザーidだけを取り除く
  const id = util.Format(arg).replace(/[^0-9]/g, '')

  // 凸予定を削除する
  const [plans] = await schedule.Delete(id)

  // 凸予定一覧を取得
  await list.SituationEdit(plans)

  msg.reply('凸予定を削除したわ')
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
  const isRole = util.IsRole(msg.member, Settings.ROLE_ID.TASK_KILL)

  if (isRole) {
    msg.reply('既にタスキルしてるわ')
  } else {
    // タスキルロールを付与する
    msg.member?.roles.add(Settings.ROLE_ID.TASK_KILL)

    msg.reply('タスキルロールを付けたわよ！')
  }
}
