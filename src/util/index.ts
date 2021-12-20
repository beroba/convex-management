import * as Discord from 'discord.js'
import moji from 'moji'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import Settings from 'const-settings'
import {Client} from '../index'

/**
 * 文字列を半角にし、連続したスペースを1つにする
 * @param str 文字列
 * @return 整形した文字列
 */
export const Format = (str: string): string => {
  return moji(str) // moji型に変換
    .convert('ZE', 'HE') // 全角英数を半角英数に変換
    .convert('ZS', 'HS') // 全角スペースを半角スペースに変換
    .toString() // 文字列に変換
    .replace(/[^\S\n\r]+/g, ' ') // 連続したスペースを1つにする
}

/**
 * 特定の秒数遅延させる
 * @param ms 遅延させる秒数
 */
export const Sleep = (ms: number): Promise<unknown> => {
  return new Promise(res => setTimeout(res, ms))
}

/**
 * 指定された範囲の数字配列を作る
 * @param start 開始位置
 * @param stop 終了位置
 * @param step 刻む数
 * @returns 数字配列
 */
export const Range = (start: number, stop?: number, step: number = 1): number[] => {
  if (stop === undefined) {
    stop = start
    start = 0
  }
  const n = []
  for (let i = start; (stop - i) * step > 0; i += step) n.push(i)
  return n
}

/**
 * 空の配列を省く
 * @param v 配列
 * @return 真偽値
 */
export const Omit = (v: any): boolean => {
  return !/^,+$/.test(v.toString())
}

/**
 * 現在の時刻を取得
 * @return 取得した文字列
 */
export const GetCurrentDate = (): string => {
  const d = new Date()
  const HH = d.getHours().padStart(2, '0')
  const mm = d.getMinutes().padStart(2, '0')
  return `${HH}:${mm}`
}

/**
 * 現在の時刻を取得
 * @return 取得した文字列
 */
export const GetCurrentFullDate = (): string => {
  const d = new Date()
  const MM = (d.getMonth() + 1).padStart(2, '0')
  const dd = d.getDate().padStart(2, '0')
  const HH = d.getHours().padStart(2, '0')
  const mm = d.getMinutes().padStart(2, '0')
  return `${MM}/${dd} ${HH}:${mm}`
}

/**
 * 履歴用の区切り文字列を返す
 * @return 区切り文字列
 */
export const HistoryLine = (): string => {
  return `―――― **${GetCurrentFullDate()}** ――――`
}

/**
 * クランサーバーのguildを取得する
 * @return クランサーバーのguild
 */
export const GetGuild = (): Option<Discord.Guild> => {
  return Client.guilds.cache.get(ThrowEnv('CLAN_SERVER_ID'))
}

/**
 * キャルのメンバー情報を取得する
 * @return キャルのメンバー情報
 */
export const GetCalInfo = (): Option<Discord.GuildMember> => {
  return GetGuild()?.members.cache.get(Settings.CAL_ID)
}

/**
 * 配列の中に確認用のチャンネルがあるか確認する
 * @param array 確認する配列
 * @param channel 比較するチャンネル
 * @return 真偽値
 */
export const IsChannel = (array: string[], channel: Discord.TextBasedChannels): boolean => {
  return array.some(c => c === (<Discord.TextChannel>channel).name)
}

/**
 * メンバーに指定のロールが付いているか確認する
 * @param member 確認するメンバー
 * @param role 確認したいロール
 * @return 真偽値
 */
export const IsRole = (member: Option<Discord.GuildMember>, role: string): Option<boolean> => {
  return member?.roles.cache.some(r => r.id === role)
}

/**
 * idからMemberを取得する
 * @param id 取得したいメンバーのid
 * @return 取得したMember
 */
export const MemberFromId = async (id: string): Promise<Discord.GuildMember> => {
  const members = await GetGuild()?.members.fetch()
  return members?.map(m => m).find(m => m.id === id) as Discord.GuildMember
}

/**
 * Userの名前を取得する。
 * ニックネームがある場合はそちらを取る
 * @param m Userの情報
 * @return Userの名前
 */
export const GetUserName = (m: Option<Discord.GuildMember>): string => {
  return m?.nickname ? m?.nickname : m?.user.username ?? ''
}

/**
 * Membersから指定されたUserのMemberを返す
 * @param member メンバー一覧
 * @param user Userの情報
 * @return 指定されたmember
 */
export const GetMembersFromUser = (
  member: Option<Discord.GuildMemberManager>,
  user: Discord.User
): Option<Discord.GuildMember> => {
  return member?.cache.map(m => m).find(m => m.user.id === user.id)
}

/**
 * 渡されたidのTextChannelを取得する
 * @param id チャンネルのid
 */
export const GetTextChannel = (id: string): Discord.TextChannel => {
  return Client.channels.cache.get(id) as Discord.TextChannel
}

/**
 * 渡されたidのCategoryChannelを取得する
 * @param id チャンネルのid
 */
export const GetCategoryChannel = (id: string): Discord.CategoryChannel => {
  return Client.channels.cache.get(id) as Discord.CategoryChannel
}
