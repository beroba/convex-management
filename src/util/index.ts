import * as Discord from 'discord.js'
import Option from 'type-of-option'

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
 * 渡されたidのTextChannelを取得する
 * @param client bot(キャル)のclient
 */
export const GetTextChannel = (id: string, client: Discord.Client): Discord.TextChannel =>
  client.channels.cache.get(id) as Discord.TextChannel

/**
 * 配列をn個づつの塊にして作り直す
 * @param array 元になる配列
 * @param n 塊としてまとめる数
 * @return 作り直した配列
 */
export const PiecesEach = <T>(array: T[], n: number): T[][] => {
  const l = Array(Math.ceil(array.length / n))
  return Array.from(l, (_, i) => i).map((_, i) => array.slice(i * n, (i + 1) * n))
}
