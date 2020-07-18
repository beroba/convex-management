import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'

/**
 * 運営管理者側のコマンド
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 */
export const Management = (command: string, msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.MANAGEMENT, msg.channel)) return

  switch (command.split(' ')[0]) {
    case '/manage.relocation':
      relocation(msg)
      return 'Relocate convex management members'
  }
}

/**
 * 凸管理のメンバーを再配置する
 * @param msg DiscordからのMessage
 */
const relocation = async (msg: Discord.Message) => {
  const clanMembers: Option<string[]> = msg.guild?.roles.cache
    .get('719906267824521267')
    ?.members.map(m => (m.nickname ? m.nickname : m.user.username))
    .sort()

  const worksheet = await spreadsheet.GetWorksheet(Settings.RELOCATION.SHEET)

  clanMembers?.forEach(async (m, i) => {
    const cell = await worksheet.getCell(`A${i + 2}`)
    await cell.setValue(m)
  })

  msg.reply('凸管理のメンバー一覧を再配置したわよ！')
}
