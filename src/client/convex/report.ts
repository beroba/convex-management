import * as Discord from 'discord.js'
import Settings from 'const-settings'
import Option from 'type-of-option'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import {StatusUpdate} from './statusUpdate'

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
      StatusUpdate(msg)
      return 'Update status'
    }

    default: {
      msg.reply('形式が違うわ、やりなおし！')
      return 'Different format'
    }
  }
}

/**
 * 今日のクラバトで使う日付の列名を返す
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
    .PiecesEach(cells, 3)
    .map(v => [v[1].split('/').map(Number).join('/'), v[2]])
    .filter(v => v[0] === mmdd())[0]

  return cell ? cell[1] : null
}
