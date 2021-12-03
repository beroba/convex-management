import Settings from 'const-settings'
import {AtoE, Current, Member} from '../../util/type'

/**
 * ボス状況のテキストを作成する
 * @param members メンバー一覧
 * @param state 現在の状況
 * @return 作成したテキスト
 */
export const CreateBossText = async (members: Member[], state: Current): Promise<string> => {
  const list = 'abcde'.split('').map(a => {
    // 凸宣言者一覧を取得
    const declares = members
      .filter(m => new RegExp(a, 'gi').test(m.declare))
      .map(m => {
        const convex = m.convex
        const over = '+'.repeat(m.over)
        const limit = m.limit !== '' ? `, ${m.limit}時` : ''

        return `${m.name}[${convex}${over}${limit}]`
      })

    const boss = state[<AtoE>a]
    const HP = boss.hp
    const maxHP = Settings.STAGE[state.stage].HP[a]

    const percent = Math.ceil(20 * (HP / maxHP))
    const bar = `[${'■'.repeat(percent)}${' '.repeat(20 - percent)}]`

    const icon = boss.lap - state.lap >= 2 ? '🎁' : boss.lap - state.lap >= 1 ? '+1' : ''

    return [
      '```ts',
      `${boss.lap}周目 ${boss.name} ${icon}`,
      `${bar} ${HP}/${maxHP}`,
      `${declares.length ? declares.join(', ') : ' '}`,
      '```',
    ].join('\n')
  })

  return ['ボス状況', ...list].join('\n')
}
