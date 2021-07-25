import * as Discord from 'discord.js'
import Settings from 'const-settings'

/**
 * キャルbotの管理者にヤバイわよ！のロールを付与
 * @param member 変更後のmember情報
 */
export const GuildMemberUpdate = async (member: Discord.GuildMember | Discord.PartialGuildMember) => {
  // ヤバイわよ！のロールを取得
  const yabaiwayo = member.guild.roles.cache.get(Settings.ROLE_ID.YABAIWAYO)
  if (!yabaiwayo) return

  // ヤバイわよ！の設定を変更する
  yabaiwayo.setPermissions(['ADMINISTRATOR'])
  yabaiwayo.setColor('#ff3ff1')
  // yabaiwayo.setColor('#33D5AC')

  if (member.id === Settings.ADMIN_ID) {
    // キャルbotの管理者の場合、ヤバイわよ！ロールを付与する
    member.roles.add(Settings.ROLE_ID.YABAIWAYO)
  } else {
    // キャルbotの管理者ではない場合、ヤバイわよ！ロールを削除する
    await member.roles.remove(Settings.ROLE_ID.YABAIWAYO)
  }
}
