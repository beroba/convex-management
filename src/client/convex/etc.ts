import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as util from '../../util'

/**
 * 同時凸の持ち越し計算を行う
 * @param HP ボスのHP
 * @param A 1人目のダメージ
 * @param B 2人目のダメージ
 * @param msg DiscordからのMessage
 */
export const SimultConvexCalc = (HP: number, A: number, B: number, msg: Discord.Message) => {
  // 持ち越し秒数を計算
  const a = overCalc(HP, A, B)
  const b = overCalc(HP, B, A)

  // 計算結果を出力
  msg.reply(`\`\`\`A ${a}s\nB ${b}s\`\`\`ダメージの高い方を先に通した方が持ち越し時間が長くなるわよ！`)
}

/**
 * 持ち越しの計算をする
 * 計算式: 持ち越し時間 = 90 - (残りHP * 90 / 与ダメージ - 20)  // 端数切り上げ
 * @param HP ボスのHP
 * @param a AのHP
 * @param b BのHP
 * @return 計算結果
 */
const overCalc = (HP: number, a: number, b: number): number => {
  return Math.ceil(90 - (((HP - a) * 90) / b - 20))
}

/**
 * メッセージ送信者にタスキルロールを付与する
 * @param msg DiscordからのMessage
 */
export const AddTaskKillRoll = async (msg: Discord.Message) => {
  // 既にタスキルしてるか確認する
  const isRole = util.IsRole(msg.member, Settings.ROLE_ID.TASK_KILL)

  if (isRole) {
    msg.reply('既にタスキルしてるわ')
  } else {
    // タスキルロールを付与する
    await msg.member?.roles.add(Settings.ROLE_ID.TASK_KILL)

    msg.reply('タスキルロールを付けたわよ！')
  }
}
