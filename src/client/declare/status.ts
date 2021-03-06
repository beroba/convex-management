import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import * as current from '../../io/current'
import {Current} from '../../io/type'

/**
 * HPの計算とリアクションを付ける
 * @param msg DiscordからのMessage
 * @return 凸予定の実行結果
 */
export const React = async (msg: Discord.Message): Promise<Option<string>> => {
  // botのメッセージは実行しない
  if (msg.member?.user.bot) return

  // #凸予定でなければ終了
  if (msg.channel.id !== Settings.CHANNEL_ID.CONVEX_DECLARE) return

  // 全角を半角に変換
  const content = util.Format(msg.content)

  // @が入っている場合はHPの変更をする
  if (/@\d/.test(content)) {
    // HPの変更
    await RemainingHPChange(content)

    // メッセージの削除
    msg.delete()

    return 'Remaining HP change'
  }

  // 確認と持越の絵文字を付ける
  await msg.react(Settings.EMOJI_ID.KAKUNIN)
  await msg.react(Settings.EMOJI_ID.MOCHIKOSHI)
  console.log('Set declare reactions')

  return 'Calculate the HP'
}

/**
 * ボスの状態を変更する
 * @param state 現在の状況
 */
export const Update = async (state: Current) => {
  // 現在のボスのHPを取得
  const hp = Settings.STAGE_HP[state.stage][state.alpha]

  // #凸宣言-ボス状況のチャンネルを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)
  const status = await channel.messages.fetch(Settings.CONVEX_DECLARE_ID.STATUS)

  // メッセージを編集
  await status.edit(`現在のHP \`${state.hp}/${hp}\`\n予想残りHP \` \``)
}

/**
 * ボスの残りHPを更新する
 * @param content 変更先HPのメッセージ
 */
export const RemainingHPChange = async (content: string) => {
  // 変更先のHPを取り出す
  const at = content.replace(/^.*@/g, '').replace(/\s.*$/g, '')

  // HPの変更
  const state = await current.UpdateBossHp(at)

  // 状態を変更
  await Update(state)
}
