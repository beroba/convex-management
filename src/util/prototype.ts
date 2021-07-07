export {}

declare global {
  interface Array<T> {
    /**
     * 配列の最初の要素を取得
     */
    first(): T
    /**
     * 配列の最後の要素を取得
     */
    last(): T
  }

  interface Number {
    /**
     * String()する
     */
    to_s(): string
  }

  interface String {
    /**
     * Number()する
     */
    to_n(): number
  }
}

Array.prototype.first = function <T>(): T {
  return this[0]
}

Array.prototype.last = function <T>(): T {
  return this[this.length - 1]
}

Number.prototype.to_s = function (): string {
  return String(this)
}

String.prototype.to_n = function (): number {
  return Number(this)
}
