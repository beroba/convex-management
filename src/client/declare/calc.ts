import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'

/**
 * HPの計算とリアクションを付ける
 * @param msg DiscordからのMessage
 * @return 凸予定の実行結果
 */
export const React = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // #凸予定でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_DECLARE) return

  // 確認と持越の絵文字を付ける
  await msg.react(Settings.EMOJI_ID.KAKUNIN)
  await msg.react(Settings.EMOJI_ID.MOCHIKOSHI)

  return 'Calculate the HP'
}
