import * as Discord from 'discord.js'
import Settings from 'const-settings'
import PiecesEach from 'pieces-each'
import * as spreadsheet from '../../util/spreadsheet'

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

  // チャンネルの作成し初回メッセージを送信
  ;(await channelNameList()).forEach(async name => {
    const c = await msg.guild?.channels.create(name, {type: 'text', parent: channel?.id})
    c?.send(name)
  })

  msg.reply(`${year}年${day}月のカテゴリーを作成したわよ！`)
}

/**
 * クラバト用カテゴリーの権限を設定
 * @param msg
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
  const tomodachi = msg.guild?.roles.cache.get(Settings.ROLE_ID.TOMODACHI)
  if (!tomodachi) return []
  const everyone = msg.guild?.roles.everyone
  if (!everyone) return []

  // カテゴリーの権限を設定
  return [
    {
      id: leader.id,
      allow: ['MENTION_EVERYONE'],
    },
    {
      id: subLeader.id,
      allow: ['MANAGE_MESSAGES'],
    },
    {
      id: clanMembers.id,
      allow: ['VIEW_CHANNEL'],
    },
    {
      id: tomodachi.id,
      allow: ['VIEW_CHANNEL'],
    },
    {
      id: everyone.id,
      deny: ['VIEW_CHANNEL', 'MENTION_EVERYONE'],
    },
  ]
}

/**
 * 作成するチャンネル名のリストを返す。
 * ボスの名前はスプレッドシートから取得する
 * @return チャンネル名のリスト
 */
const channelNameList = async (): Promise<string[]> => {
  // 情報のシートを取得
  const infoSheet = await spreadsheet.GetWorksheet(Settings.INFORMATION_SHEET.SHEET_NAME)
  const cells: string[] = await spreadsheet.GetCells(infoSheet, Settings.INFORMATION_SHEET.BOSS_CELLS)

  // ボスの名前を取得
  const [a = 'a', b = 'b', c = 'c', d = 'd', e = 'e'] = PiecesEach(cells, 2).map(v => v[1])

  // prettier-ignore
  return [
    '検証総合', '凸ルート案', '編成質問・相談',
    `${a}編成`, `${b}編成`,
    `${c}編成`, `${d}編成`,
    `${e}編成`, '持ち越し編成',
  ]
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
