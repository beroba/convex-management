import Settings from 'const-settings'
import * as bossTable from '../../io/bossTable'
import * as current from '../../io/current'
import * as status from '../../io/status'
import * as util from '../../util'
import {AtoE, Plan} from '../../util/type'

/**
 * 全ボスの凸予定一覧のテキストを作成
 * @param plans 凸予定一覧
 * @return 作成したテキスト
 */
export const CreateAllPlanText = async (plans: Plan[]): Promise<string> => {
  const state = await current.Fetch()

  // 昇順ソート
  plans = plans.sort((a, b) => (a.name > b.name ? 1 : -1))

  // 全ボスの凸予定一覧のテキストを作成
  const a = await CreatePlanText('a', state.stage, plans)
  const b = await CreatePlanText('b', state.stage, plans)
  const c = await CreatePlanText('c', state.stage, plans)
  const d = await CreatePlanText('d', state.stage, plans)
  const e = await CreatePlanText('e', state.stage, plans)

  // prettier-ignore
  return [
    '予定一覧',
    a,
    b,
    c,
    d,
    e,
  ].join('\n')
}

/**
 * 凸予定一覧のテキストを作成
 * @param alpha ボス番号
 * @param stage 段階名
 * @param plans 凸予定一覧
 * @return 作成したテキスト
 */
export const CreatePlanText = async (alpha: AtoE, stage: string, plans: Plan[]): Promise<string> => {
  // 凸予定一覧から名前とメッセージだけにしたテキストを作成
  const p = await Promise.all(
    plans
      .filter(p => p.alpha === alpha)
      .map(async p => {
        const m = await status.FetchMember(p.playerID)
        // 3凸済みなら表示しない
        if (m?.end) return ''

        // 離席状態か確認
        const member = await util.MemberFromId(p.playerID)
        const awayIn = util.IsRole(member, Settings.ROLE_ID.ATTENDANCE) ? '(離席中)' : ''

        // 改行を潰して、連続した空白を1つにする
        const text = p.msg.replace(/\r?\n/g, '').replace(/\s/g, ' ')

        const convex = m?.convex
        const over = '+'.repeat(<number>m?.over)
        const limit = m?.limit !== '' ? `, ${m?.limit}時` : ''

        return `${p.name}[${convex}${over}${limit}]${awayIn} ${text}`
      })
  )
  // 値の重複、空の値を潰す
  const text = [...new Set(p)].filter(v => v).join('\n')

  // ボス名とHPを取得
  const name = await bossTable.TakeName(alpha)
  const hp = Settings.STAGE[stage].HP[alpha]

  // prettier-ignore
  return [
    '```ts',
    `- ${name} ${hp}`,
    `${/^\s*$/.test(text) ? ' ' : text}`,
    '```',
  ].join('\n')
}
