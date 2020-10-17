import Settings from 'const-settings'
import * as util from '../../util'
import * as convex from '.'
import * as lapAndBoss from './lapAndBoss'

/**
 * 全凸終了報告を行う
 */
export const AllConvex = async () => {
  const day = (await convex.GetDay())[0]
  const state = await lapAndBoss.GetCurrent()

  // 進行に報告をする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(
    `${day}の全凸終了報告よ！\n` +
      `今日は\`${state.lap}\`周目の\`${state.boss}\`まで進んだわ\n` +
      `お疲れ様！次も頑張りなさい`
  )

  console.log('Complete convex end report')
}

/**
 * 全凸終了報告を行う
 * @param n日目かの値
 */
export const Unevenness = async (day: string | number) => {
  // 全凸終了処理を行う
  const state = await lapAndBoss.GetCurrent()

  // 凸残したユーザー一覧を取得
  const 凸残 = util
    .GetGuild()
    ?.roles.cache.get(Settings.ROLE_ID.REMAIN_CONVEX)
    ?.members.map(m => `<@!${m.user.id}>`)

  // 進行に報告をする
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(
    `${day}日目の凸状況報告よ！\n` +
      `今日の凸残りは ${凸残?.join(' ')} よ\n` +
      `\`${state.lap}\`周目の\`${state.boss}\`まで進んだわ\n` +
      `お疲れ様！次も頑張りなさい`
  )
}
