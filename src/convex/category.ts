import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../util'
import {BossTable} from '../util/type'

/**
 * 編成カテゴリーとチャンネルを作成する
 * @param year 編成カテゴリーの年
 * @param month 編成カテゴリーの月
 * @param guild クランサーバーのguildを情報
 */
export const Create = async (year: number, month: number, guild: Discord.Guild) => {
  const title = createTitle(year, month)

  // カテゴリーの作成
  const permit = settingPermit(guild)
  const organization = await guild.channels.create(title, {
    type: 'GUILD_CATEGORY',
    permissionOverwrites: permit,
  })

  // チャンネルの作成
  const names = createChannelName(month)
  for (const name of names) {
    await guild.channels.create(name, {
      type: 'GUILD_TEXT',
      parent: organization.id,
    })
  }

  console.log('Creating organization category')
  // const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  // await channel.send(`${title}のカテゴリーを作成したわよ！`)
}

/**
 * クランバトル用にカテゴリーを並び替える
 * @param year 編成カテゴリーの年
 * @param month 編成カテゴリーの月
 * @param guild クランサーバーのguildを情報
 */
export const SetClanBattle = async (year: number, month: number, guild: Discord.Guild) => {
  // カテゴリーの取得
  const [cb_putting, cb_sub, cb_beroba, cb_beronya, cb_inspection] = fetchCBCategory()
  const organization = fetchOrganizationCategory(year, month, guild)
  if (!organization) return

  // カテゴリーの並び替え
  let position = util.GetCategoryChannel(Settings.CATEGORY_ID.SUB_CH).rawPosition
  const categorys = [cb_putting, cb_sub, cb_beroba, organization, cb_inspection, cb_beronya]
  for (let c of categorys) {
    c = await c.setPosition(position + 1)
    position = c.rawPosition
  }

  console.log('Set category for Clan battle')
}

/**
 * 平常時用にカテゴリーを並び替える
 * @param year 編成カテゴリーの年
 * @param month 編成カテゴリーの月
 * @param guild クランサーバーのguildを情報
 */
export const SetDefault = async (year: number, month: number, guild: Discord.Guild) => {
  // カテゴリーの取得
  const [cb_putting, cb_sub, cb_beroba, cb_beronya, cb_inspection] = fetchCBCategory()
  const organization = fetchOrganizationCategory(year, month, guild)
  if (!organization) return

  // カテゴリーの並び替え
  // 1回だと何故か上手く整理されないので3回行う
  for (const _ of util.Range(3)) {
    let position = util.GetCategoryChannel(Settings.CATEGORY_ID.CAl_BOT).rawPosition
    const categorys = [cb_putting, cb_sub, cb_beroba, cb_beronya, cb_inspection, organization]
    for (let c of categorys) {
      c = await c.setPosition(position + 1)
      position = c.rawPosition
    }
  }

  console.log('Set category for Default')
}

/**
 * 編成カテゴリーのチャンネル名を設定する
 * @param year 編成カテゴリーの年
 * @param month 編成カテゴリーの月
 * @param guild クランサーバーのguildを情報
 */
export const Rename = async (year: number, month: number, guild: Discord.Guild, table: BossTable[]) => {
  const organization = fetchOrganizationCategory(year, month, guild)
  if (!organization) return

  const channels = organization.guild.channels.cache.map(c => c).filter(c => c.parentId === organization.id)
  for (const c of channels) {
    const alpha = c.name.split('-').last()
    if (!/[a-e]/.test(alpha)) continue

    const boss = table.find(t => t.alpha === alpha)
    if (!boss) return

    await c.setName(`${c.name.split('-').first()}-${boss.name}`)
  }

  console.log('Set the boss name of the channel')
}

/**
 * 不要になった編成カテゴリーとチャンネルを削除する
 * @param year 編成カテゴリーの年
 * @param month 編成カテゴリーの月
 * @param guild クランサーバーのguildを情報
 * @return 値がなかった場合のエラー
 */
export const Delete = async (year: number, month: number, guild: Discord.Guild): Promise<Option<Error>> => {
  const organization = fetchOrganizationCategory(year, month, guild)
  if (!organization) return Error()

  const channels = organization.guild.channels.cache.map(c => c).filter(c => c.parentId === organization.id)
  for (const c of channels) {
    await c.delete()
  }
  await organization.delete()
}

/**
 * 編成カテゴリーのタイトルを作成
 * @param year 編成カテゴリーの年
 * @param month 編成カテゴリーの月
 * @return タイトルの文字列
 */
const createTitle = (year: number, month: number): string => {
  return `${year}年${month}月クラバト`
}

// prettier-ignore
/**
 * クラバト用カテゴリーの権限を設定
 * @param msg DiscordからのMessage
 * @return 設定した権限
 */
const settingPermit = (guild: Discord.Guild): Discord.OverwriteResolvable[] => {
  // 各ロールがあるか確認
  const leader        = guild.roles.cache.get(Settings.ROLE_ID.LEADER)?.id         ?? ''
  const subLeader     = guild.roles.cache.get(Settings.ROLE_ID.SUB_LEADER)?.id     ?? ''
  const progress      = guild.roles.cache.get(Settings.ROLE_ID.PROGRESS)?.id       ?? ''
  const clanMembers   = guild.roles.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)?.id   ?? ''
  const sisterMembers = guild.roles.cache.get(Settings.ROLE_ID.SISTER_MEMBERS)?.id ?? ''
  const tomodachi     = guild.roles.cache.get(Settings.ROLE_ID.TOMODACHI)?.id      ?? ''
  const everyone      = guild.roles.everyone.id ?? ''

  // カテゴリーの権限を設定
  return [
    {id: leader,        allow: ['MENTION_EVERYONE']                },
    {id: subLeader,     allow: ['MANAGE_MESSAGES']                 },
    {id: progress,      allow: ['MANAGE_MESSAGES']                 },
    {id: clanMembers,   allow: ['VIEW_CHANNEL']                    },
    {id: sisterMembers, allow: ['VIEW_CHANNEL']                    },
    {id: tomodachi,     allow: ['VIEW_CHANNEL']                    },
    {id: everyone,      deny:  ['VIEW_CHANNEL', 'MENTION_EVERYONE']},
  ]
}

/**
 * 作成するチャンネル名のリストを返す
 * @param month 現在の月
 * @return チャンネル名のリスト
 */
const createChannelName = (month: number): string[] => {
  const m = `${month}月`
  // prettier-ignore
  return [
    `${m}-採用凸ルート`, `${m}-採用編成`, `${m}-凸ルート案`,
    '45-a', '45-b', '45-c', '45-d', '45-e',
    '3-a',  '3-b',  '3-c',  '3-d',  '3-e',
    '12-a', '12-b', '12-c', '12-d', '12-e',
    `${m}-持越編成`,
  ]
}

/**
 * クラバト関連のカテゴリーを取得する
 * @return カテゴリーのリスト
 */
const fetchCBCategory = (): Discord.CategoryChannel[] => {
  return [
    util.GetCategoryChannel(Settings.CATEGORY_ID.CB_PUTTING),
    util.GetCategoryChannel(Settings.CATEGORY_ID.CB_SUB),
    util.GetCategoryChannel(Settings.CATEGORY_ID.CB_BEROBA),
    util.GetCategoryChannel(Settings.CATEGORY_ID.CB_BERONYA),
    util.GetCategoryChannel(Settings.CATEGORY_ID.CB_INSPECTION),
  ]
}

/**
 * 編成カテゴリーを取得する
 * @param year 作成する年
 * @param month 作成する月
 * @param guild クランサーバーのguildを情報
 * @return 値がなかった場合のエラー
 */
const fetchOrganizationCategory = (
  year: number,
  month: number,
  guild: Discord.Guild
): Option<Discord.CategoryChannel> => {
  return guild.channels.cache
    .map(c => c as Discord.CategoryChannel)
    .find(c => new RegExp(createTitle(year, month), 'ig').test(c.name))
}
