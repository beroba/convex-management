import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {NtoA} from 'alphabet-to-number'
import * as declare from '../declare/list'
import * as list from './list'
import * as schedule from '../../io/schedule'
import * as util from '../../util'
import {AtoE} from '../../util/type'

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

  // 編集されたメッセージを整形
  const content = util.Format(msg.content.replace(/\n/g, ' '))

  // ボス番号を取得
  const alpha = NtoA(content[0]) as AtoE

  // ボス番号を除いたメッセージを取得
  const text = content.slice(1).trim()

  // 凸予定のメッセージを更新
  const plans = await schedule.Edit(text, msg.id)

  // 凸状況を更新
  await list.SituationEdit(plans)

  // 凸宣言の凸予定を更新
  await declare.SetPlan(alpha)

  // 凸宣言を更新
  declare.SetUser(alpha)

  return 'Edit appointment message'
}
