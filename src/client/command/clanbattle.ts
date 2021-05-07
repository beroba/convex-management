import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {NtoA} from 'alphabet-to-number'
import * as command from './'
import * as util from '../../util'
import * as status from '../../io/status'
import * as schedule from '../../io/schedule'
import * as etc from '../convex/etc'
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
      await bossNextController('/cb boss next', content, msg)
      return 'Advance to next lap and boss'
    }

    case /cb boss back/.test(content): {
      await bossBackController('/cb boss back', content, msg)
      return 'Advance to previous lap and boss'
    }

    case /cb boss previous/.test(content): {
      await bossPreviousController('/cb boss previous', content, msg)
      return 'Advance to previous lap and boss'
    }

    case /cb boss/.test(content): {
      await bossController('/cb boss', content, msg)
      return 'Change laps and boss'
    }

    case /cb delete plan/.test(content): {
      await deletePlanController('/cb delete plan', content, msg)
      return 'Delete plan'
    }

    case /cb plan/.test(content): {
      await planController('/cb plan', content, msg)
      return 'Display convex plan list'
    }

    case /cb over/.test(content): {
      await overController('/cb over', content, msg)
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

  // 引数が無い場合は終了
  if (!args) return _msg.reply('更新したいプレイヤーと凸状況を指定しなさい')

  // 更新先の凸状況を取得
  const state = util
    .Format(args)
    .replace(/<.+>/, '') // プレイヤーIDを省く
    .trim()

  // 凸状況の書式がおかしい場合は終了
  if (!/^(0|[1-3]\+?)$/.test(state)) return _msg.reply('凸状況の書式が違うわ')

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
 * `/cb boss next`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const bossNextController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 次のボスに進める
  await lapAndBoss.Next()

  // メンバー全員の状態を取得
  const members = await status.Fetch()

  // 凸状況に報告
  await situation.Report(members)
}

/**
 * `/cb boss back`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const bossBackController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 前のボスに戻す
  await lapAndBoss.Previous()

  // メンバー全員の状態を取得
  const members = await status.Fetch()

  // 凸状況に報告
  await situation.Report(members)
}

/**
 * `/cb boss previous`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const bossPreviousController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 前のボスに戻す
  await lapAndBoss.Previous()

  // メンバー全員の状態を取得
  const members = await status.Fetch()

  // 凸状況に報告
  await situation.Report(members)
}

/**
 * `/cb boss`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const bossController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // 引数が無い場合は終了
  if (!args) return _msg.reply('周回数とボス番号を指定しなさい')

  // 周回数とボス番号を取得
  const lap = util.Format(args).replace(/\s|[a-e]/gi, '')
  const alpha = util.Format(args).replace(/\s|\d/gi, '')

  // 書式が違う場合は終了
  if (!/\d/.test(lap)) return _msg.reply('周回数の書式が違うわ')
  if (!/[a-e]/i.test(alpha)) return _msg.reply('ボス番号の書式が違うわ、[a-e]で指定してね')

  // 任意のボスへ移動させる
  await lapAndBoss.Update(lap, alpha)

  // メンバー全員の状態を取得
  const members = await status.Fetch()

  // 凸状況に報告
  await situation.Report(members)
}

/**
 * `/cb delete plan`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const deletePlanController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // 引数が無い場合は終了
  if (!args) return _msg.reply('削除する凸予定のidを指定しないと消せないわ')

  // メンションからユーザーidだけを取り除く
  const id = util.Format(args).replace(/[^0-9]/g, '')

  // 凸予定を削除する
  const [plans] = await schedule.Delete(id)

  // 凸予定一覧を取得
  await list.SituationEdit(plans)

  _msg.reply('凸予定を削除したわ')
}

/**
 * `/cb plan`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const planController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 引数を抽出
  const args = command.ExtractArgument(_command, _content) ?? ''

  // 引数にボス番号があるか確認
  if (/^[a-e]$/i.test(args)) {
    // ボス番号の凸予定一覧を表示
    list.Output(args)
  } else if (/^[1-5]$/i.test(args)) {
    // ボス番号の凸予定一覧を表示
    list.Output(NtoA(args))
  } else {
    // 凸予定一覧を全て表示
    list.AllOutput()
  }
}

/**
 * `/cb over`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const overController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // 引数が無い場合は終了
  if (!args) return _msg.reply('HP A Bを指定しなさい')

  // HP, A, Bを分割して代入
  const [HP, A, B] = util.Format(args).split(' ').map(Number)

  // 計算結果を出力
  etc.SimultConvexCalc(HP, A, B, _msg)
}

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
