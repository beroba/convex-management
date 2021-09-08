import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'

/**
 * インタラクションが起きた際の処理を実行する
 * @param interaction インタラクション情報
 */
export const InteractionCreate = async (interaction: Discord.Interaction) => {
  const isBeroba = interaction.guild?.id === ThrowEnv('CLAN_SERVER_ID')
  if (!isBeroba) return

  console.log(interaction)
}
