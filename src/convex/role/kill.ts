import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * メッセージ送信者にタスキルロールを付与する
 * @param msg DiscordからのMessage
 */
export const AddRole = async (msg: Discord.Message) => {
  const isRole = util.IsRole(msg.member, Settings.ROLE_ID.TASK_KILL)

  if (isRole) {
    msg.reply('既にタスキルしてるわ')
  } else {
    await msg.member?.roles.add(Settings.ROLE_ID.TASK_KILL)
    await edit()

    msg.reply('タスキルロールを付けたわよ！')
  }
}

/**
 * 押されたボタンに応じてタスキル状態を変更する
 * @param interaction インタラクションの情報
 * @return タスキル状態変更の実行結果
 */
export const Interaction = async (interaction: Discord.Interaction): Promise<Option<string>> => {
  const isBot = interaction.user.bot
  if (isBot) return

  if (!interaction.isButton()) return

  const idList = interaction.customId.split('-')
  if (idList.first() !== 'kill') return

  // インタラクション失敗を回避
  interaction.deferUpdate()

  const member = interaction.member as Discord.GuildMember

  const id = idList.last()
  if (id === 'on') {
    await member.roles.add(Settings.ROLE_ID.TASK_KILL)
    await edit()
    return 'Add task kill roll'
  } else if (id === 'off') {
    await member.roles.remove(Settings.ROLE_ID.TASK_KILL)
    await edit()
    return 'Remove task kill roll'
  }

  return
}

/**
 * タスキル状態のメッセージを変更する
 */
const edit = async () => {
  const text = [
    `<@&${Settings.ROLE_ID.TASK_KILL}> をしていると、このメッセージがオレンジ色になります。`,
    '↓のボタンでタスキル状態を変更できます。',
  ].join('\n')

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_OPERATION)
  const msg = await channel.messages.fetch(Settings.BOT_OPERATION.TASK_KILL)

  await msg.edit(text)
}

/**
 * 全員のタスキルロールを外す
 */
export const RemoveAllRole = () => {
  const guildMembers = util.GetGuild()?.members.cache.map(m => m)
  guildMembers?.forEach(m => m?.roles.remove(Settings.ROLE_ID.TASK_KILL))

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('全員のタスキルロールを外したわ')

  console.log('remove task kill role')
}
