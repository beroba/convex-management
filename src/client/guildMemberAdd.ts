import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'

/**
 * 新規メンバーに方針チャンネルを見るよう催促するメッセージを送信する
 * @param client bot(キャル)のclient
 * @param member 新規メンバー
 */
export const GuildMemberAdd = (client: Discord.Client, member: Discord.GuildMember) => {
  // クランのサーバーでなければ終了
  if (member.guild.id !== ThrowEnv('CLAN_SERVER_ID')) return

  // ウェルカムチャンネルに催促メッセージを送信
  const channel = client.channels.cache.get(Settings.WELCOME_CHANNEL.CHAT_ID) as Discord.TextChannel

  const firstLine = `<@!${member.user?.id}> まずは <#${Settings.WELCOME_CHANNEL.POLICY_ID}> を確認しなさい！`
  const secondLine = `ちゃんと <#${Settings.WELCOME_CHANNEL.INTRODUCTION_ID}> も書くことね`
  channel?.send(`${firstLine}\n${secondLine}`)

  console.log(`I’m ${member.user?.username}, a new member.`)
}
