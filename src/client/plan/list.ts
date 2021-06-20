import Settings from 'const-settings'
import * as util from '../../util'
import * as bossTable from '../../io/bossTable'
import * as current from '../../io/current'
import * as schedule from '../../io/schedule'
import * as status from '../../io/status'
import {AtoE, Plan} from '../../io/type'

/**
 * 引数で渡されたボス番号の凸予定一覧を出力
 * @param num ボス番号
 */
export const Output = async (alpha: AtoE) => {
  // 現在の状況を取得
  const state = await current.Fetch()

  // 凸予定一覧を取得
  const plans = await schedule.Fetch()

  // 凸予定一覧のテキストを作成
  const text = await CreatePlanText(alpha, state.stage, plans)

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
export const SituationEdit = async (plans?: Plan[]) => {
  // 凸予定一覧を取得
  plans ??= await schedule.Fetch()

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
        const awayIn = util.IsRole(member, Settings.ROLE_ID.AWAY_IN) ? '(離席中)' : ''

        // 改行を潰して、連続した空白を1つにする
        const text = p.msg.replace(/\r?\n/g, '').replace(/\s/g, ' ')

        const convex = m?.convex
        const over = '+'.repeat(Number(m?.over))
        const limit = m?.limit !== '' ? `, ${m?.limit}時` : ''

        return `${p.name}[${convex}${over}${limit}]${awayIn} ${text}`
      })
  )
  // 値の重複、空の値を潰す
  const text = [...new Set(p)].filter(v => v).join('\n')

  // ボス名とHPを取得
  const name = await bossTable.TakeName(alpha)
  const hp = Settings.STAGE[stage].HP[alpha]

  // レイアウトを調整して返す
  return `${name} \`${hp}\`\n\`\`\`\n${/^\s*$/.test(text) ? ' ' : text}\n\`\`\``
}

/**
 * 全ボスの凸予定一覧のテキストを作成
 * @param plans 凸予定一覧
 * @return 作成したテキスト
 */
const createAllPlanText = async (plans: Plan[]): Promise<string> => {
  // 現在の状況を取得
  const state = await current.Fetch()

  // 全ボスの凸予定一覧のテキストを作成
  const a = await CreatePlanText('a', state.stage, plans)
  const b = await CreatePlanText('b', state.stage, plans)
  const c = await CreatePlanText('c', state.stage, plans)
  const d = await CreatePlanText('d', state.stage, plans)
  const e = await CreatePlanText('e', state.stage, plans)

  // 1つにまとめて返す
  return [a, b, c, d, e].join('\n')
}
