import * as Discord from 'discord.js'
import moji from 'moji'
import Option from 'type-of-option'

/**
 * TLを正しい書式に整形させる、
 * timeが指定されていた場合は、その持ち越し秒数にする
 * @param tl 整形させるTL
 * @param time 持ち越し秒数
 * @param msg DiscordからのMessage
 */
export const TL = async (tl: string, time: Option<string>, msg: Discord.Message) => {
  // TLの整形をする
  const content = new Generate(tl, time) // 元になるクラスを生成
    .zenkakuToHankaku() // 全角を半角に変換
    .bracketSpaceAdjustment() // 括弧の前後スペースを調整
    .timeParser() // 時間のパースをする
    .toCodeBlock() // コードブロックにする
    .alignVertically() // TLの縦を合わせる
    .removeSomeSecond() // 先頭が同じ秒数なら消す
    .carryOverCalc() // 持ち越し計算をする
    .toString() // 文字列に戻す

  msg.reply(content)
}

class Generate {
  tl: string
  time: Option<number>

  /**
   * TLを整形させるクラス
   * @param tl 整形させるTL
   * @param time 持ち越し秒数
   */
  constructor(tl: string, time: Option<string>) {
    this.tl = tl
    this.time = this.convertTime(time)
  }

  /**
   * 受け取った持ち越し秒数から引き算する秒数を算出
   * @param time 持ち越し秒数
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
      t = 90 - Number(time)
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
   * 括弧の前後スペースを調整する
   * @return this
   */
  bracketSpaceAdjustment(): this {
    this.tl = this.tl.replace(/ *\( */g, '(').replace(/ *\) */g, ')')
    this.tl = this.tl.replace(/\(/g, ' (').replace(/\)/g, ') ')
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
      // 数字以外は次へ
      if (!/\d/.test(tl[i])) continue

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
    // スペースを1つにする
    this.tl = this.tl.replace(/\u200B/g, '').replace(/ +/g, ' ')
    this.tl = this.tl
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
   * 持ち越し計算をする
   * @return this
   */
  carryOverCalc(): this {
    // 持ち越し秒数を指定されていない場合は終了
    if (!this.time) return this
    const time = this.time

    // TLの秒数を持ち越し時間の分引いたリストを作る
    const list = this.tl.match(/\d:\d\d/g)?.map(v => {
      // :で区切った両端をpとqに代入
      const [p, q] = v.split(':').map(Number)
      // 現在の秒数-持ち越し秒数を計算
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

    // /*
    // 1行づつ分解
    const tl = this.tl.split('\n')

    // 0以下の秒数の場所を取得
    const i = tl.findIndex(v => /0:00|0:-/.test(v))

    // 0以下の秒数がなければ終了
    if (i === -1) return this

    // 0以下の秒数より後のTLを省いて結合
    this.tl = tl.slice(0, i).join('\n') + '```'
    // */

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
