import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as list from './list'
import * as situation from '../situation'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE} from '../../util/type'

/**
 * 押されたボタンに応じて凸宣言をする
 * @param interaction インタラクションの情報
 * @return 凸宣言処理の実行結果
 */
export const Convex = async (interaction: Discord.Interaction): Promise<Option<string>> => {
  const isBot = interaction.user.bot
  if (isBot) return

  if (!interaction.isButton()) return

  // インタラクション失敗を回避
  interaction.deferUpdate()

  // インタラクションがboss以外終了
  const idList = interaction.customId.split('-')
  if (idList.first() !== 'boss') return

  const id = idList.last()
  if (id === 'cancel') {
    cancel(interaction)
    return 'Deletion of convex declaration'
  } else {
    add(id, interaction)
    return 'Addition of convex declaration'
  }
}

/**
 * 凸宣言を削除する
 * @param interaction インタラクションの情報
 */
const cancel = async (interaction: Discord.ButtonInteraction) => {
  const member = await status.FetchMember(interaction.user.id)
  if (!member) return

  const alpha = Object.keys(Settings.DECLARE_CHANNEL_ID).find(
    key => Settings.DECLARE_CHANNEL_ID[key] === interaction.channel?.id
  ) as Option<AtoE>
  if (!alpha) return

  // 凸状況を更新
  member.declare = ''
  member.carry = false
  const members = await status.UpdateMember(member)

  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  await list.SetUser(alpha, channel, members)

  situation.Report(members)
  deleteAttendance(interaction)
}

/**
 * 凸宣言を追加する
 * @param id ボタンのID情報
 * @param interaction インタラクションの情報
 */
const add = async (id: string, interaction: Discord.ButtonInteraction) => {
  const member = await status.FetchMember(interaction.user.id)
  if (!member) return

  const alpha = id.replace('+', '') as AtoE

  // 凸状況を更新
  if (/\+/.test(id)) {
    if (!member.over) return
    member.carry = true
  } else {
    member.carry = false
  }
  member.declare = alpha
  const members = await status.UpdateMember(member)

  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  await list.SetUser(alpha, channel, members)

  situation.Report(members)
  deleteAttendance(interaction)
}

/**
 * 離席中ロールを外す
 * @param interaction インタラクションの情報
 */
const deleteAttendance = (interaction: Discord.ButtonInteraction) => {
  const member = interaction.member as Discord.GuildMember
  member.roles.remove(Settings.ROLE_ID.ATTENDANCE)
}
