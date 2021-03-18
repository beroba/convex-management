import Settings from 'const-settings'
import * as util from './'

/**
 * 特定のリアクションを先にキャッシュする
 */
export const React = async () => {
  // #凸宣言-ボス状況のチャンネルを取得
  const declare = util.GetTextChannel(Settings.CHANNEL_ID.CONVEX_DECLARE)

  // 凸宣言のメッセージを取得
  const msgs = await declare.messages.fetch()

  // 凸宣言に付いているリアクションをキャッシュ
  await Promise.all(msgs.map(async msg => Promise.all(msg.reactions.cache.map(async r => await r.users.fetch()))))

  // #活動時間のチャンネルを取得
  const activityTime = util.GetTextChannel(Settings.CHANNEL_ID.ACTIVITY_TIME)

  // 前半と後半のメッセージを取得
  const first = await activityTime.messages.fetch(Settings.TIME_LIMIT_EMOJI.FIRST)
  const latter = await activityTime.messages.fetch(Settings.TIME_LIMIT_EMOJI.LATTER)

  // メッセージに付いているリアクションをキャッシュ
  await Promise.all(first.reactions.cache.map(async r => await r.users.fetch()))
  await Promise.all(latter.reactions.cache.map(async r => await r.users.fetch()))
}
