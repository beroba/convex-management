import * as Discord from 'discord.js'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as util from '../../util'
import * as spreadsheet from '../../util/spreadsheet'
import * as bossTable from '../../io/bossTable'

/**
 * チャンネル情報
 */
type ChannelInfo = {
  name: string
  row: number
  id: string
}

/**
 * クラバト用のカテゴリーとチャンネルを作成する
 * 引数がある場合は引数の年と日で作成し、ない場合は現在の年と日で作成する
 * @param arg 作成する年と月
 * @param msg DiscordからのMessage
 */
export const Create = async (arg: string, msg: Discord.Message) => {
  // 引数がある場合は引数の年と日を代入し、ない場合は現在の年と日を代入
  const [year, day] = arg ? arg.split('/').map(Number) : (d => [d.getFullYear(), d.getMonth() + 1])(new Date())

  // カテゴリーの作成
  const channel = await msg.guild?.channels.create(`${year}年${day}月クラバト`, {
    type: 'category',
    position: Settings.CATEGORY.POSITION,
    permissionOverwrites: settingPermissions(msg),
  })

  // 作成するチャンネルの名前一覧
  const names = await createChannelInfo()

  // チャンネルの作成し初回メッセージを送信
  const list = await Promise.all(
    names.map(async info => {
      const c = await msg.guild?.channels.create(info.name, {type: 'text', parent: channel?.id})
      c?.send(info.row ? separate(1) : info.name)
      return {name: info.name, row: info.row, id: c?.id} as ChannelInfo
    })
  )

  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)

  // チャンネルidを保存する
  fetchChannelID(list, sheet)

  // 段階数のフラグをリセットする
  resetStageFlag(sheet)

  msg.reply(`${year}年${day}月のカテゴリーを作成したわよ！`)
}

/**
 * 不要になったクラバト用のカテゴリーとチャンネルを削除する
 * @param arg 削除する年と月
 * @param msg DiscordからのMessage
 */
export const Delete = (arg: string, msg: Discord.Message) => {
  // 年と月がない場合終了
  const [year, day] = arg.split('/').map(Number)
  if (!year) return msg.reply('ちゃんと年と月を入力しなさい')

  // カテゴリーが見つからなかった場合終了
  const category = msg.guild?.channels.cache.find(c => c.name === `${year}年${day}月クラバト`)
  if (!category) return msg.reply(`${year}年${day}月クラバトなんてないんだけど！`)

  const channels = category.guild.channels.cache.filter(c => c.parentID === category.id)

  // カテゴリとチャンネルを削除
  category?.delete()
  // 表示バグが発生してしまうので削除する際に時間の猶予を持たせている
  channels?.forEach(c => setTimeout(() => c.delete(), 1000))

  msg.reply(`${year}年${day}月のカテゴリーを削除したわ`)
}

/**
 * 段階数の区切りとフラグを立てる
 * @param n 段階数
 */
export const CheckTheStage = async (n: number) => {
  // 情報のシートを取得
  const sheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const stage: string[][] = PiecesEach(await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.STAGE_CELLS), 2)
  const category: string[] = await spreadsheet.GetCells(sheet, Settings.INFORMATION_SHEET.CATEGORY_CELLS)

  // 既にフラグが立っている場合は終了
  if (stage[n - 1][1]) return

  PiecesEach(category, 2)
    .filter(util.Omit) // 空の値を省く
    .forEach(c => {
      // ボスのチャンネルに区切りを送信する
      const channel = util.GetTextChannel(c[1])
      channel.send(separate(n))
    })

  // 段階到達のフラグを立てる
  const col = Settings.INFORMATION_SHEET.STAGE_COLUMN
  const cell = await sheet.getCell(`${col}${n + 2}`)
  cell.setValue(1)
}

/**
 * 段階数の区切り
 * @param n 段階数
 * @return 区切りの文字列
 */
const separate = (n: number): string => `ーーーーーーーー${n}段階目ーーーーーーーー`

/**
 * クラバト用カテゴリーの権限を設定
 * @param msg DiscordからのMessage
 * @return 設定した権限
 */
const settingPermissions = (msg: Discord.Message): Discord.OverwriteResolvable[] => {
  // 各ロールがあるか確認
  const leader = msg.guild?.roles.cache.get(Settings.ROLE_ID.LEADER)
  if (!leader) return []
  const subLeader = msg.guild?.roles.cache.get(Settings.ROLE_ID.SUB_LEADER)
  if (!subLeader) return []
  const clanMembers = msg.guild?.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)
  if (!clanMembers) return []
  const sisterMembers = msg.guild?.roles.cache.get(Settings.ROLE_ID.SISTER_MEMBERS)
  if (!sisterMembers) return []
  const tomodachi = msg.guild?.roles.cache.get(Settings.ROLE_ID.TOMODACHI)
  if (!tomodachi) return []
  const everyone = msg.guild?.roles.everyone
  if (!everyone) return []

  // カテゴリーの権限を設定
  // prettier-ignore
  return [
    {id: leader.id,        allow: ['MENTION_EVERYONE']},
    {id: subLeader.id,     allow: ['MANAGE_MESSAGES']},
    {id: clanMembers.id,   allow: ['VIEW_CHANNEL']},
    {id: sisterMembers.id, allow: ['VIEW_CHANNEL']},
    {id: tomodachi.id,     allow: ['VIEW_CHANNEL']},
    {id: everyone.id,      deny:  ['VIEW_CHANNEL', 'MENTION_EVERYONE']},
  ]
}

/**
 * 作成するチャンネル名のリストを返す。
 * ボスの名前はスプレッドシートから取得する
 * @return チャンネル名のリスト
 */
const createChannelInfo = async (): Promise<ChannelInfo[]> => {
  // 現在の月を取得
  const month = `${new Date().getMonth() + 1}月`

  // キャルステータスからボステーブルを取得
  const table = await bossTable.Fetch()

  // ボスの名前を取得
  const [a, b, c, d, e] = table.map(t => t.name)

  // prettier-ignore
  return [
    {name: `${month}-凸ルート案`, row: 0,  id: ''},
    {name: `${month}-検証総合`,   row: 0,  id: ''},
    {name: `${a}`,                row: 3,  id: ''},
    {name: `${a}-オート`,         row: 4,  id: ''},
    {name: `${b}`,                row: 5,  id: ''},
    {name: `${b}-オート`,         row: 6,  id: ''},
    {name: `${c}`,                row: 7,  id: ''},
    {name: `${c}-オート`,         row: 8,  id: ''},
    {name: `${d}`,                row: 9,  id: ''},
    {name: `${d}-オート`,         row: 10, id: ''},
    {name: `${e}`,                row: 11, id: ''},
    {name: `${e}-オート`,         row: 12, id: ''},
    {name: '持ち越し編成',        row: 0,  id: ''},
  ]
}

/**
 * チャンネルidをスプレッドシートに保存する
 * @param list チャンネル情報の配列
 * @param sheet 情報のシート
 */
const fetchChannelID = async (list: ChannelInfo[], sheet: any) => {
  list.forEach(async c => {
    // 行と列を取得
    const col = Settings.INFORMATION_SHEET.CATEGORY_COLUMN
    const row = c.row

    // 行がない場合は終了
    if (!row) return

    // チャンネルidを保存
    const cell = await sheet.getCell(`${col}${row}`)
    cell.setValue(c.id)
  })
}

/**
 * 段階数のフラグをリセットする
 * @param sheet 情報のシート
 */
const resetStageFlag = async (sheet: any) => {
  const col = Settings.INFORMATION_SHEET.STAGE_COLUMN
  // フラグをリセットする
  ;[2, 3, 4, 5].forEach(async n => {
    const cell = await sheet.getCell(`${col}${n + 2}`)
    cell.setValue('')
  })
}
