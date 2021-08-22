import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as status from '../../io/status'
import * as util from '../../util'

/**
 * 活動時間の日付に区分の絵文字をつけたら追加する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 追加処理の実行結果
 */
export const Add = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #活動時間でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.ACTIVITY_TIME) return

  // メンバーの状態を取得
  const member = await status.FetchMember(user.id)
  // クランメンバーでなければ、リアクションを外して終了
  if (!member) {
    react.users.remove(user)
    return
  }

  // リアクションした日付が何日目か確認
  const day = confirmDays(react.message.id)
  // 日付ではない場合は、リアクションを外して終了
  if (!day) {
    react.users.remove(user)
    return
  }

  // リアクションした区分がどこだか確認
  const section = confirmSection(react.emoji.id)
  // 関係ないリアクションの場合は、リアクションを外して終了
  if (!section) {
    react.users.remove(user)
    return
  }

  // スプレッドシートに値をつける
  // changeValueOfSheet('1', day, section, user.id)
  await util.Sleep(100)

  return 'Activity time questionnaire add'
}

/**
 * 活動時間の日付に区分の絵文字をつけたら削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
export const Remove = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #持越凸先でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.ACTIVITY_TIME) return

  // メンバーの状態を取得
  const member = await status.FetchMember(user.id)
  // クランメンバーでなければ、リアクションを外して終了
  if (!member) {
    react.users.remove(user)
    return
  }

  // リアクションした日付が何日目か確認
  const day = confirmDays(react.message.id)
  // 関係のリアクションの場合は、リアクションを外して終了
  if (!day) {
    react.users.remove(user)
    return
  }

  // リアクションした区分がどこだか確認
  const section = confirmSection(react.emoji.id)
  // 関係ないリアクションの場合は、リアクションを外して終了
  if (!section) {
    react.users.remove(user)
    return
  }

  // スプレッドシートの値を消す
  // changeValueOfSheet('', day, section, user.id)
  await util.Sleep(100)

  return 'Activity time questionnaire remove'
}

/**
 * リアクションした日付が何日目か確認する
 * @param id リアクションしたメッセージのid
 * @return 日付の数字
 */
const confirmDays = (id: string): Option<number> =>
  // prettier-ignore
  id === Settings.ACTIVITY_TIME.DAYS.DAY1 ? 1 :
  id === Settings.ACTIVITY_TIME.DAYS.DAY2 ? 2 :
  id === Settings.ACTIVITY_TIME.DAYS.DAY3 ? 3 :
  id === Settings.ACTIVITY_TIME.DAYS.DAY4 ? 4 :
  id === Settings.ACTIVITY_TIME.DAYS.DAY5 ? 5 :
  null

/**
 * リアクションした区分がどこだか確認
 * @param id リアクションのid
 * @return 日付の数字
 */
const confirmSection = (id: Option<string>): Option<number> =>
  // prettier-ignore
  id === Settings.ACTIVITY_TIME.EMOJI._1 ? 1 :
  id === Settings.ACTIVITY_TIME.EMOJI._2 ? 2 :
  id === Settings.ACTIVITY_TIME.EMOJI._3 ? 3 :
  id === Settings.ACTIVITY_TIME.EMOJI._4 ? 4 :
  id === Settings.ACTIVITY_TIME.EMOJI._5 ? 5 :
  id === Settings.ACTIVITY_TIME.EMOJI._6 ? 6 :
  id === Settings.ACTIVITY_TIME.EMOJI._7 ? 7 :
  null
