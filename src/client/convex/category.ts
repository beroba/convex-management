import * as Discord from 'discord.js'
import Settings from 'const-settings'
import * as bossTable from '../../io/bossTable'

/**
 * クラバト用のカテゴリーとチャンネルを作成する
 * 引数がある場合は引数の年と日で作成し、ない場合は現在の年と日で作成する
 * @param year 作成する年
 * @param month 作成する月
 * @param msg DiscordからのMessage
 */
export const Create = async (year: number, month: number, msg: Discord.Message) => {
  const [adoptTitle, draftTitle] = ['採用', '立案'].map(t => `${year}年${month}月クラバト-${t}`)
  const [adoptPermit, draftPermit] = settingPermit(msg)
  const [adoptChannels, draftChannels] = await createChannelName(month)

  // カテゴリーの作成
  const adoptCategory = await msg.guild?.channels.create(adoptTitle, {
    type: 'category',
    position: Settings.CATEGORY.POSITION,
    permissionOverwrites: adoptPermit,
  })
  const draftCategory = await msg.guild?.channels.create(draftTitle, {
    type: 'category',
    position: Settings.CATEGORY.POSITION,
    permissionOverwrites: draftPermit,
  })

  // チャンネルの作成し初回メッセージを送信
  await Promise.all(
    adoptChannels.map(async name => {
      const c = await msg.guild?.channels.create(name, {type: 'text', parent: adoptCategory?.id})
      c?.send(name)
    })
  )
  await Promise.all(
    draftChannels.map(async name => {
      const c = await msg.guild?.channels.create(name, {type: 'text', parent: draftCategory?.id})
      c?.send(name)
    })
  )

  msg.reply(`${year}年${month}月のカテゴリーを作成したわよ！`)
}

/**
 * 不要になったクラバト用のカテゴリーとチャンネルを削除する
 * @param year 作成する年
 * @param month 作成する月
 * @param msg DiscordからのMessage
 */
export const Delete = async (year: number, month: number, msg: Discord.Message) => {
  // カテゴリーが見つからなかった場合終了
  const categorys = msg.guild?.channels.cache
    .filter(c => new RegExp(`${year}年${month}月クラバト`, 'ig').test(c.name))
    .map(c => c)
  if (!categorys?.length) return msg.reply(`${year}年${month}月クラバトなんてないんだけど！`)

  for (const category of categorys) {
    const channels = category.guild.channels.cache.filter(c => c.parentID === category.id)

    // カテゴリとチャンネルを削除
    await category?.delete()
    // 表示バグが発生してしまうので削除する際に時間の猶予を持たせている
    channels?.forEach(c => setTimeout(() => c.delete(), 1000))
  }

  msg.reply(`${year}年${month}月のカテゴリーを削除したわ`)
}

// prettier-ignore
/**
 * クラバト用カテゴリーの権限を設定
 * @param msg DiscordからのMessage
 * @return 設定した権限
 */
const settingPermit = (msg: Discord.Message): [Discord.OverwriteResolvable[], Discord.OverwriteResolvable[]] => {
  const roles = msg.guild?.roles
  // 各ロールがあるか確認
  const leader        = roles?.cache.get(Settings.ROLE_ID.LEADER)?.id         ?? ''
  const subLeader     = roles?.cache.get(Settings.ROLE_ID.SUB_LEADER)?.id     ?? ''
  const progress      = roles?.cache.get(Settings.ROLE_ID.PROGRESS)?.id       ?? ''
  const clanMembers   = roles?.cache.get(Settings.ROLE_ID.CLAN_MEMBERS)?.id   ?? ''
  const sisterMembers = roles?.cache.get(Settings.ROLE_ID.SISTER_MEMBERS)?.id ?? ''
  const tomodachi     = roles?.cache.get(Settings.ROLE_ID.TOMODACHI)?.id      ?? ''
  const everyone      = roles?.everyone.id ?? ''

  // カテゴリーの権限を設定
  return [
    [
      {id: leader,        allow: ['MENTION_EVERYONE']                     },
      {id: subLeader,     allow: ['MANAGE_MESSAGES']                      },
      {id: progress,      allow: ['MANAGE_MESSAGES']                      },
      {id: clanMembers,   allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']},
      {id: sisterMembers, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']},
      {id: tomodachi,     allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']},
      {id: everyone,      deny:  ['VIEW_CHANNEL', 'MENTION_EVERYONE']     },
    ],
    [
      {id: leader,        allow: ['MENTION_EVERYONE']                },
      {id: subLeader,     allow: ['MANAGE_MESSAGES']                 },
      {id: progress,      allow: ['MANAGE_MESSAGES']                 },
      {id: clanMembers,   allow: ['VIEW_CHANNEL']                    },
      {id: sisterMembers, allow: ['VIEW_CHANNEL']                    },
      {id: tomodachi,     allow: ['VIEW_CHANNEL']                    },
      {id: everyone,      deny:  ['VIEW_CHANNEL', 'MENTION_EVERYONE']},
    ]
  ]
}

/**
 * 作成するチャンネル名のリストを返す
 * @param month 現在の月
 * @return チャンネル名のリスト
 */
const createChannelName = async (month: number): Promise<[string[], string[]]> => {
  // キャルステータスからボステーブルを取得
  const table = await bossTable.Fetch()

  // ボスの名前を取得
  const [a, b, c, d, e] = table.map(t => t.name)

  return [
    [
      `${month}月-採用凸ルート`,
      `${month}月-${a}`,
      `${month}月-${b}`,
      `${month}月-${c}`,
      `${month}月-${d}`,
      `${month}月-${e}`,
    ],
    [
      `${month}月-凸ルート案`,
      `45-${a}`,
      `45-${b}`,
      `45-${c}`,
      `45-${d}`,
      `45-${e}`,
      `3-${a}`,
      `3-${b}`,
      `3-${c}`,
      `3-${d}`,
      `3-${e}`,
      `12-${a}`,
      `12-${b}`,
      `12-${c}`,
      `12-${d}`,
      `12-${e}`,
      `${month}月-持越編成`,
    ],
  ]
}
