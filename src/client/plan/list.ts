import Settings from 'const-settings'
import * as bossTable from '../../io/bossTable'
import * as current from '../../io/current'
import * as schedule from '../../io/schedule'
import * as util from '../../util'

/**
 * 引数で渡されたボス番号の凸予定一覧を出力
 * @param num ボス番号
 */
export const Output = async (alpha: string) => {
  // 現在の状況を取得
  const state = await current.Fetch()

  // 凸予定一覧のテキストを作成
  const text = await createPlanText(alpha, state.stage)

  // 凸予定一覧を出力
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(text)
}

/**
 * 全凸予定一覧を出力
 */
export const AllOutput = async () => {
  // 凸予定一覧のテキストを作成
  const text = await createAllPlanText()

  // 凸予定一覧を出力
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.PROGRESS)
  channel.send(text)
}

/**
 * #凸状況の凸予定を編集
 */
export const SituationEdit = async () => {
  // 凸予定一覧のテキストを作成
  const text = await createAllPlanText()

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
 * @return 作成したテキスト
 */
const createPlanText = async (alpha: string, stage: string): Promise<string> => {
  // 指定したボスの凸予定一覧を取得
  const plans = await schedule.FetchBoss(alpha)

  // 凸予定一覧から名前とメッセージだけにしたテキストを作成
  const text = plans.map(p => `${p.name} ${p.msg}`).join('\n')

  // ボス名とHPを取得
  const name = await bossTable.TakeName(alpha)
  const hp = Settings.STAGE_HP[stage][alpha]

  // レイアウトを調整して返す
  return `${name} \`${hp}\`\n\`\`\`\n${text ? text : ' '}\n\`\`\``
}

/**
 * 全ボスの凸予定一覧のテキストを作成
 * @return 作成したテキスト
 */
const createAllPlanText = async (): Promise<string> => {
  // 現在の状況を取得
  const state = await current.Fetch()
  const stage = state.stage

  // 全ボスの凸予定一覧のテキストを作成
  const a = await createPlanText('a', stage)
  const b = await createPlanText('b', stage)
  const c = await createPlanText('c', stage)
  const d = await createPlanText('d', stage)
  const e = await createPlanText('e', stage)

  // 1つにまとめて返す
  return [a, b, c, d, e].join('\n')
}
