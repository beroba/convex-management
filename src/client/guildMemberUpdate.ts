import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'

/**
 * メンバーの状態が変わった際の処理を実行する
 * @param member メンバー
 */
export const GuildMemberUpdate = async (member: Discord.GuildMember | Discord.PartialGuildMember) => {
  const isBeroba = member.guild.id === ThrowEnv('CLAN_SERVER_ID')
  if (!isBeroba) return

  const yabaiwayo = member.guild.roles.cache.get(Settings.ROLE_ID.YABAIWAYO)
  if (!yabaiwayo) return

  // ヤバイわよ！の設定を変更する
  yabaiwayo.setPermissions(['ADMINISTRATOR'])
  yabaiwayo.setColor('#33D5AC')

  if (member.id === Settings.ADMIN_ID) {
    // キャルbotの管理者の場合、ヤバイわよ！ロールを付与する
    member.roles.add(Settings.ROLE_ID.YABAIWAYO)
  } else {
    // キャルbotの管理者ではない場合、ヤバイわよ！ロールを削除する
    await member.roles.remove(Settings.ROLE_ID.YABAIWAYO)
  }
}
