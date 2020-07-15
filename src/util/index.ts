import * as Discord from 'discord.js'
import Settings from 'const-settings'

/**
 * 受け取ったチャンネルがsettings.yamlに記載されているチャンネルか確認する
 * @param key settings.yamlのkey
 * @param channel 確認するチャンネル
 */
export const IsChannel = (key: string, channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel) =>
  Settings[key].some((c: string) => c === (channel as Discord.TextChannel).name)
