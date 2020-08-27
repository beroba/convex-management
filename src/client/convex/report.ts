import * as Discord from 'discord.js'
import Settings from 'const-settings'
import Option from 'type-of-option'
import * as util from '../../util'
import * as date from './date'
import * as lapAndBoss from './lapAndBoss'
import * as situation from './situation'
import * as status from './status'

/**
 * 凸報告の管理を行う
 * @param msg DiscordからのMessage
 * @return 凸報告の実行結果
 */
export const Convex = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージはコマンド実行しない
  if (msg.member?.user.bot) return

  // #凸報告でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_REPORT) return

  // クラバトの日じゃない場合は終了
  const day = await date.GetDay()
  if (!day) {
    msg.reply('今日はクラバトの日じゃないわ')
    return "It's not ClanBattle days"
  }

  // 凸状況を更新
  await status.Update(msg)

  // 凸状況に報告
  situation.Report()

  return 'Update status'
}

/**
 * 全凸終了報告を行う
 */
export const AllConvex = async () => {
  const day = await date.GetDay()
  const state = await lapAndBoss.GetCurrent()

  // 進行に報告をする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(
    `${day}日目の全凸終了報告よ！\n` +
      `今日は\`${state.lap}\`周目の\`${state.boss}\`まで進んだわ\n` +
      `お疲れ様！次も頑張りなさい`
  )

  console.log('Complete convex end report')
}
