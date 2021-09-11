import * as Discord from 'discord.js'
import Option from 'type-of-option'
import ThrowEnv from 'throw-env'
import * as declare from '../convex/declare/interaction'
import * as limit from '../convex/time/limit'
import * as manage from '../convex/manage'
import * as kill from '../convex/role/kill'

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

  comment = await manage.Interaction(interaction)
  if (comment) return console.log(comment)

  comment = await limit.Interaction(interaction)
  if (comment) return console.log(comment)

  comment = await kill.Interaction(interaction)
  if (comment) return console.log(comment)
}
