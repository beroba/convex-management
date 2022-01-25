import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as status from '../../io/status'
import * as util from '../../util'
import {Member} from '../../util/type'

/**
 * メッセージ送信者にタスキルロールを付与する
 * @param msg DiscordからのMessage
 */
export const Add = async (msg: Discord.Message) => {
  const member = await status.FetchMember(msg.author.id)
  if (!member) return
  const guildMember = await util.MemberFromId(member.id.first())

  const isRole = util.IsRole(guildMember, Settings.ROLE_ID.TASK_KILL)

  if (isRole) {
    msg.reply('既にタスキルしてるわ')
  } else {
    await guildMember.roles.add(Settings.ROLE_ID.TASK_KILL)
    await edit()

    msg.reply('タスキルロールを付けたわよ！')
  }
}

/**
 * 全員のタスキルロールを外す
 */
export const RemoveAll = async () => {
  const members = await status.Fetch()
  const guildMembers = await Promise.all(members.map(m => util.MemberFromId(m.id.first())))
  guildMembers.forEach(m => m.roles.remove(Settings.ROLE_ID.TASK_KILL))

  const channel = util.GetTextChannel(Settings.CHANNEL_ID.BOT_NOTIFY)
  channel.send('全員のタスキルロールを外したわ')

  console.log('remove task kill role')
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

  const member = await status.FetchMember(interaction.user.id)
  if (!member) return

  const guildMember = await util.MemberFromId(member.id.first())

  const id = idList.last()
  if (id === 'on') {
    await guildMember.roles.add(Settings.ROLE_ID.TASK_KILL)
    await edit()
    sendHistory(member, 'タスキルの追加')
    return 'Add task kill roll'
  } else if (id === 'off') {
    await guildMember.roles.remove(Settings.ROLE_ID.TASK_KILL)
    await edit()
    sendHistory(member, 'タスキルの解除')
    return 'Remove task kill roll'
  } else {
    return
  }
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
 * タスキルの履歴を送信する
 * @param member メンバーの状態
 * @param content 履歴の内容
 */
const sendHistory = async (member: Member, content: string) => {
  const history = util.GetTextChannel(Settings.CHANNEL_ID.BOT_OPERATION_HISTORY)
  // prettier-ignore
  const text = [
    util.HistoryLine(),
    `\`${member.name}\` タスキル状態の変更`,
    content,
  ].join('\n')
  await history.send(text)
}
