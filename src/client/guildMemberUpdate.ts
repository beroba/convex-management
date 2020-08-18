import * as Discord from 'discord.js'
import Settings from 'const-settings'

/**
 * キャルbotの管理者にヤバイわよ！のロールを付与
 * @param member 変更後のmember情報
 */
export const GuildMemberUpdate = (member: Discord.GuildMember | Discord.PartialGuildMember) => {
  // キャルbotの管理者じゃない場合は終了
  if (member.user?.id !== Settings.ADMIN_ID) return

  const yabaiwayo = member.guild.roles.cache.get(Settings.ROLE_ID.YABAIWAYO)
  if (!yabaiwayo) return

  // ヤバイわよ！の権限を管理者にする
  yabaiwayo.setPermissions(['ADMINISTRATOR'])

  // キャルbot管理者にヤバイわよ！ロールを付与する
  member.roles.add(Settings.ROLE_ID.YABAIWAYO)

  console.log('Permission for bot admin')
}
