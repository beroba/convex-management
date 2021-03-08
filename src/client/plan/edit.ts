import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as schedule from '../../io/schedule'
import * as list from './list'

/**
 * 凸予定のメッセージ更新に合わせてスプレッドシートの値も更新する
 * @param msg DiscordからのMessage
 * @return 更新処理の実行結果
 */
export const Message = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // #凸予定でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_RESERVATE) return

  // ボス番号を除いたメッセージを取得
  const text = util.Format(msg.content).slice(1).trim()

  // 凸予定のメッセージを更新
  const plans = await schedule.Edit(text, msg.id)
  await util.Sleep(100)

  // 凸状況を更新
  await list.SituationEdit(plans)

  return 'Edit appointment message'
}
