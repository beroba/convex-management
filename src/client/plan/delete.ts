import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
// import PiecesEach from 'pieces-each'
// import {NtoA} from 'alphabet-to-number'
// import * as bossTable from '../../io/bossTable'
import * as schedule from '../../io/schedule'
import {Plan} from '../../io/type'
import * as util from '../../util'
// import * as spreadsheet from '../../util/spreadsheet'
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

  // 凸予定のメッセージを削除する
  react.message.delete()

  return 'Already completed message'
}

/**
 * 凸予定のメッセージを削除した際に完了処理を実行
 * @param msg DiscordからのMessage
 * @return 削除処理の実行結果
 */
export const Delete = async (msg: Discord.Message): Promise<Option<string>> => {
  // #凸予定でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_RESERVATE) return

  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // 凸予定を削除
  await planDelete(msg)

  // 凸状況を更新
  await list.SituationEdit()

  return 'Delete completed message'
}

/**
 * 凸報告のメッセージにボス名またはボス番号があった場合、先頭の凸報告を削除する
 * @param msg DiscordからのMessage
 */
export const Report = async (msg: Discord.Message) => {
  msg
  // // ボス番号を取得
  // const content = util.Format(msg.content)
  // const num = await checkBossNumber(content)

  // // 凸予定のシートを取得
  // const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)
  // const cells: string[] = await spreadsheet.GetCells(sheet, Settings.PLAN_SHEET.PLAN_CELLS)

  // // ボス番号から凸予定のメッセージidを取得
  // const id = readPlanMessageID(cells, msg.author.id, num)
  // // 凸予定がなければ終了
  // if (!id) return

  // // 凸予定の完了を付ける
  // await convexComplete(sheet, cells, id)

  // // メッセージを削除
  // msgDelete(PiecesEach(cells, 9).filter(v => v[1] === id)[0][1])
  // msgDelete(PiecesEach(cells, 9).filter(v => v[1] === id)[0][2])

  // // ボスのロールを外す
  // const plans = PiecesEach(cells, 9)
  //   .filter(c => c[4] === msg.author.id)
  //   .filter(v => v[5] === num)
  //   .filter(c => !c[0])

  // // 凸予定が残り1つ以下だったら実行
  // if (plans.length <= 1) {
  //   msg.member?.roles.remove(Settings.BOSS_ROLE_ID[num])
  // }

  // console.log('Delete completed message')
}

/**
 * 引数に渡されたユーザーidの凸予定を全て完了する
 * @param is ユーザーid
 */
export const AllComplete = async (id: string) => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)
  const list = (await channel.messages.fetch()).map(v => v).filter(m => m.author.id === id)

  // 10秒起きに削除を実行
  for (const m of list) {
    m.delete()
    await util.Sleep(10000)
  }

  console.log('Delete all convex schedules')
}

/**
 * 凸予定を削除する
 * @param msg DiscordからのMessage
 */
const planDelete = async (msg: Discord.Message) => {
  // 凸予定の完了を付ける
  const plan = await schedule.Delete(msg.id)
  if (!plan) return
  await util.Sleep(50)

  // メッセージを削除
  msgDelete(plan.calID)

  // ボスのロールを外す
  deleteBossRole(plan, msg)

  schedule.DeleteOnSheet(msg.id)
}

/**
 * 凸予定のメッセージを削除する
 * @param id 削除するメッセージid
 */
const msgDelete = async (id: string) => {
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_RESERVATE)

  // メッセージをキャッシュする
  const msg = await channel.messages
    .fetch(id)
    .then(m => m)
    .catch(_ => undefined)

  // メッセージが既にない場合は終了
  if (!msg) return

  // メッセージを削除する
  msg.delete()
}

/**
 * 削除されたメッセージのボスのロールを外す
 * @param plan 削除されたPlanの値
 * @param msg DiscordからのMessage
 */
const deleteBossRole = async (plan: Plan, msg: Discord.Message) => {
  // 削除したボスの凸予定一覧を取得
  const plans = await schedule.FetchBoss(plan.alpha)

  // 他に同じボスの凸予定がある場合は終了
  const find = plans.find(p => p.playerID === plan.playerID)
  if (find) return

  // ボス番号のロールを削除
  msg.member?.roles.remove(Settings.BOSS_ROLE_ID[plan.alpha])
}

/**
 * 凸報告のメッセージからボス番号を取得。
 * ボス名の完全一致またはkillを除いた先頭文字がボス番号(1-5|a-e)の場合ボス番号を返す
 * @param content 凸報告のメッセージ
 * @return ボス番号
 */
// const checkBossNumber = async (content: string): Promise<string> => {
//   // 情報のシートを取得
//   const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

//   // ボス名からボス番号を取得
//   const alpha = await bossTable.TakeAlpha(content)

//   // ボス番号が合った場合を返す
//   if (alpha) return alpha

//   // /^k|kill/を取り除いた先頭文字
//   const num = content.replace(/kill/i, '').replace(/^k/i, '').trim()[0]

//   // 先頭文字がボス番号(1-5)なら(a-e)に変換して返す
//   if (/[1-5]/.test(num)) return NtoA(num)
//   // 先頭文字がボス番号(a-e)ならそのまま返す
//   if (/[a-e]/i.test(num)) return num

//   // 一致しなければ現在のボス番号を返す
//   const range = Settings.INFORMATION_SHEET.CURRENT_CELL.split(',')
//   return (await sheet.getCell(range[2])).getValue()
// }

/**
 * ボス番号から凸予定のメッセージidを取得
 * @param cells 凸予定の一覧
 * @param id 凸報告者のid
 * @param num ボス番号
 * @return 取得したid
 */
// const readPlanMessageID = (cells: string[], id: string, num: string): Option<string> => {
//   // 報告者の凸予定一覧を取得
//   const plans = PiecesEach(cells, 9)
//     .filter(c => c[4] === id)
//     .filter(c => !c[0])

//   // 凸予定から先頭のボス番号のインデックスを取得
//   const index = plans.findIndex(v => v[5] === num)
//   // 凸予定が無ければ終了
//   if (index === -1) return

//   // メッセージidを返す
//   return plans[index][1]
// }
