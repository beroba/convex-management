import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'

/**
 * 新規メンバーに方針チャンネルを見るよう催促するメッセージを送信する
 * @param client bot(キャル)のclient
 * @param member 新規メンバー
 */
export const GuildMemberAdd = (client: Discord.Client, member: Discord.GuildMember) => {
  // クランのサーバーでなければ終了
  if (member.guild.id !== ThrowEnv('CLAN_SERVER_ID')) return

  // ウェルカムチャンネルにメ催促メッセージを送信
  const channel = client.channels.cache.get(ThrowEnv('WELCOME_CHANNEL_ID')) as Discord.TextChannel
  channel?.send(`<@!${member.user?.id}> まずは <#${ThrowEnv('POLICY_CHANNEL_ID')}> を確認しなさい！`)

  console.log(`I’m ${member.user?.username}, a new member.`)
}
