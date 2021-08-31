import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '.'

/**
 * #id送信ロール付与 にリアクションしたユーザーに、idスクショ送信のロールを付与する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return ロール付与の実行結果
 */
export const RoleGrant = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  const isPlayerIdRoleGrant = react.message.channel.id === Settings.CHANNEL_ID.PLAYER_ID_ROLE_GRANT
  if (!isPlayerIdRoleGrant) return

  const member = util.GetMembersFromUser(react.message.guild?.members, user)
  member?.roles.add(Settings.ROLE_ID.PLAYER_ID_SEND)

  const text = [
    `<@!${user.id}>  <#${Settings.CHANNEL_ID.PLAYER_ID_SEND}> ここでスクショを送ってね！`,
    '※10秒後にこのメッセージは消えます',
  ].join('\n')
  const msg = await react.message.reply(text)

  // 10秒後にメッセージを削除する
  setTimeout(() => msg.delete(), 10000)

  return 'Grant player id send role'
}

/**
 * 入力されたメッセージを #プレイヤーidリスト に移動し元のメッセージを削除する。
 * #id送信チャンネルの閲覧ロールも削除する
 * @param msg DiscordからのMessage
 */
export const Save = async (msg: Discord.Message): Promise<Option<string>> => {
  const isBot = msg.member?.user.bot
  if (isBot) return

  const isPlayerIdSend = msg.channel.id === Settings.CHANNEL_ID.PLAYER_ID_SEND
  if (!isPlayerIdSend) return

  await msg.member?.roles.remove(Settings.ROLE_ID.PLAYER_ID_SEND)

  // prettier-ignore
  const text = [
    util.GetUserName(msg.member),
    util.Format(msg.content),
  ].join('\n')
  // 画像がなければ空文字列
  const img = msg.attachments.map(a => a.url).first()

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PLAYER_ID_LIST)
  await channel.send(img ? {content: text, files: [img]} : text)

  setTimeout(() => msg.delete(), 100)

  return 'Save player id'
}
