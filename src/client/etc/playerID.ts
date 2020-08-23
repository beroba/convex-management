import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * #id送信ロール付与いリアクションしたユーザーに、idスクショ送信のロールを付与する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return ロール付与の実行結果
 */
export const RoleGrant = (react: Discord.MessageReaction, user: Discord.User): Option<string> => {
  // #id送信ロール付与でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.PLAYER_ID_ROLE_GRANT) return

  // idスクショ送信のロールを付与する
  const member = react.message.guild?.members.cache.map(m => m).filter(m => m.user.id === user.id)[0]
  member?.roles.add(Settings.ROLE_ID.PLAYER_ID_SEND)

  return 'Grant player id send role'
}

/**
 * 入力されたメッセージを#プレイヤーidリストに移動し元のメッセージを削除する。
 * #id送信チャンネルの閲覧ロールも削除する
 * @param msg DiscordからのMessage
 */
export const Save = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージはコマンド実行しない
  if (msg.member?.user.bot) return

  // #id送信チャンネルでなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.PLAYER_ID_SEND) return

  // idスクショ送信のロールを削除する
  await msg.member?.roles.remove(Settings.ROLE_ID.PLAYER_ID_SEND)

  // 画像のURLを取得
  const url = msg.attachments.map(a => a.url)[0]

  // #プレイヤーidリストにメッセージを送信
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PLAYER_ID_LIST)
  // 画像がある場合は画像も送信
  await channel.send(msg.content, url ? {files: [url]} : {})

  // 元のメッセージを削除
  await msg.delete()

  return 'Save player id'
}
