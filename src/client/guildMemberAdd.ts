import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'
import * as util from '../util'

/**
 * 新規メンバーに方針チャンネルを見るよう催促するメッセージを送信する
 * @param member 新規メンバー
 */
export const GuildMemberAdd = (member: Discord.GuildMember | Discord.PartialGuildMember) => {
  // クランのサーバーでなければ終了
  if (member.guild.id !== ThrowEnv('CLAN_SERVER_ID')) return

  // ウェルカムチャンネルに催促メッセージを送信
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CHAT)

  channel.send(
    `<@!${member.user?.id}> まずは <#${Settings.CHANNEL_ID.CHANNEL_POLICY}> を確認しなさい！\n` +
      `ちゃんと <#${Settings.CHANNEL_ID.INTRODUCTION}> も書くことね\n` +
      `クランに入る人は <#${Settings.CHANNEL_ID.PLAYER_ID_ROLE_GRANT}> を見て指示通りにしたがってね`
  )

  console.log(`I’m ${member.user?.username}, a new member.`)
}
