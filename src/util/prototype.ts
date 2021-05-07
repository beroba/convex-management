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
}

Array.prototype.first = function <T>(): T {
  return this[0]
}

Array.prototype.last = function <T>(): T {
  return this[this.length - 1]
}
