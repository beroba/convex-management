import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {AtoA} from 'alphabet-to-number'
import * as bossTable from '../../io/bossTable'
import * as dateTable from '../../io/dateTable'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as category from './category'

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

    case /cb manage set bossTable/.test(command): {
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

  // クランメンバーに凸残ロールを付与する
  clanMembers?.forEach(m => m?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX))

  msg.reply('凸残ロール全て外したわよ！')
}

/**
 * メンバーの情報
 */
type Members = {
  name: string
  id: string
}

/**
 * スプレッドシートのメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
const updateMembers = async (msg: Discord.Message) => {
  // クランメンバー一覧をニックネームで取得
  const members: Option<Members[]> = msg.guild?.roles.cache
    .get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => ({
      name: util.GetUserName(m),
      id: m.id,
    }))
    .sort((a, b) => (a.name > b.name ? 1 : -1))

  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // シートに名前とidを保存する
  fetchNameAndId(members, sheet)

  msg.reply('クランメンバー一覧を更新したわよ！')
}

/**
 * 妹クランのメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
const updateSisters = async (msg: Discord.Message) => {
  // 妹クランメンバー一覧をニックネームで取得
  const members: Option<Members[]> = msg.guild?.roles.cache
    .get(Settings.ROLE_ID.SISTER_MEMBERS)
    ?.members.map(m => ({
      name: util.GetUserName(m),
      id: m.id,
    }))
    .sort((a, b) => (a.name > b.name ? 1 : -1))

  // 妹クランのシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.SISTER_SHEET.SHEET_NAME)

  // シートに名前とidを保存する
  fetchNameAndId(members, sheet)

  msg.reply('妹クランメンバー一覧を更新したわよ！')
}

/**
 * 指定されたシートにメンバーの名前とidを保存する
 * @param members メンバーの情報
 * @param sheet 書き込むシート
 */
const fetchNameAndId = async (members: Option<Members[]>, sheet: any) => {
  // メンバー一覧を更新
  members?.forEach(async (m, i) => {
    const col = Settings.INFORMATION_SHEET.MEMBER_COLUMN

    // 名前を更新
    const name_cell = await sheet.getCell(`${col}${i + 3}`)
    name_cell.setValue(m.name)

    // idを更新
    const id_cell = await sheet.getCell(`${AtoA(col, 1)}${i + 3}`)
    id_cell.setValue(m.id)
  })
}
