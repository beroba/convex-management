import * as Discord from 'discord.js'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as command from './command'
import * as list from './list'
import * as etc from '../etc'
import * as lapAndBoss from '../lapAndBoss'
import * as situation from '../situation'
import * as current from '../../io/current'
import * as damageList from '../../io/damageList'
import * as status from '../../io/status'
import * as util from '../../util'
import * as send from '../../util/send'
import {AtoE, Current, Damage} from '../../util/type'

/**
 * 凸宣言に入力されたメッセージを処理する
 * 必ずメッセージは削除する
 * @param msg DiscordからのMessage
 * @param alpha ボス番号
 */
export const Process = async (msg: Discord.Message, alpha: AtoE) => {
  let content = util.Format(msg.content)

  // @とsが両方ある場合は@を消す
  content = /(?=.*@)(?=.*(s|秒))/.test(content) ? content.replace(/@/g, '') : content

  // m:ssを[\d]sに変換
  const t = content.match(/(0|1):\d{1,2}/g)
  if (t) {
    const [m, ss] = t.first().split(':')
    content = content.replace(/(0|1):\d{1,2}/, `${m.to_n() * 60 + ss.to_n()}s`)
  }

  // コマンドの処理
  if (msg.content.charAt(0) === '/') {
    await command.Process(content, alpha, msg)
    await util.Sleep(100)
    msg.delete()
    return
  }

  const damages = await addDamage(msg, content, alpha)
  if (damages) {
    await list.SetDamage(alpha, undefined, undefined, damages)
  }

  await util.Sleep(100)
  msg.delete()
}

/**
 * ダメージ報告のメッセージをダメージ一覧に追加する
 * @param msg DiscordからのMessage
 * @param content ダメージ報告のメッセージ
 * @param alpha ボス番号
 * @return ダメージ一覧
 */
const addDamage = async (msg: Discord.Message, content: string, alpha: AtoE): Promise<Option<Damage[]>> => {
  let damages = await damageList.FetchBoss(alpha)

  const member = await status.FetchMember(msg.author.id)
  if (!member) return

  // 上書きできるように前のダメージを消す
  damages = damages.filter(d => d.id !== member.id || d.already)

  const damage: Damage = {
    name: member.name,
    id: member.id,
    num: '0',
    exclusion: false,
    flag: 'none',
    text: msg.content,
    damage: fetchDamage(content),
    time: fetchTime(content),
    date: util.GetCurrentDate(),
    already: false,
  }
  damages = [...damages, damage]

  damages = await damageList.UpdateBoss(alpha, damages)

  return damages
}

/**
 * メッセージからダメージだけを取りだす
 * @param content ダメージ報告のメッセージ
 * @return ダメージ
 */
const fetchDamage = (content: string): number => {
  const list = content
    .replace(/\d*(s|秒)/gi, '')
    .trim()
    .match(/[\d]+/g)

  // リストがnullなら0ダメージ
  if (!list) return 0

  // リストの中から1番大きい値を返す
  return Math.max(...list.map(Number))
}

/**
 * メッセージから秒数だけを取りだす
 * @param content ダメージ報告のメッセージ
 * @return 秒数
 */
const fetchTime = (content: string): number => {
  const time = content.match(/\d*(s|秒)/gi)

  // timeがnullなら0秒
  if (!time) return 0

  // リストの中から先頭の値を返す
  return time
    .map(d => d)
    .first()
    .replace(/(s|秒)/gi, '')
    .to_n()
}

/**
 * ボスの残りHPを更新する
 * @param content 変更先HPのメッセージ
 * @param alpha ボス番号
 * @param state 現在の状況
 * @return 変更後の状態
 */
export const RemainingHPChange = async (content: string, alpha: AtoE, state?: Current): Promise<Current> => {
  state ??= await current.Fetch()

  // 変更先のHPを取り出す
  const hp = content
    .replace(/^.*@/g, '')
    .trim()
    .replace(/\s.*$/g, '')
    .match(/\d*/)
    ?.map(e => e)
    .first()

  // 数字がない又は値がない場合は終了
  if (hp === '' || hp === undefined) return <Current>{}

  // HPの変更
  state = await lapAndBoss.UpdateHP(hp.to_n(), alpha, state)

  await list.SetDamage(alpha, state)

  const members = await status.Fetch()
  situation.Report(members)

  return state
}

/**
 * ダメージ報告の合計ダメージを計算する
 * @param damage ダメージ一覧
 * @return 合計ダメージ
 */
export const TotalDamage = async (damages: Damage[]): Promise<number> => {
  const list = damages.filter(d => !d.exclusion)
  // ダメージ一覧がない場合は0を返す
  return list.length && list.map(d => d.damage).reduce((a, b) => a + b)
}

/**
 * 予想残りHPを計算する
 * @param HP 現在のHP
 * @param total 合計ダメージ
 * @return 残りHP
 */
export const ExpectRemainingHP = (HP: number, total: number): number => {
  // 残りHPを計算
  const hp = HP - total

  // 0以下なら0にする
  return hp >= 0 ? hp : 0
}

/**
 * フル持越のダメージを計算する
 * @param HP 現在のHP
 * @param maxHP ボスの最大HP
 * @return ダメージ
 */
export const FullCarryOverDamage = (HP: number, maxHP: number): string => {
  // フル持越させるのに必要なダメージの倍率
  const magnification = 4.2857143

  const damage = Math.ceil(HP * magnification)
  if (damage > maxHP) {
    const time = Math.ceil((1 - HP / maxHP) * 90 + 20)
    return `不可(最大${time}秒)`
  } else {
    return damage.to_s()
  }
}

/**
 * 予想残りHPを計算する
 * @param HP 現在のHP
 * @param damage ダメージ
 * @return 持越秒数
 */
export const CalcCarryOver = (HP: number, damage: number): string => {
  const time = Math.ceil((1 - HP / damage) * 90 + 20)
  return HP <= damage ? `${time >= 90 ? '90秒(フル)' : time + '秒'}` : '不可'
}

/**
 * ダメージ報告を削除する
 * @param numbers 通知する番号
 * @param alpha ボス番号
 * @param channel 凸宣言のチャンネル
 */
export const DeleteDamage = async (numbers: string[], alpha: AtoE, channel: Discord.TextChannel) => {
  let damages = await damageList.FetchBoss(alpha)
  // 指定された番号のダメージ報告を除外
  damages = damages.filter(d => !numbers.find(n => n === d.num))

  damages = await damageList.UpdateBoss(alpha, damages)
  await list.SetDamage(alpha, undefined, channel, damages)
}

/**
 * ランダム選択をする
 * @param numbers 通知する番号
 * @param alpha ボス番号
 * @param channel 凸宣言のチャンネル
 */
export const RandomSelection = async (numbers: string[], alpha: AtoE, channel: Discord.TextChannel) => {
  let damages = await damageList.FetchBoss(alpha)

  const dList = excludeNoNumbers(numbers, damages)
  if (!dList.length) return

  const idList = dList.map(d => d.id)
  const names = dList.map(d => d.name).join(' or ')

  const rand = send.CreateRandNumber(idList.length)

  // prettier-ignore
  const text = [
    `${names}`,
    `<@!${idList[rand]}>`,
  ].join('\n')

  const msg = await channel.send(text)
  await msg.react(Settings.EMOJI_ID.SUMI)
}

/**
 * 持越計算をする
 * @param numbers 通知する番号
 * @param alpha ボス番号
 * @param channel 凸宣言のチャンネル
 */
export const CarryoverCalculation = async (numbers: string[], alpha: AtoE, channel: Discord.TextChannel) => {
  const state = await current.Fetch()
  let damages = await damageList.FetchBoss(alpha)

  const dList = excludeNoNumbers(numbers, damages)
  if (!dList.length) return

  const HP = state[alpha].hp

  const A = dList.first()
  if (A.damage === 0) return
  const B = dList.last()
  if (B.damage === 0) return

  // ボスを倒せない場合は終了
  if (A.damage + B.damage < HP) return

  const a = etc.OverCalc(HP, A.damage, B.damage)
  const b = etc.OverCalc(HP, B.damage, A.damage)

  // prettier-ignore
  const text = [
    '```ts',
    `${A.name}: ${a >= 90 ? '90秒(フル)' : a + '秒'}`,
    `${B.name}: ${b >= 90 ? '90秒(フル)' : b + '秒'}`,
    '```',
  ].join('\n')

  const msg = await channel.send(text)
  await msg.react(Settings.EMOJI_ID.SUMI)
}

/**
 * ダメージ計算の除外設定をする
 * @param numbers 通知する番号
 * @param alpha ボス番号
 * @param channel 凸宣言のチャンネル
 */
export const ExclusionSettings = async (numbers: string[], alpha: AtoE, channel: Discord.TextChannel) => {
  let damages = await damageList.FetchBoss(alpha)

  const dList = excludeNoNumbers(numbers, damages)
  if (!dList.length) return

  const idList = dList.map(d => d.id)

  damages = damages.map(d => {
    const id = idList.find(id => id === d.id)
    if (!id) return d
    if (d.already) return d

    d.exclusion = !d.exclusion
    return d
  })

  damages = await damageList.UpdateBoss(alpha, damages)
  await list.SetDamage(alpha, undefined, channel, damages)

  // メッセージを削除する際に残像が残るので追加
  await util.Sleep(500)
}

/**
 * 通しの通知とチェックを付ける
 * @param numbers 通知する番号
 * @param alpha ボス番号
 * @param channel 凸宣言のチャンネル
 */
export const ThroughNotice = async (numbers: string[], alpha: AtoE, channel: Discord.TextChannel) => {
  let damages = await damageList.FetchBoss(alpha)

  const dList = excludeNoNumbers(numbers, damages)
  if (!dList.length) return

  const idList = dList.map(l => l.id)
  const mentions = dList.filter(d => d.flag !== 'check').map(d => `<@!${d.id}>`)

  damages = damages.map(d => {
    const id = idList.find(id => id === d.id)
    if (!id) return d
    if (d.already) return d

    d.flag = d.flag === 'check' ? 'none' : 'check'
    return d
  })

  damages = await damageList.UpdateBoss(alpha, damages)
  await list.SetDamage(alpha, undefined, channel, damages)

  if (!mentions.length) return

  for (const mention of mentions) {
    const msg = await channel.send(`${mention} 通し！`)
    msg.react(Settings.EMOJI_ID.SUMI)
  }
}

/**
 * 存在しない番号を省く
 * @param numbers 存在する番号
 * @param damages ダメージ一覧
 * @return 除外したダメージ一覧
 */
const excludeNoNumbers = (numbers: string[], damages: Damage[]): Damage[] => {
  return numbers.map(n => damages.find(d => d.num === n)).filter(n => n) as Damage[]
}
