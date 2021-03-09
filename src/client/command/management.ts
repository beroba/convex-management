import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {AtoA} from 'alphabet-to-number'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as bossTable from '../../io/bossTable'
import * as dateTable from '../../io/dateTable'
import * as status from '../../io/status'
import {User} from '../../io/type'
import * as category from './category'
import * as activityTime from '../convex/activityTime'

/**
 * 運営管理者用のコマンド
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const Management = async (command: string, msg: Discord.Message): Promise<Option<string>> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.MANAGEMENT, msg.channel)) return

  // コマンド実行ユーザーかどうかを確認
  const isRole = msg.member?.roles.cache.some(r => Settings.COMMAND_ROLE.some((v: string) => v === r.id))
  if (!isRole) return

  switch (true) {
    case /cb manage create category/.test(command): {
      const arg = command.replace('/cb manage create category', '')
      category.Create(arg, msg)
      return 'Create ClanBattle category'
    }

    case /cb manage delete category/.test(command): {
      const arg = command.replace('/cb manage delete category', '')
      category.Delete(arg, msg)
      return 'Delete ClanBattle category'
    }

    case /cb manage set days/.test(command): {
      const arg = command.replace('/cb manage set days ', '')
      // 日付テーブルを更新する
      await dateTable.Update(arg)

      msg.reply('クランバトルの日付を設定したわよ！')
      return 'Set convex days'
    }

    case /cb manage set boss/.test(command): {
      // ボステーブルを更新する
      await bossTable.Update()

      msg.reply('クランバトルのボステーブルを設定したわよ！')
      return 'Set convex bossTable'
    }

    case /cb manage remove role/.test(command): {
      removeRole(msg)
      return 'Release all remaining convex rolls'
    }

    case /cb manage update members/.test(command): {
      updateMembers(msg)
      return 'Update convex management members'
    }

    case /cb manage update sisters/.test(command): {
      updateSisters(msg)
      return 'Update convex management sisters'
    }

    case /cb manage set react/.test(command): {
      // #凸宣言-ボス状況の絵文字を設定
      await setReactForDeclare()
      // #活動時間のチャンネルを取得
      await setReactForActivityTime()

      msg.reply('凸管理用の絵文字を設定したわよ！')
      return 'Set react for convex'
    }

    case /cb manage reflect activity time/.test(command): {
      await activityTime.ReflectOnSheet()
      return 'Reflect activity time on the sheet'
    }

    case /cb manage sheet/.test(command): {
      msg.reply(Settings.URL.SPREADSHEET)
      return 'Show spreadsheet link'
    }
  }
}

/**
 * 凸残ロールを全て外す
 * @param msg DiscordからのMessage
 */
const removeRole = (msg: Discord.Message) => {
  // べろばあのクランメンバー一覧を取得
  const clanMembers = util
    .GetGuild()
    ?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => m)

  // クランメンバーの凸残ロールを全て外す
  clanMembers?.forEach(m => m?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX))

  msg.reply('凸残ロール全て外したわよ！')
}

/**
 * スプレッドシートのメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
const updateMembers = async (msg: Discord.Message) => {
  // クランメンバー一覧をニックネームで取得
  const users: Option<User[]> = msg.guild?.roles.cache
    .get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => ({
      name: util.GetUserName(m),
      id: m.id,
    }))
    .sort((a, b) => (a.name > b.name ? 1 : -1)) // 名前順にソート

  // ステータスを更新
  await status.UpdateUsers(users)
  await util.Sleep(100)

  // スプレッドシートに名前とidを保存する
  await fetchNameAndID(users, Settings.INFORMATION_SHEET.SHEET_NAME)

  msg.reply('クランメンバー一覧を更新したわよ！')
}

/**
 * 妹クランのメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
const updateSisters = async (msg: Discord.Message) => {
  // 妹クランメンバー一覧をニックネームで取得
  const users: Option<User[]> = msg.guild?.roles.cache
    .get(Settings.ROLE_ID.SISTER_MEMBERS)
    ?.members.map(m => ({
      name: util.GetUserName(m),
      id: m.id,
    }))
    .sort((a, b) => (a.name > b.name ? 1 : -1)) // 名前順にソート

  // スプレッドシートに名前とidを保存する
  await fetchNameAndID(users, Settings.SISTER_SHEET.SHEET_NAME)

  msg.reply('妹クランメンバー一覧を更新したわよ！')
}

/**
 * 指定されたシートにメンバーの名前とidを保存する
 * @param members メンバーの情報
 * @param name 書き込むシートの名前
 */
const fetchNameAndID = async (users: Option<User[]>, name: string) => {
  // 値がない場合は終了
  if (!users) return

  // 書き込み先のシートを取得
  const sheet = await spreadsheet.GetWorksheet(name)

  // メンバー一覧を更新
  await Promise.all(
    users.map(async (m, i) => {
      const col = Settings.INFORMATION_SHEET.MEMBER_COLUMN

      // 名前を更新
      const name_cell = await sheet.getCell(`${col}${i + 3}`)
      name_cell.setValue(m.name)

      // idを更新
      const id_cell = await sheet.getCell(`${AtoA(col, 1)}${i + 3}`)
      id_cell.setValue(m.id)
    })
  )
}

/**
 * #凸宣言-ボス状況の絵文字を設定する
 */
const setReactForDeclare = async () => {
  // チャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸宣言のメッセージを取得
  const declare = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.DECLARE)

  // 本戦、保険の絵文字を付ける
  await declare.react(Settings.EMOJI_ID.HONSEN)
  await declare.react(Settings.EMOJI_ID.HOKEN)
}

/**
 * #活動時間のチャンネルを取得する
 */
const setReactForActivityTime = async () => {
  // チャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.ACTIVITY_TIME)

  // 離席中のメッセージを取得
  const awayIn = await channel.messages.fetch(Settings.ACTIVITY_TIME.AWAY_IN)

  // 出席、離席の絵文字を付ける
  await awayIn.react(Settings.EMOJI_ID.SHUSEKI)
  await awayIn.react(Settings.EMOJI_ID.RISEKI)

  // 1-5日目の処理をする
  const days: string[] = Object.values(Settings.ACTIVITY_TIME.DAYS)
  Promise.all(
    days.map(async id => {
      // 日付のメッセージを取得
      const day = await channel.messages.fetch(id)

      // 1-7までの絵文字を付ける
      const emoji: string[] = Object.values(Settings.ACTIVITY_TIME.EMOJI)
      Promise.all(emoji.map(async id => day.react(id)))
    })
  )
}
