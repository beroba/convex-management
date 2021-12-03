import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as command from '.'
import * as etc from '../convex/etc'
import * as category from '../convex/category'
import * as plan from '../convex/plan/delete'
import * as role from '../convex/role'
import * as situation from '../convex/situation'
import * as bossTable from '../io/bossTable'
import * as dateTable from '../io/dateTable'
import * as schedule from '../io/schedule'
import * as status from '../io/status'
import * as util from '../util'

/**
 * 運営管理者用のコマンド
 * @param content 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const Management = async (content: string, msg: Discord.Message): Promise<Option<string>> => {
  const isChannel = util.IsChannel(Settings.COMMAND_CHANNEL.MANAGEMENT, msg.channel)
  if (!isChannel) return

  const isRole = msg.member?.roles.cache.some(r => Settings.COMMAND_ROLE.some((v: string) => v === r.id))
  if (!isRole) return

  switch (true) {
    case /cb manage create category/.test(content): {
      await createCategoryController('/cb manage create category', content, msg)
      return 'Create ClanBattle category'
    }

    case /cb manage delete category/.test(content): {
      await deleteCategoryController('/cb manage delete category', content, msg)
      return 'Delete ClanBattle category'
    }

    case /cb manage set days/.test(content): {
      await setDaysController('/cb manage set days', content, msg)
      return 'Set convex days'
    }

    case /cb manage set boss/.test(content): {
      await setBossController('/cb manage set boss', content, msg)
      return 'Set convex bossTable'
    }

    case /cb manage remove role/.test(content): {
      await removeRoleController('/cb manage remove role', content, msg)
      return 'Release all remaining convex rolls'
    }

    case /cb manage update members/.test(content): {
      await updateMembersController('/cb manage update members', content, msg)
      return 'Update convex management members'
    }

    case /cb manage delete all plan/.test(content): {
      await deleteAllPlanController('/cb manage delete all plan', content, msg)
      return 'All delete plan'
    }

    case /cb manage set name/.test(content): {
      await setNameController('/cb manage set name', content, msg)
      return 'Set member name'
    }

    case /cb manage set cal/.test(content): {
      await setCalController('/cb manage set cal', content, msg)
      return 'Set cal name'
    }
  }
}

/**
 * `/cb manage create category`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const createCategoryController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)

  // 引数がある場合は引数の年と日を代入し、ない場合は現在の年と月を代入
  const [year, month] = args ? args.split('/').map(Number) : (d => [d.getFullYear(), d.getMonth() + 1])(new Date())
  category.Create(year, month, _msg)
}

/**
 * `/cb manage delete category`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const deleteCategoryController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)
  if (!args) return _msg.reply('削除したい年と月を入力しなさい！')

  const [year, month] = args.split('/').map(Number)
  category.Delete(year, month, _msg)
}

/**
 * `/cb manage set days`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const setDaysController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)
  if (!args) return _msg.reply('設定したい日付を入力しなさい！')

  await dateTable.Update(args)
  _msg.reply('クランバトルの日付を設定したわよ！')
}

/**
 * `/cb manage set boss`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const setBossController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const err = await bossTable.Update()
  _msg.reply(err ? '`boss`の値が見つからなかったわ' : 'クランバトルのボステーブルを設定したわよ！')
}

/**
 * `/cb manage remove role`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const removeRoleController = async (_command: string, _content: string, _msg: Discord.Message) => {
  await role.RemoveConvexRoles()
  _msg.reply('凸残ロール全て外したわよ！')
}

/**
 * `/cb manage update members`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const updateMembersController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 管理者以外実行できないようにする
  if (_msg.author.id !== Settings.ADMIN_ID) {
    _msg.reply('botの管理者に更新して貰うように言ってね')
    return
  }

  await etc.UpdateMembers(_msg)
  _msg.reply('クランメンバー一覧を更新したわよ！')
}

/**
 * `/cb manage delete all plan`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const deleteAllPlanController = async (_command: string, _content: string, _msg: Discord.Message) => {
  await plan.DeleteAll()
  _msg.reply('凸予定を全て削除したわよ！')
}

/**
 * `/cb manage set name`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const setNameController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)

  // 引数が無い場合はキャルステータスの名前を適用
  if (!args) {
    // キャルステータスの名前を適用
    const err = await status.SetNames()
    _msg.reply(err ? '`user`の値が見つからなかったわ' : 'キャルステータスの名前を適用したわよ！')
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

    await status.SetName(member, name)

    _msg.reply(`\`${name}\`の名前を更新したわよ！`)
  }

  const members = await status.Fetch()
  await situation.Report(members)
  await situation.Boss(members)

  const plans = await schedule.Fetch()
  await situation.Plans(plans)
}

/**
 * `/cb manage set cal`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const setCalController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)
  if (!args) return _msg.reply('更新したいプレイヤーと名前を指定しなさい')

  await _msg.guild?.members.cache.get(Settings.CAL_ID)?.setNickname(args)
  _msg.reply('キャルの名前を更新したわよ！')
}
