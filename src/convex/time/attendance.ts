import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * 押されたボタンに応じて離席中状態を変更する
 * @param interaction インタラクションの情報
 * @return 離席中状態変更の実行結果
 */
export const Interaction = async (interaction: Discord.Interaction): Promise<Option<string>> => {
  const isBot = interaction.user.bot
  if (isBot) return

  if (!interaction.isButton()) return

  const idList = interaction.customId.split('-')
  if (idList.first() !== 'riseki') return

  // インタラクション失敗を回避
  interaction.deferUpdate()

  const member = interaction.member as Discord.GuildMember

  const id = idList.last()
  if (id === 'on') {
    await member.roles.add(Settings.ROLE_ID.ATTENDANCE)
    await edit()
    return 'Add riseki roll'
  } else if (id === 'off') {
    await member.roles.remove(Settings.ROLE_ID.ATTENDANCE)
    await edit()
    return 'Remove riseki roll'
  } else {
    return
  }
}

/**
 * 離席中状態のメッセージを更新する
 */
const edit = async () => {
  const text = [
    `<@&${Settings.ROLE_ID.ATTENDANCE}> は、このメッセージがオレンジ色になります。`,
    '↓のボタンで離席中状態を変更できます。',
  ].join('\n')

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_OPERATION)
  const msg = await channel.messages.fetch(Settings.BOT_OPERATION.ATTENDANCE)

  await msg.edit(text)
}
