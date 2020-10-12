import * as Discord from 'discord.js'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import {NtoA, AtoA} from 'alphabet-to-number'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'

/**
 * 凸予定の形式
 */
type Plan = {
  person: string
  cal: string
  member: string
  id: string
  num: string
  boss: string
  message: string
}

/**
 * 凸予定を更新する
 * @param msg DiscordからのMessage
 */
export const Update = async (msg: Discord.Message) => {
  // 凸予定のオブジェクトを作成
  const res = planObject(msg)

  // ボス番号からボス名を取得
  res.boss = await GetBossName(res.num)

  // 予定したボスを報告し、報告したキャルのメッセージIDを取得
  res.cal = (await msg.reply(`${res.boss}を予定したわよ！`)).id

  // 凸予定シートの値を更新
  await fetchPlan(res)

  // 完了の絵文字をつける
  msg.react(Settings.EMOJI_ID.KANRYOU)

  // ボス番号のロールを付与
  msg.member?.roles.add(Settings.BOSS_ROLE_ID[res.num])
}

/**
 * 凸予定のオブジェクトを作成する
 * @param msg DiscordからのMessage
 * @return 凸予定のオブジェクト
 */
const planObject = (msg: Discord.Message): Plan => {
  // prettier-ignore
  const content = util.Format(msg.content)

  return {
    person: msg.id,
    cal: '',
    member: util.GetUserName(msg.member),
    id: msg.member?.id || '',
    num: NtoA(content[0]),
    boss: '',
    message: content.slice(1).trim(),
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

  // ボス名を返す
  return PiecesEach(cells, 2).filter(v => v[0] === num.toLowerCase())[0][1]
}

/**
 * 凸予定シートの中身を更新する
 * @param res 凸予定のオブジェクト
 */
const fetchPlan = async (res: Plan) => {
  // 凸予定のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.PLAN_SHEET.SHEET_NAME)
  const cells: string[] = (await spreadsheet.GetCells(sheet, Settings.PLAN_SHEET.PERSON_CELLS)).filter(v => v)

  // スプレッドシートを更新
  await Promise.all(
    Object.values(res).map(async (v, i) => {
      // 順番にセルを取得
      const cell = await sheet.getCell(`${AtoA('B', i)}${cells.length + 3}`)
      cell.setValue(v)
    })
  )
}
