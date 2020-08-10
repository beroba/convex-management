import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import {GetDateColumn} from './report'
import * as lapAndBoss from './lapAndBoss'

/**
 * 凸報告に入力された情報から凸状況の更新をする
 * @param client bot(キャル)のclient
 * @param msg DiscordからのMessage
 */
export const StatusUpdate = async (client: Discord.Client, msg: Discord.Message) => {
  // データの更新を実行
  const before = await cellUpdate(msg.content, msg)

  // リアクションの処理を実行
  reaction(before, msg)

  // 3凸終了者の処理を実行
  if (msg.content === '3') await threeConvexEnd(msg)

  // 現在の周回数とボスを凸報告に送信
  const channel = client.channels.cache.get(Settings.CONVEX_CHANNEL.REPORT_ID) as Discord.TextChannel
  channel?.send(await lapAndBoss.CurrentMessage())
}

/**
 * 指定された右隣の列名を取得
 * @param n 何個目かの数字
 */
const nextCol = async (n: number): Promise<string> =>
  String.fromCharCode(((await GetDateColumn()) || '').charCodeAt(0) + n)

/**
 * セルの更新を行う
 * @param val 更新する内容
 * @param msg DiscordからのMessage
 */
const cellUpdate = async (content: string, msg: Discord.Message): Promise<string> => {
  const val = content.replace('　', ' ').split(' ')

  // スプレッドシートから情報を取得
  const manageSheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // 変更するセルの場所
  const cells: string[] = await spreadsheet.GetCells(manageSheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const col = await GetDateColumn()
  const num = cells.indexOf(util.GetUserName(msg.member)) + 3

  // 凸数の更新を行う
  const convex_cell = await manageSheet.getCell(`${col}${num}`)
  const before: string = await convex_cell.getValue()
  await convex_cell.setValue(val[0])

  // 持ち越しがない場合は終了
  if (val.length === 1) return before

  // 持ち越しがある場合の処理
  const over_cell = await manageSheet.getCell(`${await nextCol(1)}${num}`)

  const over = await over_cell.getValue()
  if (over) {
    // 前回持ち越しがあった場合
    await over_cell.setValue()
    return `${before} 1`
  } else {
    // なかった場合
    await over_cell.setValue(1)
    return before
  }
}

/**
 * 凸報告にリアクションをつける。
 * 取り消しの処理も行う
 * @param before 取り消す前の値
 * @param msg DiscordからのMessage
 */
const reaction = (before: string, msg: Discord.Message) => {
  // 凸報告に❌のスタンプをつける
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
  const col = await nextCol(2)
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
