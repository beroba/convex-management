import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../util'
import {Json} from '../util/type'

/**
 * キャルステータスの値を取得する
 * @param naem 更新したいjsonの名前
 * @return 取得したjsonの情報
 */
export const Fetch = async (name: string): Promise<Option<Json>> => {
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
export const Send = async (json: Json) => {
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

  // 他人のメッセージは編集できないので、メッセージを送信しそれをコピペして編集する
  await channel.send(text)
}
