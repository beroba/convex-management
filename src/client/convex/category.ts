import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as bossTable from '../../io/bossTable'

/**
 * クラバト用のカテゴリーとチャンネルを作成する
 * 引数がある場合は引数の年と日で作成し、ない場合は現在の年と日で作成する
 * @param year 作成する年
 * @param month 作成する月
 * @param msg DiscordからのMessage
 */
export const Create = async (year: number, month: number, msg: Discord.Message) => {
  // カテゴリーの作成
  const category = await msg.guild?.channels.create(`${year}年${month}月クラバト`, {
    type: 'category',
    position: Settings.CATEGORY.POSITION,
    permissionOverwrites: settingPermissions(msg),
  })

  // 作成するチャンネルの名前一覧を作成
  const names = await createChannelName(month)

  // チャンネルの作成し初回メッセージを送信
  await Promise.all(
    names.map(async name => {
      const c = await msg.guild?.channels.create(name, {type: 'text', parent: category?.id})
      c?.send(name)
    })
  )

  msg.reply(`${year}年${month}月のカテゴリーを作成したわよ！`)
}

/**
 * 不要になったクラバト用のカテゴリーとチャンネルを削除する
 * @param year 作成する年
 * @param month 作成する月
 * @param msg DiscordからのMessage
 */
export const Delete = async (year: number, month: number, msg: Discord.Message) => {
  // カテゴリーが見つからなかった場合終了
  const category = msg.guild?.channels.cache.find(c => c.name === `${year}年${month}月クラバト`)
  if (!category) return msg.reply(`${year}年${month}月クラバトなんてないんだけど！`)

  const channels = category.guild.channels.cache.filter(c => c.parentID === category.id)

  // カテゴリとチャンネルを削除
  await category?.delete()
  // 表示バグが発生してしまうので削除する際に時間の猶予を持たせている
  channels?.forEach(c => setTimeout(() => c.delete(), 1000))

  msg.reply(`${year}年${month}月のカテゴリーを削除したわ`)
}

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
 * 作成するチャンネル名のリストを返す
 * @param month 現在の月
 * @return チャンネル名のリスト
 */
const createChannelName = async (month: number): Promise<string[]> => {
  // キャルステータスからボステーブルを取得
  const table = await bossTable.Fetch()

  // ボスの名前を取得
  const [a, b, c, d, e] = table.map(t => t.name)

  return [
    `${month}月-凸ルート案`,
    `${month}月-検証総合`,
    `123-${a}`,
    `123-${b}`,
    `123-${c}`,
    `123-${d}`,
    `123-${e}`,
    `45-${a}`,
    `45-${b}`,
    `45-${c}`,
    `45-${d}`,
    `45-${e}`,
    `${month}月-持越編成`,
  ]
}
