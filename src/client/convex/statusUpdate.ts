import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import {GetDateColumn} from './report'

/**
 * 凸報告に入力された情報から凸状況の更新をする
 * @param msg DiscordからのMessage
 */
export const StatusUpdate = async (msg: Discord.Message) => {
  // データの更新を実行
  const before = await cellUpdate(msg.content, msg)

  // リアクションの処理を実行
  reaction(before, msg)

  // 3凸終了者の処理を実行
  if (msg.content === '3') threeConvexEnd(msg)
}

/**
 * 指定された右隣の列名を取得
 * @param n 何個目かの数字
 */
const nextRow = async (n: number): Promise<string> =>
  String.fromCharCode(((await GetDateColumn()) || '').charCodeAt(0) + n)

/**
 * セルの更新を行う
 * @param val 更新する内容
 * @param msg DiscordからのMessage
 */
const cellUpdate = async (val: string, msg: Discord.Message): Promise<string> => {
  /**
   * 入力された値をスプレッドシート用に形式を修正する
   * @param v 凸報告に入力された値
   * @return 修正された値
   */
  const formatCorrect = (v: string): string => {
    const a: any[] = v.split(' ')
    // 持ち越しがない場合は終了
    if (!a[1]) return v
    // 60以上の値をmm:ssの形式に変更する
    const t = 1 <= a[1] / 60 ? `1:${(a[1] - 60 + '').padStart(2, '0')}` : a[1]
    return `${a[0]},${t}`
  }

  // スプレッドシートから情報を取得
  const manageSheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // 変更するセルの場所
  const cells: string[] = await spreadsheet.GetCells(manageSheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const col = await GetDateColumn()
  const num = cells.indexOf(util.GetUserName(msg.member)) + 3

  // 値の更新を行う
  const cell = await manageSheet.getCell(`${col}${num}`)

  const before = await cell.getValue()
  await cell.setValue(formatCorrect(val))

  return before.replace(',', ' ')
}

/**
 * 凸報告にリアクションをつける。
 * 取り消しの処理も行う
 * @param before 取り消す前の値
 * @param msg DiscordからのMessage
 */
const reaction = (before: string, msg: Discord.Message) => {
  // 確認と❌のスタンプをつける
  msg.react(Settings.EMOJI_ID.KAKUNIN)
  msg.react('❌')

  // ❌スタンプを押した際にデータの取り消しを行う
  msg.awaitReactions((react, user) => {
    ;(async () => {
      // 送信者が❌スタンプ押した場合以外は終了
      if (user.id !== msg.author.id || react.emoji.name !== '❌') return

      // データの更新を行う
      const after = await cellUpdate(before, msg)
      msg.reply(`\`${after}\` を取り消したわ`)
      console.log('Convex cancel')
    })()
    return true
  })
}

/**
 * 3凸終了した際に凸残ロールを削除し何人目の3凸終了者か報告をする
 * @param msg DiscordからのMessage
 */
const threeConvexEnd = async (msg: Discord.Message) => {
  // スプレッドシートから情報を取得
  const manageSheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // 変更するセルの場所
  const cells: string[] = await spreadsheet.GetCells(manageSheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const col = await nextRow(2)
  const num = cells.indexOf(util.GetUserName(msg.member)) + 3

  // 凸終了の目印をつける
  const cell = await manageSheet.getCell(`${col}${num}`)
  await cell.setValue(1)

  // 凸残ロールを削除する
  msg.member?.roles.remove(Settings.ROLE_ID.REMAIN_CONVEX)

  // 何番目の終了者なのかを報告
  const n = (await manageSheet.getCell(`${col}1`)).getValue()
  msg.reply(`${n}人目の3凸終了者よ！`)
}
