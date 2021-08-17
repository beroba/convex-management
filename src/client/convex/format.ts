import * as Discord from 'discord.js'
import moji from 'moji'
import Option from 'type-of-option'
import Settings from 'const-settings'
import * as util from '../../util'
import {TLList, TLFormat} from '../../util/type'

/**
 * TLを正しい書式に整形させる、
 * timeが指定されていた場合は、その持越秒数にする
 * @param tl 整形させるTL
 * @param time 持越秒数
 * @param msg DiscordからのMessage
 * @param flag extendのフォーマットにするかの真偽値
 */
export const TL = async (tl: string, time: Option<string>, msg: Discord.Message, flag = false) => {
  // prettier-ignore
  // TLの整形をする
  const content = (await new Generate(tl, time, flag) // 元になるクラスを生成
    .zenkakuToHankaku() // 全角を半角に変換
    .bracketSpaceAdjustment() // 括弧の前後スペースを調整
    .extendFormat()) // smicle好みにTLを修正する
    .timeParser() // 時間のパースをする
    .toCodeBlock() // コードブロックにする
    .alignVertically() // TLの縦を合わせる
    .removeSomeSecond() // 先頭が同じ秒数なら消す
    .carryOverCalc() // 持越計算をする
    .toString() // 文字列に戻す

  msg.reply(content)
}

class Generate {
  tl: string
  time: Option<number>
  flag: boolean

  /**
   * TLを整形させるクラス
   * @param tl 整形させるTL
   * @param time 持越秒数
   * @param flag extendのフォーマットにするかの真偽値
   */
  constructor(tl: string, time: Option<string>, flag: boolean) {
    this.tl = tl
    this.time = this.convertTime(time)
    this.flag = flag
  }

  /**
   * 受け取った持越秒数から引き算する秒数を算出
   * @param time 持越秒数
   * @return 引き算する秒数
   */
  private convertTime(time: Option<string>): Option<number> {
    // 秒数がない場合はnullを返す
    if (!time) return null

    let t: number

    // :がある場合とない場合に分ける
    if (/:/.test(time)) {
      const [p, q] = time.split(':').map(Number)
      t = 90 - (p * 60 + q)
    } else {
      t = 90 - time.to_n()
    }

    // 0以下ならnull、91以上なら90にする
    return t <= 0 ? null : t >= 91 ? 90 : t
  }

  /**
   * 全角を半角に置き換える
   * @return this
   */
  zenkakuToHankaku(): this {
    this.tl = moji(this.tl).convert('ZE', 'HE').convert('ZS', 'HS').toString()
    return this
  }

  /**
   * smicle好みにTLを修正する
   * @returns this
   */
  async extendFormat(): Promise<this> {
    // `/cb tle`じゃない場合は終了
    if (!this.flag) return this

    let tl: string[]
    tl = this.tl.split('\n')

    // 説明の保存
    const explanation: TLList = {}
    explanation.index = tl.indexOf('クランモード')
    explanation.list = tl.splice(explanation.index, 13)

    // バトル開始の行を取り除く
    const i = tl.indexOf('バトル開始')
    tl.splice(i, 1)

    this.tl = tl.join('\n')

    // 記号の部分を修正
    this.tl = this.tl
      .replace(/\n{2,}/g, '\n')
      .replace(/=/g, '')
      .replace(/-/g, '')
      .replace(/~/g, '')
      .replace(/\( ?\(/g, '(')
      .replace(/\) ?\)/g, ')')

    // オートを修正
    this.tl = this.tl
      .replace(/ オート /g, ' (オート) ')
      .replace(/ ?オート$/g, ' (オート)')
      .replace(/ ?オート\n/g, ' (オート)\n')
      .replace(/オートon/g, 'オートON')
      .replace(/オートoff/g, 'オートOFF')
      .replace(/オートオン/g, 'オートON')
      .replace(/オートオフ/g, 'オートOFF')
      .replace(/^オートON\n/gi, '――――オートON――――\n')
      .replace(/\nオートON\n/gi, '\n――――オートON――――\n')
      .replace(/\nオートOFF\n/gi, '\n――――オートOFF――――\n')

    // その他の部分を修正
    this.tl = this.tl
      .replace(/ub/g, 'UB')
      .replace(/敵UB/gi, 'ボスUB')
      .replace(/hit/g, 'Hit')
      .replace(/ 連打$/g, '')
      .replace(/ 連打\n/g, '\n')
      .replace(/\s討伐/, ' バトル終了')

    // TL修正用のリストを作成
    const modify = await this.fetchTextToModify()
    // リストをもとに修正
    modify.forEach(l => (this.tl = this.tl.replace(new RegExp(l.before, 'gi'), l.after)))

    // 説明を元に戻す
    tl = this.tl.split('\n')
    tl.splice(explanation.index, 0, ...explanation.list)
    this.tl = tl.join('\n')

    return this
  }

  /**
   * #tl修正の名前変更一覧からTL修正用のリストを作成
   * @returns TL修正用のリスト
   */
  async fetchTextToModify(): Promise<TLFormat[]> {
    // TL修正で使うチャンネルを取得
    const channel = util.GetTextChannel(Settings.CHANNEL_ID.TL_FORMAT)
    const msgs = (await channel.messages.fetch()).map(m => m)

    // 修正用のリストを取得
    const list = await Promise.all(msgs.map(m => m.content.replace(/\`\`\`\n?/g, '')))

    return list
      .join('\n') // 複数のリストを結合
      .split('\n') // 改行で分割
      .filter(l => l) // 空の行を取り除く
      .map(l => l.replace(/\(/g, '\\(').replace(/\)/g, '\\)')) // 括弧の前にスラッシュを入れる
      .map(l => l.replace(/:\s*/, ':').split(':')) // `:`で分割
      .map(l => ({before: l[0], after: l[1]})) // TLFormatの形に変更
  }

  /**
   * 括弧の前後スペースを調整する
   * @return this
   */
  bracketSpaceAdjustment(): this {
    this.tl = this.tl.replace(/ *\( */g, '(').replace(/ *\) */g, ')')
    this.tl = this.tl.replace(/\(/g, ' (').replace(/\)/g, ') ')
    this.tl = this.tl.replace(/^ \(/g, '(')
    return this
  }

  /**
   * 時間の形を整形する
   * @return this
   */
  timeParser(): this {
    this.tl = this.tl.replace(/\./g, ':')

    // 1文字づつ分解
    const tl = this.tl.split('')

    for (let i = 0; i < tl.length; i++) {
      /*
      // 星の場合は数字の先まで飛ばす
      if (/★/.test(tl[i])) {
        i = this.countUpToChar(tl, i + 1)
        continue
      }

      // Lvの場合は数字の先まで飛ばす
      if (/Lv/i.test(tl[i] + tl[i + 1])) {
        i = this.countUpToChar(tl, i + 2)
        continue
      }

      // RANKの場合は数字の先まで飛ばす
      if (/RANK/i.test(tl[i] + tl[i + 1] + tl[i + 2] + tl[i + 3])) {
        i = this.countUpToChar(tl, i + 4)
        continue
      }
      // */

      // 数字以外は次へ
      if (!/\d/.test(tl[i])) continue

      if (/:/.test(tl[i + 2])) {
        // NN:NNなので先頭のNを消す
        tl[i] = ''
        continue
      }

      if (/:/.test(tl[i + 1])) {
        // :の次が数字でないなら次へ
        if (!/\d/.test(tl[i + 2])) continue

        if (/\d/.test(tl[i + 3])) {
          // N:NNなので次へ
          if (!/\d/.test(tl[i + 4])) {
            i += 3
            continue
          }

          // N:NNN*なので、数字以外になるまでカウンターを進める
          i = this.countUpToChar(tl, i + 4)
        } else {
          // N:N→N:0N
          i += 2
          tl[i] = `0${tl[i]}`
        }
      } else if (/\d/.test(tl[i + 1])) {
        if (!/\d/.test(tl[i + 2])) {
          // NN→0:NN
          tl[i] = `0:${tl[i]}`
          i++
          continue
        }

        if (/\d/.test(tl[i + 3])) {
          // NNNN*なので、数字以外になるまでカウンターを進める
          i = this.countUpToChar(tl, i + 3)
        } else {
          // 0NNと1NNだけ:を入れる
          if (/0|1/.test(tl[i])) {
            // 0NN,1NN→0:NN,1:NN
            tl[i] = `${tl[i]}:`
          }
          i += 2
        }
      } else {
        // 先頭でない場合は次へ
        if (!/\n/.test(tl[i - 1])) continue
        // N→0:0N
        tl[i] = `0:0${tl[i]}`
      }
    }

    // 全ての文字を結合
    this.tl = tl.join('')

    // 秒を消す
    this.tl = this.tl.replace(/秒/g, '')

    return this
  }

  /**
   * 数字以外になるまでカウンタを進める
   * @param tl TL
   * @param i カウンタ
   * @returns 返却するカウンタ
   */
  private countUpToChar(tl: string[], i: number): number {
    for (; i < tl.length; i++) {
      if (!/\d/.test(tl[i])) break
    }
    return i
  }

  /**
   * コードブロックじゃない場合はコードブロックにする
   * @return this
   */
  toCodeBlock(): this {
    if (!/\`\`\`/.test(this.tl)) {
      this.tl = `\`\`\`\n` + this.tl + `\`\`\``
    }
    return this
  }

  /**
   * TLの縦を合わせる
   * @return this
   */
  alignVertically(): this {
    this.tl = this.tl
      .replace(/\u200B/g, '') // ゼロ幅スペースを潰す
      .replace(/ +/g, ' ') // スペースを1つにする
      .replace(/\n\s*┗/g, ' ') // 改行後の┗を改行ごと消す
      .replace(/\n\s*→/g, '\n ') // 改行後のスペース矢印を消す
      .replace(/→/g, '\n ') // 矢印を改行にする
      .replace(/ +/g, ' ') // スペースを1つにする
      .split('\n') // 1行づつ分解
      // 行頭の秒数の後ろにスペースを入れる
      .map(l => {
        // 先頭文字が数字でない場合は処理しない
        if (!/^\d/.test(l)) return l
        // 5文字目がスペースの場合は処理しない
        if (/ /.test(l[4])) return l
        // 5文字目にスペースを挿入
        return `${l.slice(0, 4)} ${l.slice(4)}`
      })
      .map(l => (/ /.test(l[0]) ? `    ${l}` : l)) // 先頭がスペースの場合は4文字スペースを追加する
      .map(l => l.replace(/ +$/g, '')) // 行末のスペースを取り除く
      .join('\n') // 全ての行を結合
    return this
  }

  /**
   * 先頭が同じ秒数なら消す
   * @return this
   */
  removeSomeSecond(): this {
    this.tl = this.tl
      .split('\n') // 1行づつ分解
      .map((l, i, arr) => {
        // 1行目の場合は処理しない
        if (!i) return l
        // 現在の行の先頭4文字と1行前の先頭4文字が一致していない場合は処理しない
        if (l.slice(0, 4) !== arr[i - 1].slice(0, 4)) return l
        // 先頭4文字をスペースに置き換える
        return `    ${l.slice(4)}`
      })
      .join('\n') // 全ての行を結合
    return this
  }

  /**
   * 持越計算をする
   * @return this
   */
  carryOverCalc(): this {
    // 持越秒数を指定されていない場合は終了
    if (!this.time) return this
    const time = this.time

    // TLの秒数を持越時間の分引いたリストを作る
    const list = this.tl.match(/\d:\d\d/g)?.map(v => {
      // :で区切った両端をpとqに代入
      const [p, q] = v.split(':').map(Number)
      // 現在の秒数-持越秒数を計算
      const t = p * 60 + q - time
      // N:NNの形に戻す
      return `${(t / 60) | 0}:${((t % 60) + '').padStart(2, '0')}`
    })
    if (!list) return this

    // 秒数を順番に取り出すクラスを作成
    const times = this.order(list)

    this.tl = this.tl
      .replace(/\d:\d\d/g, '１') // N:NNの場所を存在しない１に一時的に置き換える
      .split('') // 1文字づつ分解
      .map(tl => (/１/.test(tl) ? times.pop() : tl)) // １を秒数に置き換える
      .join('') // 全ての行を結合

    // 1行づつ分解
    const tl = this.tl.split('\n')

    // 行頭が0:00未満の場所を取得
    const i = tl.findIndex(v => /^0:-/.test(v))

    // 0未満の秒数がなければ終了
    if (i === -1) return this

    // 0未満の秒数より後のTLを省いて結合
    this.tl = tl.slice(0, i).join('\n') + '```'

    // `0:-`を全て削除
    this.tl = this.tl.replace(/0:-/g, '')

    return this
  }

  /**
   * 引数に渡された秒数を順番に取り出すクラスを作成する
   * @param list 秒数のリスト
   * @returns 秒数を順番に取り出すクラス
   */
  private order(list: string[]) {
    class Order {
      list: string[]
      count: number

      /**
       * 秒数を順番に取り出すクラス
       * @param list 秒数のリスト
       */
      constructor(list: string[]) {
        this.list = list
        this.count = 0
      }

      /**
       * 秒数を順番に取り出し、カウントを進める
       * @returns 秒数
       */
      pop() {
        return this.list[this.count++]
      }
    }
    return new Order(list)
  }

  /**
   * 文字列に変換する
   * @return 整形したTL
   */
  toString(): string {
    return this.tl
  }
}
