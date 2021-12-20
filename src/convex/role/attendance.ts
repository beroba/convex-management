import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as situation from '../situation'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE} from '../../util/type'
import {Member} from '../../util/type'

/**
 * 離席中ロールを外す
 * @param id メンバーのID
 */
export const Remove = async (id: string) => {
  const member = await util.MemberFromId(id)
  await member.roles.remove(Settings.ROLE_ID.ATTENDANCE)
  planUpdate()
}

/**
 * 全ての凸予定を更新する
 */
const planUpdate = () => {
  // #凸状況の凸予定を更新
  situation.Plans()

  // #凸宣言の凸予定を更新
  'abcde'.split('').forEach(a => situation.DeclarePlan(<AtoE>a))
}

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

  const member = await status.FetchMember(interaction.user.id)
  if (!member) return

  const guildMember = await util.MemberFromId(member.id.first())

  const id = idList.last()
  if (id === 'on') {
    await guildMember.roles.add(Settings.ROLE_ID.ATTENDANCE)
    await edit()
    sendHistory(member, '離席中状態の追加')
    planUpdate()
    return 'Add riseki roll'
  } else if (id === 'off') {
    await guildMember.roles.remove(Settings.ROLE_ID.ATTENDANCE)
    await edit()
    sendHistory(member, '離席中状態の解除')
    planUpdate()
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

/**
 * 離席中状態の変更履歴を送信する
 * @param member メンバーの状態
 * @param content 履歴の内容
 */
const sendHistory = async (member: Member, content: string) => {
  const history = util.GetTextChannel(Settings.CHANNEL_ID.BOT_OPERATION_HISTORY)
  await history.send(util.HistoryLine())
  // prettier-ignore
  const text = [
    `\`${member.name}\` 離席中状態の変更`,
    content,
  ].join('\n')
  await history.send(text)
}
