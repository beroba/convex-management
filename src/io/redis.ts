import IORedis from 'ioredis'
import ThrowEnv from 'throw-env'

// redisの初期設定
const REDIS_URL = ThrowEnv('REDIS_URL')
const redis = new IORedis(REDIS_URL)

/**
 * キャルステータスの値を取得する
 * @param id 更新したいステータスのid
 * @return 取得したjsonの情報
 */
export const Fetch = async <T>(id: string): Promise<T> => {
  const json = await redis.get(id)
  return JSON.parse(json ?? '')
}

/**
 * キャルステータスの値を更新する
 * @param id 更新したいステータスのid
 * @param json 更新させたいjsonの情報
 */
export const UpdateArray = async <T>(id: string, json: T) => {
  await redis.set(id, JSON.stringify(json))
}

/**
 * キャルステータスの値を更新する
 * @param id 更新したいステータスのid
 * @param json 更新させたいjsonの情報
 */
export const UpdateJson = async <T>(id: string, json: T) => {
  await redis.set(id, JSON.stringify(json))
}
