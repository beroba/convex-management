import * as util from '../util'
import Settings from 'const-settings'

/**
 * キャルステータスの値を取得する
 * @param id 更新したいステータスのid
 * @return 取得したjsonの情報
 */
export const Fetch = async <T>(id: string): Promise<T> => {
  // 更新したいステータスのidを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CAL_STATUS)
  const msg = await channel.messages.fetch(id)

  // 余計な部分を全て取り除きjsonに変換する
  const json: T = JSON.parse(
    msg.content
      .split('\n')
      .filter((_, i, l) => !(i === 0 || i === l.length - 1))
      .map(s => s.trim())
      .join('')
  )
  return json
}

/**
 * キャルステータスの値を更新する
 * @param id 更新したいステータスのid
 * @param json 更新させたいjsonの情報
 */
export const UpdateArray = async <T>(id: string, json: T) => {
  // 更新したいステータスのidを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CAL_STATUS)
  const msg = await channel.messages.fetch(id)

  // prettier-ignore
  // 見やすいように書式を追加するする
  const text = [
    '```json',
    JSON.stringify(json)
      .replace(/{/g, '\n  {')
      .replace(/]/g, '\n]')
      .replace(/:/g, ': ')
      .replace(/,/g, ', '),
    '```',
  ].join('\n')

  // メッセージを更新
  await msg.edit(text)
}

/**
 * キャルステータスの値を更新する
 * @param id 更新したいステータスのid
 * @param json 更新させたいjsonの情報
 */
export const UpdateJson = async <T>(id: string, json: T) => {
  // 更新したいステータスのidを取得
  const channel = util.GetTextChannel(Settings.CHANNEL_ID.CAL_STATUS)
  const msg = await channel.messages.fetch(id)

  // prettier-ignore
  // 見やすいように書式を追加するする
  const text = [
    '```json',
    JSON.stringify(json)
      .replace(/{/g, '\n{\n  ')
      .replace(/}/g, '\n}\n')
      .replace(/:/g, ': ')
      .replace(/,/g, ',\n  '),
    '```',
  ].join('\n')

  // メッセージを更新
  await msg.edit(text)
}
