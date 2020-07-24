import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'

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
    case /cb manage update members/.test(command):
      updateMembers(msg)
      return 'Update convex management members'
    case /cb manage sheet/.test(command):
      spreadsheetLink(msg)
      return 'Show spreadsheet link'
  }
}

/**
 * 凸管理のメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
const updateMembers = async (msg: Discord.Message) => {
  // クランメンバー一覧をニックネームで取得
  const clanMembers: Option<string[]> = msg.guild?.roles.cache
    .get(Settings.ROLE_ID.CLAN_MEMBERS)
    ?.members.map(m => (m.nickname ? m.nickname : m.user.username))
    .sort()

  // 凸管理のSHEETを取得
  const worksheet = await spreadsheet.GetWorksheet(Settings.CONVEX_WORKSHEET.MANAGEMENT)

  // メンバー一覧を更新
  clanMembers?.forEach(async (m, i) => {
    const cell = await worksheet.getCell(`A${i + 2}`)
    await cell.setValue(m)
  })

  msg.reply('凸管理のメンバー一覧を更新したわよ！')
}

/**
 * スプレッドシートのリンクを送信する
 * @param msg DiscordからのMessage
 */
const spreadsheetLink = (msg: Discord.Message) => {
  msg.reply('https://docs.google.com/spreadsheets/d/11uWCeVC5kWKYAWVJrHRoYz502Wue6qHyDtbNM4UULso')
}
