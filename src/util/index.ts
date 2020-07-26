import * as Discord from 'discord.js'

/**
 * 配列の中に確認用のチャンネルがあるか確認する
 * @param array 確認する配列
 * @param channel 比較するチャンネル
 */
export const IsChannel = (array: string[], channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel) =>
  array.some((c: string) => c === (channel as Discord.TextChannel).name)

/**
 * 配列をn個づつの塊にして配列を作り直す
 * @param array 元になる配列
 * @param n 塊としてまとめる数
 * @return 作り直した配列
 */
export const PiecesEach = <T>(array: T[], n: number): T[][] => {
  const l = Array(Math.ceil(array.length / n))
  return Array.from(l, (_, i) => i).map((_, i) => array.slice(i * n, (i + 1) * n))
}
