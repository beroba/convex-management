import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as command from './'
import * as util from '../../util'
import * as bossTable from '../../io/bossTable'
import * as dateTable from '../../io/dateTable'
import * as category from '../convex/category'
import * as activityTime from '../convex/activityTime'
import * as etc from '../convex/etc'
import * as react from '../convex/react'
import * as plan from '../plan/delete'

/**
 * 運営管理者用のコマンド
 * @param content 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const Management = async (content: string, msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.MANAGEMENT, msg.channel)) return

  // コマンド実行ユーザーかどうかを確認
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

    case /cb manage update sisters/.test(content): {
      await updateSistersController('/cb manage update sisters', content, msg)
      return 'Update convex management sisters'
    }

    case /cb manage set react/.test(content): {
      await setReactController('/cb manage set react', content, msg)
      return 'Set react for convex'
    }

    case /cb manage reflect activity time/.test(content): {
      await reflectActivityTimeController('/cb manage reflect activity time', content, msg)
      return 'Reflect activity time on the sheet'
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
  // 引数を抽出
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
  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // 引数が無い場合は終了
  if (!args) return _msg.reply('削除したい年と月を入力しなさい！')

  // 年と月がない場合終了
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
  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // 日付テーブルを更新する
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
  // ボステーブルを更新する
  await bossTable.Update()

  _msg.reply('クランバトルのボステーブルを設定したわよ！')
}

/**
 * `/cb manage remove role`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const removeRoleController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 凸残ロールを全て外す
  etc.RemoveConvexRoles()

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

  // クランメンバーの更新をする
  await etc.UpdateMembers(_msg)

  _msg.reply('クランメンバー一覧を更新したわよ！')
}

/**
 * `/cb manage update sisters`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const updateSistersController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 妹クランメンバーの更新をする
  await etc.UpdateSisters(_msg)

  _msg.reply('妹クランメンバー一覧を更新したわよ！')
}

/**
 * `/cb manage set react`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const setReactController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // #凸宣言-ボス状況の絵文字を設定
  await react.SetDeclare()

  // #活動時間のチャンネルを取得
  await react.SetActivityTime()

  _msg.reply('凸管理用の絵文字を設定したわよ！')
}

/**
 * `/cb manage reflect activity time`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const reflectActivityTimeController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // スプレッドシートに反映
  await activityTime.ReflectOnSheet()

  _msg.reply('活動時間を設定したわよ！')
}

/**
 * `/cb manage delete all plan`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const deleteAllPlanController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 凸予定を全て削除
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
  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // 引数が無い場合は終了
  if (!args) return _msg.reply('更新したいプレイヤーと名前を指定しなさい')

  // 変更先の名前を取得
  const name = util
    .Format(args)
    .replace(/<.+>/, '') // プレイヤーIDを省く
    .trim()

  // 名前を設定する
  await etc.SetName(name, _msg)

  _msg.reply('名前を更新したわよ！')
}

/**
 * `/cb manage set cal`のController
 * @param _command 引数以外のコマンド部分
 * @param _content 入力された内容
 * @param _msg DiscordからのMessage
 */
const setCalController = async (_command: string, _content: string, _msg: Discord.Message) => {
  // 引数を抽出
  const args = command.ExtractArgument(_command, _content)

  // 引数が無い場合は終了
  if (!args) return _msg.reply('更新したいプレイヤーと名前を指定しなさい')

  // 名前を設定する
  await _msg.guild?.members.cache.get(Settings.CAL_ID)?.setNickname(args)

  _msg.reply('キャルの名前を更新したわよ！')
}
