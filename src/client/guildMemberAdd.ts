import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'
import * as util from '../util'

/**
 * クランメンバーが増えた際の処理を実行する
 * @param member メンバー
 */
export const GuildMemberAdd = (member: Discord.GuildMember | Discord.PartialGuildMember) => {
  const isBeroba = member.guild.id === ThrowEnv('CLAN_SERVER_ID')
  if (!isBeroba) return

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CHAT)

  const text = [
    `<@!${member.user?.id}> まずは <#${Settings.CHANNEL_ID.CHANNEL_POLICY}> を確認しなさい！`,
    `ちゃんと <#${Settings.CHANNEL_ID.INTRODUCTION}> も書くことね`,
    `クランに入る人は <#${Settings.CHANNEL_ID.PLAYER_ID_ROLE_GRANT}> を見て指示通りにしたがってね`,
  ].join('\n')
  channel.send(text)

  console.log(`I’m ${member.user?.username}, a new member.`)
}
