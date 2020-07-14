import * as Discord from 'discord.js'
import throwEnv from 'throw-env'

/**
 * 新規メンバーに方針チャンネルを見るよう催促するメッセージを送信する
 * @param client bot(キャル)のclient
 * @param member 新規メンバー
 */
export const GuildMemberAdd = (
  client: Discord.Client,
  member: Discord.GuildMember | Discord.PartialGuildMember
) => {
  // クランのサーバーでなければ終了
  if (member.guild.id !== throwEnv('CLAN_SERVER_ID')) return

  const channel = client.channels.cache.get(throwEnv('WELCOME_CHANNEL_ID')) as Discord.TextChannel
  channel?.send(`<@!${member.user?.id}> まずは <#${throwEnv('POLICY_CHANNEL_ID')}> を確認しなさい！`)
}
