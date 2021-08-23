import Option from 'type-of-option'
import Settings from 'const-settings'
import {Json} from './type'
import * as util from '../util'

/**
 * キャルステータスの値を取得する
 * @param naem 更新したいjsonの名前
 * @return 取得したjsonの情報
 */
export const Fetch = async (name: string): Promise<Option<Json>> => {
  // 更新したいステータスのidを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CAL_STATUS)
  const msgs = (await channel.messages.fetch()).map(m => m)

  // 一致する名前のメッセージを取得
  const msg = msgs.find(m => m.content.split('\n').first() === name)
  if (!msg) return

  // 余計な部分を全て取り除きjsonに変換する
  return <Json>JSON.parse(
    msg.content
      .split('\n')
      .splice(1)
      .filter(v => !/```/.test(v))
      .join('')
  )
}

/**
 * キャルステータスの値を送信する
 * @param json 更新させたいjsonの情報
 */
export const Update = async (json: Json) => {
  // 更新したいステータスのidを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CAL_STATUS)

  // prettier-ignore
  // 見やすいように書式を整形する
  const text = [
    '```json',
    JSON.stringify(json)
      .replace(/^{/g, '{\n  ')
      .replace(/}$/g, '\n}')
      .replace(/:/g, ': ')
      .replace(/,/g, ',\n  '),
    '```',
  ].join('\n')

  // メッセージを送信
  await channel.send(text)
}
