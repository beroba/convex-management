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
  const channel = util.GetTextChannel(Settings.WELCOME_CHANNEL.CHAT_ID)

  channel.send(
    `<@!${member.user?.id}> まずは <#${Settings.WELCOME_CHANNEL.POLICY_ID}> を確認しなさい！\n` +
      `ちゃんと <#${Settings.WELCOME_CHANNEL.INTRODUCTION_ID}> も書くことね`
  )

  console.log(`I’m ${member.user?.username}, a new member.`)
}
