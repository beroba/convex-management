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
export const Format = (str: string): string =>
  moji(str)
    .convert('ZE', 'HE')
    .convert('ZS', 'HS')
    .toString()
    .replace(/[^\S\n\r]+/g, ' ')

/**
 * クランサーバーのguildを取得する
 * @return クランサーバーのguild
 */
export const GetGuild = (): Option<Discord.Guild> => Client.guilds.cache.get(ThrowEnv('CLAN_SERVER_ID'))

/**
 * キャルのメンバー情報を取得する
 * @return キャルのメンバー情報
 */
export const GetCalInfo = (): Option<Discord.GuildMember> => GetGuild()?.members.cache.get(Settings.CAL_ID)

/**
 * 配列の中に確認用のチャンネルがあるか確認する
 * @param array 確認する配列
 * @param channel 比較するチャンネル
 * @return 真偽値
 */
export const IsChannel = (array: string[], channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel) =>
  array.some((c: string) => c === (channel as Discord.TextChannel).name)

/**
 * Userの名前を取得する。
 * ニックネームがある場合はそちらを取る
 * @param m Userの情報
 * @return Userの名前
 */
export const GetUserName = (m: Option<Discord.GuildMember>): string =>
  m?.nickname ? m?.nickname : m?.user.username || ''

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
  return member?.cache.map(m => m).filter(m => m.user.id === user.id)[0]
}

/**
 * 渡されたidのTextChannelを取得する
 * @param id チャンネルのid
 */
export const GetTextChannel = (id: string): Discord.TextChannel => Client.channels.cache.get(id) as Discord.TextChannel
