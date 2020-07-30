import * as Discord from 'discord.js'
import Settings from 'const-settings'
import Option from 'type-of-option'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'

/**
 * 凸報告の管理を行う
 * @param msg DiscordからのMessage
 * @return 凸報告の実行結果
 */
export const ConvexReport = async (msg: Discord.Message): Promise<Option<string>> => {
  // キャルのメッセージはコマンド実行しない
  if (msg.member?.user.username === 'キャル') return

  // 凸報告チャンネルでなければ終了
  if (msg.channel.id !== Settings.CONVEX_CHANNEL.REPORT_ID) return

  // クラバトの日じゃない場合は終了
  const day = await GetDateColumn()
  if (!day) {
    msg.reply('今日はクラバトの日じゃないわ')
    return "It's not ClanBattle days"
  }

  switch (true) {
    case /1|2|3/.test(msg.content.charAt(0)): {
      updateStatus(msg)
      return 'Update status'
    }

    default: {
      msg.reply('形式が違うわ、やりなおし！')
      return 'Different format'
    }
  }
}

/**
 * 凸管理で対応している日付の列名を返す
 * @return 対応している日付の列
 */
export const GetDateColumn = async (): Promise<Option<string>> => {
  /**
   * 現在の日付を`MM/DD`の形式で返す
   * @return 現在の日付
   */
  const mmdd = (): string => (d => `${d.getMonth() + 1}/${d.getDate()}`)(new Date())

  // スプレッドシートから情報を取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.DATE_CELLS)

  // クラバトの日かどうか確認
  const cell = util
    .PiecesEach(cells, 2)
    .map(v => [v[0].split('/').map(Number).join('/'), v[1]])
    .filter(v => v[0] === mmdd())[0]

  return cell ? cell[1] : null
}

/**
 * 凸状況の更新を行う
 * @param msg DiscordからのMessage
 */
const updateStatus = async (msg: Discord.Message) => {
  // データの更新を行う
  const before = await cellUpdate(msg.content, msg)

  // リアクションの処理を行う
  reaction(before, msg)

  // 3凸終了者の処理を行う
  if (msg.content === '3') threeConvexEnd(msg)
}

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
  const num = cells.indexOf(util.GetUserName(msg.member)) + 2

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
 * 3凸終了した際に報告をする
 * @param msg DiscordからのMessage
 */
const threeConvexEnd = async (msg: Discord.Message) => {
  // スプレッドシートから情報を取得
  const manageSheet = await spreadsheet.GetWorksheet(Settings.MANAGEMENT_SHEET.SHEET_NAME)

  // 変更するセルの場所
  const cells: string[] = await spreadsheet.GetCells(manageSheet, Settings.MANAGEMENT_SHEET.MEMBER_CELLS)
  const col = String.fromCharCode(((await GetDateColumn()) || '').charCodeAt(0) + 1)
  const num = cells.indexOf(util.GetUserName(msg.member)) + 2

  // 凸終了の目印をつける
  const cell = await manageSheet.getCell(`${col}${num}`)
  await cell.setValue(1)

  // 凸残ロールを削除する
  const remainConvex = msg.guild?.roles.cache.get(Settings.ROLE_ID.REMAIN_CONVEX)
  if (!remainConvex) return

  msg.member?.roles.remove(remainConvex)

  // 何番目の終了者なのかを報告
  const n = (await manageSheet.getCell(`${col}1`)).getValue()
  msg.reply(`${n}人目の3凸終了者よ！`)
}
