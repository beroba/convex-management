import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {AtoA} from 'alphabet-to-number'
import * as status from '../../io/status'
import * as spreadsheet from '../../util/spreadsheet'

/**
 * 活動時間の日付に区分の絵文字をつけたら追加する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 追加処理の実行結果
 */
export const Add = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #持ち越し凸先でなければ終了
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
  // 関係のリアクションの場合は、リアクションを外して終了
  if (!section) {
    react.users.remove(user)
    return
  }

  // スプレッドシートに値をつける
  changeValueOfSheet('1', day, section, user)

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

  // #持ち越し凸先でなければ終了
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
  // 関係のリアクションの場合は、リアクションを外して終了
  if (!section) {
    react.users.remove(user)
    return
  }

  // スプレッドシートの値を消す
  changeValueOfSheet('', day, section, user)

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

/**
 * 値をシートに書き込む
 * @param value 設定する値
 * @param day 設定する日付
 * @param section 設定する区分
 * @param user 設定するユーザー
 */
const changeValueOfSheet = async (value: string, day: number, section: number, user: Discord.User) => {
  // 列と長さを決める
  const col1 = day !== 1 ? AtoA('A', day - 2) : ''
  const col2 = Settings.ACTIVITY_TIME_SHEET.SEPARATE[section - 1]
  const count = Settings.ACTIVITY_TIME_SHEET.NUMBER[section - 1]

  // 凸状況のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.ACTIVITY_TIME_SHEET.SHEET_NAME)

  // スプレッドシートからユーザー一覧を取得
  const users = await status.FetchUserFromSheet(sheet)
  const row = users.map(u => u.id).indexOf(user.id) + 3

  await Promise.all(
    // カウントの数だけ値をつける
    Array(count)
      .fill('')
      .map(async (_, i) => {
        const cell = await sheet.getCell(`${col1}${AtoA(col2, i)}${row}`)
        await cell.setValue(value)
      })
  )
}
