import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import {NtoA} from 'alphabet-to-number'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as list from './list'

/**
 * 凸予定の自分のメッセージに完了の絵文字をつけたら削除する
 * @param react DiscordからのReaction
 * @param user リアクションしたユーザー
 * @return 削除処理の実行結果
 */
export const Already = async (react: Discord.MessageReaction, user: Discord.User): Promise<Option<string>> => {
  // botのリアクションは実行しない
  if (user.bot) return

  // #凸予定でなければ終了
  if (react.message.channel.id !== Settings.CHANNEL_ID.CONVEX_RESERVATE) return

  // 完了の絵文字で無ければ終了
  if (react.emoji.id !== Settings.EMOJI_ID.KANRYOU) return

  // メッセージをキャッシュする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)
  await channel.messages.fetch(react.message.id)

  // 送信者と同じ人で無ければ終了
  if (react.message.author.id !== user.id) return

  // クランメンバーじゃなければ終了
  const isRole = react.message.member?.roles.cache.some(r => r.id === Settings.ROLE_ID.CLAN_MEMBERS)
  if (!isRole) return

  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.PLAN_SHEET.PLAN_CELLS)

  // 凸予定の完了を付ける
  await convexComplete(sheet, cells, react.message.id)

  // メッセージを削除
  react.message.delete()
  msgCalDelete(cells, react.message.id)

  // ボスのロールを外す
  deleteBossRole(cells, react.message)

  // 凸状況を更新
  list.SituationEdit()

  return 'Delete completed message'
}

/**
 * 凸予定のメッセージを削除した際に完了処理を実行
 * @param msg DiscordからのMessage
 * @return 削除処理の実行結果
 */
export const Delete = async (msg: Discord.Message): Promise<Option<string>> => {
  // #凸予定でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_RESERVATE) return

  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.PLAN_SHEET.PLAN_CELLS)

  // 凸予定が完了しているか確認
  if (!isConvexPlan(cells, msg)) return

  // 凸予定の完了を付ける
  await convexComplete(sheet, cells, msg.id)

  // メッセージを削除
  msgCalDelete(cells, msg.id)

  // ボスのロールを外す
  deleteBossRole(cells, msg)

  // 凸状況を更新
  list.SituationEdit()

  return 'Delete completed message'
}

/**
 * 凸報告のメッセージにボス名またはボス番号があった場合、先頭の凸報告を完了する
 * @param msg DiscordからのMessage
 */
export const Report = async (msg: Discord.Message) => {
  // ボス番号を取得
  const content = util.Format(msg.content)
  const num = await checkBossNumber(content)
  // ボス番号がなければ終了
  if (!num) return

  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.PLAN_SHEET.PLAN_CELLS)

  // ボス番号から凸予定のメッセージidを取得
  const id = readPlanMessageId(cells, msg.author.id, num)
  // 凸予定がなければ終了
  if (!id) return

  // 凸予定の完了を付ける
  await convexComplete(sheet, cells, id)

  // メッセージを削除
  msgUserDelete(cells, id)
  msgCalDelete(cells, id)

  // ボスのロールを外す
  msg.member?.roles.remove(Settings.BOSS_ROLE_ID[num])

  // 凸状況を更新
  list.SituationEdit()

  console.log('Delete completed message')
}

/**
 * 凸予定が完了していなければture、でなければfalse
 * @param cells 凸予定の一覧
 * @param msg DiscordからのMessage
 * @return 結果の真偽値
 */
const isConvexPlan = (cells: string[], msg: Discord.Message): boolean => {
  // 凸予定に削除したメッセージのidがあるか確認
  const list = PiecesEach(cells, 8)
    .map(c => c.slice(0, 3))
    .filter(c => c.some(v => v === msg.id))

  // なければfalse
  if (list.length === 0) return false
  // 凸予定が完了してたらfalse
  if (list[0][0] === '1') return false
  // 凸予定があって完了してなければtrue
  return true
}

/**
 * 報告者のメッセージを削除する
 * @param cells 凸予定の一覧
 * @param id 送信者のメッセージid
 */
const msgUserDelete = async (cells: string[], id: string) => {
  const msgid = PiecesEach(cells, 8).filter(v => v[1] === id)[0][1]
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)

  // メッセージを削除する
  ;(await channel.messages.fetch(msgid)).delete()
}

/**
 * キャルのメッセージを削除する
 * @param cells 凸予定の一覧
 * @param id 送信者のメッセージid
 */
const msgCalDelete = async (cells: string[], id: string) => {
  const msgid = PiecesEach(cells, 8).filter(v => v[1] === id)[0][2]
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)

  // メッセージを削除する
  ;(await channel.messages.fetch(msgid)).delete()
}

/**
 * 凸予定の完了をする
 * @param sheet 凸予定のシート
 * @param cells 凸予定の一覧
 * @param id 送信者のメッセージid
 */
const convexComplete = async (sheet: any, cells: string[], id: string) => {
  // 行を取得
  const row =
    PiecesEach(cells, 8)
      .map(v => v[1])
      .indexOf(id) + 3

  // 値の更新
  const cell = await sheet.getCell(`A${row}`)
  cell.setValue('1')
}

/**
 * 削除されたメッセージのボスのロールを外す
 * @param cells 凸予定の一覧
 * @param msg DiscordからのMessage
 */
const deleteBossRole = (cells: string[], msg: Discord.Message) => {
  // メッセージのボス番号を取得
  const num = PiecesEach(cells, 8).filter(v => v[1] === msg.id)[0][5]

  // ボス番号のロールを付与
  msg.member?.roles.remove(Settings.BOSS_ROLE_ID[num])
}

/**
 * 凸報告のメッセージからボス番号を取得。
 * ボス名の完全一致またはkillを除いた先頭文字がボス番号(1-5|a-e)の場合ボス番号を返す
 * @param content 凸報告のメッセージ
 * @return ボス番号
 */
const checkBossNumber = async (content: string): Promise<Option<string>> => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.BOSS_CELLS)

  // ボス名に一致するか確認
  const name = PiecesEach(cells, 2)
    .filter(v => !/^,+$/.test(v.toString()))
    .filter(v => ~content.indexOf(v[1]))

  // 一致していればボス番号を返す
  if (name.length) return name[0][0]

  // /^k|kill/を取り除いた先頭文字
  const num = content.replace(/kill/i, '').replace(/^k/i, '').trim()[0]

  // 先頭文字がボス番号(1-5)なら(a-e)に変換して返す
  if (/[1-5]/.test(num)) return NtoA(num)
  // 先頭文字がボス番号(a-e)ならそのまま返す
  if (/[a-e]/i.test(num)) return num
  // 一致しなければundefinedを返す
  return
}

/**
 * ボス番号から凸予定のメッセージidを取得
 * @param cells 凸予定の一覧
 * @param id 凸報告者のid
 * @param num ボス番号
 * @return 取得したid
 */
const readPlanMessageId = (cells: string[], id: string, num: string): Option<string> => {
  // 報告者の凸予定一覧を取得
  const plans = PiecesEach(cells, 8)
    .filter(c => c[4] === id)
    .filter(c => !c[0])

  // 凸予定から先頭のボス番号のインデックスを取得
  const index = plans.findIndex(v => v[5] === num)
  // 凸予定が無ければ終了
  if (index === -1) return

  // メッセージidを返す
  return plans[index][1]
}
