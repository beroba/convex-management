import * as Discord from 'discord.js'

/**
 * 配列の中に確認用のチャンネルがあるか確認する
 * @param array 確認する配列
 * @param channel 比較するチャンネル
 */
export const IsChannel = (array: string[], channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel) =>
  array.some((c: string) => c === (channel as Discord.TextChannel).name)
