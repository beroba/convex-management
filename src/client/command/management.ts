import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as category from './category'

/**
 * 運営管理者用のコマンド
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 * @return 実行したコマンドの結果
 */
export const Management = (command: string, msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.MANAGEMENT, msg.channel)) return

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

    case /cb manage update members/.test(command): {
      updateMembers(msg)
      return 'Update convex management members'
    }

    case /cb manage sheet/.test(command): {
      spreadsheetLink(msg)
      return 'Show spreadsheet link'
    }
  }
}

/**
 * スプレッドシートのメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
const updateMembers = async (msg: Discord.Message) => {
  // クランメンバー一覧をニックネームで取得
  const clanMembers: Option<string[]> = msg.guild?.roles.cache
    .get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => util.GetUserName(m))
    .sort()

  // スプレッドシートから情報を取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // メンバー一覧を更新
  clanMembers?.forEach(async (m, i) => {
    const cell = await infoSheet.getCell(`A${i + 3}`)
    await cell.setValue(m)
  })

  msg.reply('クランメンバー一覧を更新したわよ！')
}

/**
 * スプレッドシートのリンクを送信する
 * @param msg DiscordからのMessage
 */
const spreadsheetLink = (msg: Discord.Message) => {
  msg.reply(Settings.URL.SPREADSHEET)
}
