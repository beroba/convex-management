import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'

// 凸予約の形式
type Reservate = {
  person: string
  cal: string
  member: string
  num: string
  boss: string
  damage: string
  remarks: string
}

/**
 * 凸予約を更新する
 * @param msg DiscordからのMessage
 */
export const Update = async (msg: Discord.Message) => {
  // 凸予約のオブジェクトを作成
  const res = reservateObject(msg)

  // ボス番号からボス名を取得
  res.boss = await GetBossName(res.num)

  // 予約したボスを報告し、報告したキャルのメッセージIDを取得
  res.cal = (await msg.reply(`${res.boss}を予約したわよ！`)).id

  // 凸予約シートの値を更新
  await setReservate(res)

  // 完了の絵文字をつける
  msg.react(Settings.EMOJI_ID.KANRYOU)

  // ボス番号のロールを付与
  msg.member?.roles.add(Settings.BOSS_ROLE_ID[Number(res.num) - 1])
}

/**
 * 凸予約のオブジェクトを作成する
 * @param msg DiscordからのMessage
 * @return 凸予約のオブジェクト
 */
const reservateObject = (msg: Discord.Message): Reservate => {
  const arr = msg.content.replace(/　/g, ' ').split(' ')
  const member = util.GetUserName(msg.member)
  return {
    person: msg.id,
    cal: '',
    member: member,
    num: arr[0],
    boss: '',
    damage: arr[1],
    remarks: arr[2],
  }
}

/**
 * ボス番号からボス名を取得
 * @param num ボス番号
 * @return ボス名
 */
const GetBossName = async (num: string): Promise<string> => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.BOSS_CELLS)

  // ボス番号を数字から英語に変換
  const n = String.fromCharCode('A'.charCodeAt(0) + Number(num) - 1)

  // ボス名を返す
  return util.PiecesEach(cells, 2).filter(v => v[0] === n.toLowerCase())[0][1]
}

/**
 * 凸予約シートの中身を更新する
 * @param res 凸予約のオブジェクト
 */
const setReservate = async (res: Reservate) => {
  // 凸予約のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.RESERVATE_SHEET.SHEET_NAME)
  const cells: string[] = (await spreadsheet.GetCells(sheet, Settings.RESERVATE_SHEET.PERSON_CELLS)).filter(v => v)

  // スプレッドシートを更新
  Object.values(res).forEach(async (v, i) => {
    // 順番に列を取得
    const col = String.fromCharCode('A'.charCodeAt(0) + 1 + i)
    const cell = await sheet.getCell(`${col}${cells.length + 3}`)
    cell.setValue(v)
  })
}
