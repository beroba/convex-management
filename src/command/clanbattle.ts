import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {NtoA} from 'alphabet-to-number'
import * as command from '.'
import * as util from '../util'
import * as schedule from '../io/schedule'
import * as status from '../io/status'
import {AtoE} from '../io/type'
import * as etc from '../client/convex/etc'
import * as role from '../client/convex/role'
import * as format from '../client/convex/format'
import * as lapAndBoss from '../client/convex/lapAndBoss'
import * as manage from '../client/convex/manage'
import * as situation from '../client/convex/situation'
import * as declare from '../client/declare/list'
import * as list from '../client/plan/list'

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
    case /cb tle/i.test(content): {
      await tleController('/cb tle', content, msg)
      return 'TL shaping'
    }

    case /cb tl/i.test(content): {
      await tlController('/cb tl', content, msg)
      return 'TL shaping'
    }

    case /cb cv/.test(content): {
      await convexController('/cb cv', content, msg)
      return 'Change of convex management'
    }

    case /cb convex/.test(content): {
      await convexController('/cb convex', content, msg)
      return 'Change of convex management'
    }

    case /cb boss/.test(content): {
      await lapController('/cb boss', content, msg)
      return 'Change boss'
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
      await taskKillController('/cb task', content, msg)
      return 'Add task kill roll'
    }

    case /cb kill/.test(content): {
      await taskKillController('/cb kill', content, msg)
      return 'Add task kill roll'
    }

    case /cb update report/.test(content): {
      await updateReportController('/cb update report', content, msg)
      return 'Convex situation updated'
    }

    case /cb help/.test(content): {
      await helpController('/cb help', content, msg)
      return 'Show help'
    }
  }
}

/**
 * `/cb tle`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const tleController = async (_command: string, _content: string, _msg: Discord.Message) => {
  /**
   * 引数からtimeを作成する、作成できない場合はnullを返す
   * @param args 受け取った引数
   * @returns time
   */
  const toTime = (args: string): Option<string> => {
    // `.|;`を`:`に置き換える
    const time = args.replace(/\.|;/g, ':')

    // 引数の書式が正しい書式か確認
    const isNaN = Number.isNaN(time.replace(':', '').to_n())

    return isNaN ? null : time
  }

  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // TL部分の生成
  const tl = _msg.content.split('\n').slice(1).join('\n')

  if (!tl) return _msg.reply('TLがないわ')

  // timeを作成
  const time = args && toTime(args)

  // TLの整形をする
  await format.TL(tl, time, _msg, true)
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
    const isNaN = Number.isNaN(time.replace(':', '').to_n())

    return isNaN ? null : time
  }

  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // TL部分の生成
  const tl = _msg.content.split('\n').slice(1).join('\n')

  if (!tl) return _msg.reply('TLがないわ')

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
  if (!/^(3|2\+{0,1}|1\+{0,2}|0\+{0,3})$/.test(state)) return _msg.reply('凸状況の書式が違うわ')

  // 凸状況を更新する
  await manage.Update(state, _msg)
}

/**
 * `/cb lap`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const lapController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // 引数が無い場合は終了
  if (!args) return _msg.reply('周回数とボス番号を指定しなさい')

  // 周回数とボス番号を取得
  const lap = util.Format(args).replace(/\s|[a-e]/gi, '')
  const alpha = util.Format(args).replace(/\s|\d/gi, '').toLowerCase()

  // 書式が違う場合は終了
  if (!/\d/.test(lap)) return _msg.reply('周回数の書式が違うわ、\\dで指定してね')
  if (!/[a-e]/i.test(alpha)) return _msg.reply('ボス番号の書式が違うわ、[a-e]で指定してね')

  // 任意のボスへ移動させる
  await lapAndBoss.UpdateLap(lap.to_n(), <AtoE>alpha)

  // メンバー全員の状態を取得
  const members = await status.Fetch()
  situation.Report(members)

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()
  await list.SituationEdit(plans)
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

  // 引数からユーザーidだけを取り除く
  const id = util.Format(args).replace(/[^0-9]/g, '')

  // 凸予定を削除する
  const [plans, plan] = await schedule.Delete(id)

  // 指定したidの凸予定がなかった場合
  if (!plan) return _msg.reply(`${id}の凸予定はなかったわ`)

  // 凸予定一覧を取得
  await list.SituationEdit(plans)

  // 凸宣言の凸予定を更新
  await declare.SetPlan(plan.alpha)

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
    list.Output(args as AtoE)
  } else if (/^[1-5]$/i.test(args)) {
    // ボス番号の凸予定一覧を表示
    list.Output(NtoA(args) as AtoE)
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
 * `/cb task`, `/cb kill`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const taskKillController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // タスキルのロールを付与する
  role.AddTaskKillRole(_msg)
}

/**
 * `/cb update report`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const updateReportController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // メンバー全員の状態を取得
  const members = await status.Fetch()
  situation.Report(members)

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()
  await list.SituationEdit(plans)

  _msg.reply('凸状況を更新したわよ！')
}

/**
 * `/cb help`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const helpController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const url = 'https://github.com/beroba/convex-management/blob/master/docs/command.md'
  _msg.reply('ここを確認しなさい！\n' + url)
}
