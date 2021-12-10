import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as command from '.'
import * as declare from '../convex/declare/list'
import * as etc from '../convex/etc'
import * as format from '../convex/format'
import * as lapAndBoss from '../convex/lapAndBoss'
import * as manage from '../convex/manage'
import * as kill from '../convex/role/kill'
import * as situation from '../convex/situation'
import * as schedule from '../io/schedule'
import * as status from '../io/status'
import * as util from '../util'
import {AtoE, Member} from '../util/type'

/**
 * クラバト用のコマンド
 * @param content 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const ClanBattle = async (content: string, msg: Discord.Message): Promise<Option<string>> => {
  const isChannel = util.IsChannel(Settings.COMMAND_CHANNEL.CLAN_BATTLE, msg.channel)
  if (!isChannel) return

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

    case /cb delete declare/.test(content): {
      await deleteDeclareController('/cb delete declare', content, msg)
      return 'Delete declare'
    }

    case /cb delete plan/.test(content): {
      await deletePlanController('/cb delete plan', content, msg)
      return 'Delete plan'
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

    case /cb set name/.test(content): {
      await setNameController('/cb set name', content, msg)
      return 'Set member name'
    }

    case /cb set sub/.test(content): {
      await setSubController('/cb set sub', content, msg)
      return 'Sub-account settings'
    }

    case /cb reset member id/.test(content): {
      await resetMemberIdController('/cb reset member id', content, msg)
      return 'Sub-account settings'
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

  const args = command.ExtractArgument(_command, _content)

  // TL部分の生成
  const tl = _msg.content.split('\n').slice(1).join('\n')
  if (!tl) {
    _msg.reply('TLがないわ')
    return
  }

  // timeを作成
  const time = args && toTime(args)
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

  const args = command.ExtractArgument(_command, _content)

  // TL部分の生成
  const tl = _msg.content.split('\n').slice(1).join('\n')
  if (!tl) {
    _msg.reply('TLがないわ')
    return
  }

  // timeを作成
  const time = args && toTime(args)
  await format.TL(tl, time, _msg)
}

/**
 * `/cb convex`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const convexController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)
  if (!args) {
    _msg.reply('更新したいプレイヤーと凸状況を指定しなさい')
    return
  }

  // 更新先の凸状況を取得
  const st = util
    .Format(args)
    .replace(/<.+>/, '') // プレイヤーIDを省く
    .trim()

  const isFormat = /^(3|2\+{0,1}|1\+{0,2}|0\+{0,3})$/.test(st)
  if (!isFormat) {
    _msg.reply('凸状況の書式が違うわ')
    return
  }

  await manage.Update(st, _msg)
}

/**
 * `/cb lap`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const lapController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)
  if (!args) {
    _msg.reply('周回数とボス番号を指定しなさい')
    return
  }

  // 周回数とボス番号を取得
  const lap = util.Format(args).replace(/\s|[a-e]/gi, '')
  const alpha = util.Format(args).replace(/\s|\d/gi, '').toLowerCase()

  // 書式が違う場合は終了
  if (!/\d/.test(lap)) {
    _msg.reply('周回数の書式が違うわ、\\dで指定してね')
    return
  }
  if (!/[a-e]/i.test(alpha)) {
    _msg.reply('ボス番号の書式が違うわ、[a-e]で指定してね')
    return
  }

  await lapAndBoss.UpdateLap(lap.to_n(), <AtoE>alpha)

  const members = await status.Fetch()
  await situation.Report(members)
  await situation.Boss(members)

  const plans = await schedule.Fetch()
  await situation.Plans(plans)
}

/**
 * `/cb delete declare`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const deleteDeclareController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)
  if (!args) return _msg.reply('削除する凸宣言者を指定しないと消せないわ')

  // 引数からユーザーidだけを取り除く
  const id = util.Format(args).replace(/[^0-9]/g, '')

  let members = await status.Fetch()
  const member = members.find(m => m.id.find(n => n === id))

  if (!member) {
    _msg.reply(`クランメンバーにいなかったわ`)
    return
  }

  member.declare = ''
  members = await status.UpdateMember(member)

  'abcde'.split('').forEach(a => declare.SetUser(<AtoE>a, undefined, members))

  _msg.reply('凸宣言を全て削除したわ')
}

/**
 * `/cb delete plan`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const deletePlanController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)
  if (!args) return _msg.reply('削除する凸予定のidを指定しないと消せないわ')

  // 引数からユーザーidだけを取り除く
  const id = util.Format(args).replace(/[^0-9]/g, '')

  const member = await status.FetchMember(id)
  if (!member) return [[], undefined]

  const [plans, plan] = await schedule.Delete(member.id.first())
  if (!plan) {
    _msg.reply(`${id}の凸予定はなかったわ`)
    return
  }

  await situation.Plans(plans)
  await situation.DeclarePlan(plan.alpha)

  _msg.reply('凸予定を削除したわ')
}

/**
 * `/cb over`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const overController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)
  if (!args) {
    _msg.reply('HP A Bを指定しなさい')
    return
  }

  // HP, A, Bを分割して代入
  const [HP, A, B] = util.Format(args).split(' ').map(Number)
  etc.SimultConvexCalc(HP, A, B, _msg)
}

/**
 * `/cb task`, `/cb kill`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const taskKillController = async (_command: string, _content: string, _msg: Discord.Message) => {
  kill.Add(_msg)
}

/**
 * `/cb update report`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const updateReportController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const members = await status.Fetch()
  await situation.Report(members)
  await situation.Boss(members)

  const plans = await schedule.Fetch()
  await situation.Plans(plans)

  _msg.reply('凸状況を更新したわよ！')
}

/**
 * `/cb set name`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const setNameController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)

  let members: Member[]

  // 引数が無い場合はキャルステータスの名前を適用
  if (!args) {
    // キャルステータスの名前を適用
    const err = await status.SetNames()
    _msg.reply(err ? '`user`の値が見つからなかったわ' : 'キャルステータスの名前を適用したわよ！')

    members = await status.Fetch()
  } else {
    // 変更先の名前を取得
    const name = util
      .Format(args)
      .replace(/<.+>/, '') // プレイヤーIDを省く
      .trim()

    const user = _msg.mentions.users.first()
    if (!user) {
      _msg.reply('メンションで誰の名前を変更したいか指定しなさい')
      return
    }

    let member = await status.FetchMember(user.id)
    if (!member) {
      _msg.reply('その人はクランメンバーじゃないわ')
      return
    }

    members = await status.SetName(member, name)

    _msg.reply(`\`${name}\`の名前を更新したわよ！`)
  }

  await situation.Report(members)
  await situation.Boss(members)

  const plans = await schedule.Fetch()
  await situation.Plans(plans)
}

/**
 * `/cb set sub`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const setSubController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)

  // 引数が無い場合はキャルステータスの名前を適用
  if (!args) {
    _msg.reply('メンションで誰のメンバーIDをリセットしたいか指定しなさい')
    return
  }

  const mentions = _msg.mentions.users.map(u => u)
  if (mentions.length !== 2) {
    _msg.reply('`@メインアカウント` `@サブアカウント`を指定しなさい')
    return
  }

  const main = _msg.mentions.users.first() as Discord.User
  const sub = _msg.mentions.users.last() as Discord.User

  let member = await status.FetchMember(main.id)
  if (!member) {
    _msg.reply('その人はクランメンバーじゃないわ')
    return
  }

  const members = await status.SetSubAccount(member, sub.id)

  _msg.reply(`<@!${sub.id}>を\`${member.name}\`のサブアカウントに設定したわよ！`)

  await situation.Report(members)
  await situation.Boss(members)

  const plans = await schedule.Fetch()
  await situation.Plans(plans)
}

/**
 * `/cb reset member id`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const resetMemberIdController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)

  // 引数が無い場合はキャルステータスの名前を適用
  if (!args) {
    _msg.reply('メンションで誰のメンバーIDをリセットしたいか指定しなさい')
    return
  }

  const user = _msg.mentions.users.first()
  if (!user) {
    _msg.reply('メンションで誰のメンバーIDをリセットしたいか指定しなさい')
    return
  }

  let member = await status.FetchMember(user.id)
  if (!member) {
    _msg.reply('その人はクランメンバーじゃないわ')
    return
  }

  const members = await status.ResetAccountID(member, user.id)

  _msg.reply(`\`${member.name}\`のアカウントIDをリセットしたわよ！`)

  await situation.Report(members)
  await situation.Boss(members)

  const plans = await schedule.Fetch()
  await situation.Plans(plans)
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
