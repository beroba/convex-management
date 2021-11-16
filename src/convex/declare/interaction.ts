import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as list from './list'
import * as situation from '../situation'
import * as damageList from '../../io/damageList'
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

  const idList = interaction.customId.split('-')
  if (idList.first() === 'damage') {
    return damage(interaction, idList)
  } else if (idList.first() === 'boss') {
    return boss(interaction, idList)
  }
}

/**
 * ダメージの処理
 * @param interaction ボタンのインタラクション
 * @param idList ボタンのidリスト
 * @return 実行結果の文字列
 */
const damage = async (interaction: Discord.ButtonInteraction, idList: string[]): Promise<string> => {
  // インタラクション失敗を回避
  interaction.deferUpdate()

  const id = idList.last()
  const alpha = <AtoE>id[0]
  const flag = id[1] === '+' ? 'ok' : id[1] === '*' ? 'ng' : 'none'

  let damages = await damageList.FetchBoss(alpha)
  damages = damages.map(d => {
    if (d.id !== interaction.user.id) return d
    if (d.already) return d

    // トグルするように実装
    if (d.flag === 'check' || d.flag === 'none') {
      d.flag = flag
    } else if (d.flag === 'ok') {
      d.flag = flag === 'ok' ? 'none' : flag === 'ng' ? 'ng' : 'ok'
    } else if (d.flag === 'ng') {
      d.flag = flag === 'ng' ? 'none' : flag === 'ok' ? 'ok' : 'ng'
    }

    return d
  })

  damages = await damageList.UpdateBoss(alpha, damages)
  await list.SetDamage(alpha, undefined, undefined, damages)

  return 'Flag change'
}

/**
 * ボスの処理
 * @param interaction ボタンのインタラクション
 * @param idList ボタンのidリスト
 * @return 実行結果の文字列
 */
const boss = async (interaction: Discord.ButtonInteraction, idList: string[]): Promise<string> => {
  // インタラクション失敗を回避
  interaction.deferUpdate()

  const id = idList.last()
  if (/\*/.test(id)) {
    await cancel(id, interaction)
    return 'Deletion of convex declaration'
  } else {
    await add(id, interaction)
    return 'Addition of convex declaration'
  }
}

/**
 * 凸宣言を削除する
 * @param interaction インタラクションの情報
 */
const cancel = async (id: string, interaction: Discord.ButtonInteraction) => {
  const member = await status.FetchMember(interaction.user.id)
  if (!member) return

  const alpha = id.replace('*', '') as AtoE

  // 凸状況を更新
  member.declare = member.declare.replace(alpha, '')
  const members = await status.UpdateMember(member)

  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])
  await list.SetUser(alpha, channel, members)

  const damages = await damageList.DeleteUser(alpha, member.id)
  await list.SetDamage(alpha, undefined, channel, damages)

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
    // 3凸目で持越がある場合は持越
    member.carry = !member.convex && member.over ? true : false
  }
  member.declare = [...new Set(`${member.declare}${alpha}`.split(''))].join('')
  const members = await status.UpdateMember(member)

  const channel = util.GetTextChannel(Settings.DECLARE_CHANNEL_ID[alpha])

  await list.SetUser(alpha, channel, members)

  const damages = await damageList.FetchBoss(alpha)
  await list.SetDamage(alpha, undefined, channel, damages)

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
