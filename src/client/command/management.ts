import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * 運営管理者側のコマンド
 * @param command 入力されたコマンド
 * @param msg DiscordからのMessage
 */
export const Management = (command: string, msg: Discord.Message): Option<string> => {
  // 指定のチャンネル以外では実行されない用にする
  if (!util.IsChannel(Settings.COMMAND_CHANNEL.MANAGEMENT, msg.channel)) return

  switch (command.split(' ')[0]) {
    case '/manage.resetmember':
      resetMember(msg)
      return 'Reset convex management members'
  }
}

/**
 * 凸管理のメンバーをリセットする
 * @param msg DiscordからのMessage
 */
const resetMember = (msg: Discord.Message) => {
  const clanMembers = msg.guild?.roles.cache
    .get('719906267824521267')
    ?.members.map(m => (m.nickname ? m.nickname : m.user.username))
  msg.reply(clanMembers)
}
