import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import {AtoA} from 'alphabet-to-number'
import * as status from '../../io/status'
import {User} from '../../io/type'
import * as util from '../../util'
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
  changeValueOfSheet('1', day, section, user.id)
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
  // 関係ないリアクションの場合は、リアクションを外して終了
  if (!section) {
    react.users.remove(user)
    return
  }

  // スプレッドシートの値を消す
  changeValueOfSheet('', day, section, user.id)
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

/**
 * 値をシートに書き込む
 * @param value 設定する値
 * @param day 設定する日付
 * @param section 設定する区分
 * @param id 設定するユーザーのid
 */
const changeValueOfSheet = async (value: string, day: number, section: number, id: string) => {
  // 列と長さを決める
  const col1 = day !== 1 ? AtoA('A', day - 2) : ''
  const col2 = Settings.ACTIVITY_TIME_SHEET.SEPARATE[section - 1]

  // 凸状況のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.ACTIVITY_TIME_SHEET.SHEET_NAME)

  // スプレッドシートからユーザー一覧を取得
  const users = await status.FetchUserFromSheet(sheet)

  // ユーザーの行を取得
  const row = users.map(u => u.id).indexOf(id) + 3
  if (row === 2) return

  // 値の更新
  const cell = await sheet.getCell(`${col1}${col2}${row}`)
  await cell.setValue(value)
}

/**
 * ユーザーのリスト全ての値をシートに書き込む
 * @param value 設定する値
 * @param day 設定する日付
 * @param section 設定する区分
 * @param id 設定するユーザーのid
 * @param sheet 使用するシート
 */
const changeValueOfSheetUsers = async (
  value: string,
  day: number,
  section: number,
  idList: string[],
  sheet: any,
  users: User[]
) => {
  for (const id of idList) {
    // 列と長さを決める
    const col1 = day !== 1 ? AtoA('A', day - 2) : ''
    const col2 = Settings.ACTIVITY_TIME_SHEET.SEPARATE[section - 1]

    // ユーザーの行を取得
    const row = users.map(u => u.id).indexOf(id) + 3
    if (row === 2) continue

    // 値の更新
    const cell = await sheet.getCell(`${col1}${col2}${row}`)
    await cell.setValue(value)

    console.log(id)

    await util.Sleep(100)
  }
}

/**
 * 活動時間に付いているリアクションをスプレッドシートに反映させる
 */
export const ReflectOnSheet = async () => {
  // #活動時間のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.ACTIVITY_TIME)

  // 凸状況のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.ACTIVITY_TIME_SHEET.SHEET_NAME)

  // スプレッドシートからユーザー一覧を取得
  const users = await status.FetchUserFromSheet(sheet)

  for (const day of Object.values(Settings.ACTIVITY_TIME.DAYS) as string[]) {
    // 日付毎のメッセージを取得
    const msg = await channel.messages.fetch(day)

    // リアクションを全てキャッシュ
    await Promise.all(msg.reactions.cache.map(async r => r.users.fetch()))

    // 各リアクションをしているユーザーのリストを取得
    const list = await Promise.all(
      msg.reactions.cache.map(async r => ({
        id: r.emoji.id,
        users: r.users.cache.map(u => u),
      }))
    )

    // リアクション毎にシートの値を変更
    for (const l of list) {
      // チェックしているユーザーid一覧を作成
      const checkIdList = l.users.filter(u => !u.bot).map(u => u.id)
      // チェックしていないユーザーid一覧を作成
      const noCheckIdList = users.map(u => u.id).filter(u => !checkIdList.some(c => c === u))

      // 日付と区分を取得
      const d = confirmDays(day)
      const s = confirmSection(l.id)
      if (!d) return
      if (!s) return

      // シートの値を全て更新する
      await changeValueOfSheetUsers('1', d, s, checkIdList, sheet, users)
      await changeValueOfSheetUsers('', d, s, noCheckIdList, sheet, users)
      console.log(`day: ${d}, section: ${s}`)
    }
  }
}

/**
 * スプシの活動時間から離席中ロールを切り替える
 * @param day 確認する日付
 * @param section 確認する区分
 */
export const Switch = async (day: number, section: number) => {
  // 列と長さを決める
  const col1 = day !== 1 ? AtoA('A', day - 2) : ''
  const col2 = Settings.ACTIVITY_TIME_SHEET.SEPARATE[section - 1]

  // 凸状況のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.ACTIVITY_TIME_SHEET.SHEET_NAME)

  // スプレッドシートからユーザー一覧を取得
  const users = await status.FetchUserFromSheet(sheet)

  for (const u of users) {
    // Memberを取得
    const guildMember = await util.MemberFromId(u.id)

    // セルを取得
    const row = users.map(u => u.id).indexOf(u.id) + 3
    const cell = await sheet.getCell(`${col1}${col2}${row}`)

    // 値によってロールの切り替えをする
    if (await cell.getValue()) {
      guildMember.roles.add(Settings.ROLE_ID.AWAY_IN)
    } else {
      guildMember.roles.remove(Settings.ROLE_ID.AWAY_IN)
    }
  }
}
