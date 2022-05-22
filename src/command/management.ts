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
import * as schedule from '../io/schedule'
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
    case /cb delete category/.test(content): {
      await deleteCategoryController('/cb delete category', content, msg)
      return 'Delete organization category'
    }

    case /cb set boss/.test(content): {
      await setBossController('/cb set boss', content, msg)
      return 'Set convex bossTable'
    }

    case /cb reset role/.test(content): {
      await resetRoleController('/cb reset role', content, msg)
      return 'Release all resetting convex rolls'
    }

    case /cb remove role/.test(content): {
      await removeRoleController('/cb remove role', content, msg)
      return 'Release all remaining convex rolls'
    }

    case /cb update members/.test(content): {
      await updateMembersController('/cb update members', content, msg)
      return 'Update convex management members'
    }

    case /cb delete all plan/.test(content): {
      await deleteAllPlanController('/cb delete all plan', content, msg)
      return 'All delete plan'
    }

    case /cb set cal/.test(content): {
      await setCalController('/cb set cal', content, msg)
      return 'Set cal name'
    }
  }
}

/**
 * `/cb delete category`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const deleteCategoryController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const args = command.ExtractArgument(_command, _content)
  if (!args) return _msg.reply('削除したい年と月を入力しなさい！')

  const [year, month] = args.split('/').map(Number)
  const err = await category.Delete(year, month)

  const title = category.CreateTitle(year, month)
  _msg.reply(err ? `${title}なんてないんだけど！` : `${title}を削除したわ`)
}

/**
 * `/cb set boss`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const setBossController = async (_command: string, _content: string, _msg: Discord.Message) => {
  const table = await bossTable.Update()
  if (!table) {
    return _msg.reply('`boss`の値が見つからなかったわ')
  }

  const d = new Date()
  const [year, month] = [d.getFullYear(), d.getMonth() + 1]
  await category.Rename(year, month, table)

  _msg.reply('クランバトルのボステーブルを設定したわよ！')
}

/**
 * `/cb reset role`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const resetRoleController = async (_command: string, _content: string, _msg: Discord.Message) => {
  await role.ResetRemainConvex()
  _msg.reply('凸残ロール振り直したわよ！')
}

/**
 * `/cb remove role`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const removeRoleController = async (_command: string, _content: string, _msg: Discord.Message) => {
  await role.RemoveRemainConvex()
  _msg.reply('凸残ロール全て外したわよ！')
}

/**
 * `/cb update members`のController
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

  const members = await etc.UpdateMembers(_msg)
  _msg.reply('クランメンバー一覧を更新したわよ！')

  await situation.Report(members)
  await situation.Boss(members)

  const plans = await schedule.Fetch()
  await situation.Plans(plans)
}

/**
 * `/cb delete all plan`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const deleteAllPlanController = async (_command: string, _content: string, _msg: Discord.Message) => {
  await plan.DeleteAll()
  _msg.reply('凸予定を全て削除したわよ！')
}

/**
 * `/cb set cal`のController
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
