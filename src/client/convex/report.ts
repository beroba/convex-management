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
  if (!(await isClanBattleDays())) {
    msg.reply('今日はクラバトの日じゃないわ')
    return "It's not ClanBattle days"
  }

  switch (true) {
    case /1|2|3/.test(msg.content.charAt(0)):
      updateStatus(msg)
      return 'Update status'
    default:
      msg.reply('形式が違うわ、やりなおし！')
      return 'Different format'
  }
}

/**
 * クラバトの日かどうかを確認する。
 * クラバトの日だった場合、凸管理で対応している日付の列名を返す
 * @return 対応している日付の列
 */
const isClanBattleDays = async (): Promise<Option<string>> => {
  /**
   * 現在の日付を`MM/DD`の形式で返す
   * @return 現在の日付
   */
  const mmdd = (): string => (d => `${d.getMonth() + 1}/${d.getDate()}`)(new Date())

  // 情報のワークシートを取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.CONVEX_SHEET.INFORMATION)

  // 日付のセルを取得
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_CELLS.DATE)

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
  // リアクションの処理を行う
  reaction(msg)

  // 3凸終了者の処理
  if (msg.content === '3') {
    msg.reply('n人目の3凸終了者よ！')
  }
}

/**
 * 凸報告にリアクションをつける。
 * 取り消しの処理も行う
 * @param msg DiscordからのMessage
 */
const reaction = (msg: Discord.Message) => {
  // 確認と❌のスタンプをつける
  msg.react(Settings.EMOJI_ID.KAKUNIN)
  msg.react('❌')

  // ❌スタンプを押した際にデータの取り消しを行う
  msg.awaitReactions((react, user) => {
    if (user.id !== msg.author.id || react.emoji.name !== '❌') return false
    msg.reply('取り消したわ')
    console.log('Convex cancel')
    return true
  })
}
