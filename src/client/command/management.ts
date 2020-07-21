import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'

/**
 * 運営管理者用のコマンド
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 */
export const Management = (command: string, msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.MANAGEMENT, msg.channel)) return

  switch (true) {
    case /cb manage update members/.test(command):
      updateMembers(msg)
      return 'Update convex management members'
  }
}

/**
 * 凸管理のメンバー一覧を更新する
 * @param msg DiscordからのMessage
 */
const updateMembers = async (msg: Discord.Message) => {
  // クランメンバー一覧をニックネームで取得
  const clanMembers: Option<string[]> = msg.guild?.roles.cache
    .get(ThrowEnv('CLANMEMBERS_ROLE_ID'))
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
