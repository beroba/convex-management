import Settings from 'const-settings'
import * as util from '../../util'
import * as bossTable from '../../io/bossTable'
import * as current from '../../io/current'
import * as schedule from '../../io/schedule'
import {Plan} from '../../io/type'

/**
 * 引数で渡されたボス番号の凸予定一覧を出力
 * @param num ボス番号
 */
export const Output = async (alpha: string) => {
  // 現在の状況を取得
  const state = await current.Fetch()

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()

  // 凸予定一覧のテキストを作成
  const text = await createPlanText(alpha, state.stage, plans)

  // 凸予定一覧を出力
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(text)
}

/**
 * 全凸予定一覧を出力
 */
export const AllOutput = async () => {
  // 凸予定一覧を取得
  const plans = await schedule.Fetch()

  // 凸予定一覧のテキストを作成
  const text = await createAllPlanText(plans)

  // 凸予定一覧を出力
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(text)
}

/**
 * #凸状況の凸予定を編集
 * @param plans 凸予定一覧
 */
export const SituationEdit = async (plans: Plan[]) => {
  // 凸予定一覧のテキストを作成
  const text = await createAllPlanText(plans)

  // 凸状況を更新
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_SITUATION)
  const msg = await channel.messages.fetch(Settings.CONVEX_MESSAGE_ID.PLAN)
  msg.edit(text)

  console.log('Edit the convex schedule of the convex situation')
}

/**
 * 凸予定一覧のテキストを作成
 * @param alpha ボス番号
 * @param stage 段階名
 * @param plans 凸予定一覧
 * @return 作成したテキスト
 */
const createPlanText = async (alpha: string, stage: string, plans: Plan[]): Promise<string> => {
  // 凸予定一覧から名前とメッセージだけにしたテキストを作成
  const p = await Promise.all(
    plans
      .filter(p => p.alpha === alpha)
      .map(async p => {
        const member = await util.MemberFromId(p.playerID)
        const bool = util.IsRole(member, Settings.ROLE_ID.AWAY_IN)
        // 離席中なら表示しない
        return bool ? '' : `${p.name} ${p.msg}`
      })
  )
  const text = p.join('\n')

  // ボス名とHPを取得
  const name = await bossTable.TakeName(alpha)
  const hp = Settings.STAGE_HP[stage][alpha]

  // レイアウトを調整して返す
  return `${name} \`${hp}\`\n\`\`\`\n${text ? text : ' '}\n\`\`\``
}

/**
 * 全ボスの凸予定一覧のテキストを作成
 * @param plans 凸予定一覧
 * @return 作成したテキスト
 */
const createAllPlanText = async (plans: Plan[]): Promise<string> => {
  // 現在の状況を取得
  const state = await current.Fetch()
  const stage = state.stage

  // 全ボスの凸予定一覧のテキストを作成
  const a = await createPlanText('a', stage, plans)
  const b = await createPlanText('b', stage, plans)
  const c = await createPlanText('c', stage, plans)
  const d = await createPlanText('d', stage, plans)
  const e = await createPlanText('e', stage, plans)

  // 1つにまとめて返す
  return [a, b, c, d, e].join('\n')
}
