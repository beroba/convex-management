import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as declare from '../convex/declare/interaction'

/**
 * インタラクションが起きた際の処理を実行する
 * @param interaction インタラクション情報
 */
export const InteractionCreate = async (interaction: Discord.Interaction) => {
  const isBeroba = interaction.guild?.id === ThrowEnv('CLAN_SERVER_ID')
  if (!isBeroba) return

  let comment: Option<string>

  comment = await declare.Convex(interaction)
  if (comment) return console.log(comment)
}
