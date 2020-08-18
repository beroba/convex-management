import Settings from 'const-settings'
import * as util from '../../util'

export const Report = async () => {
  const channel = util.GetTextChannel(Settings.CONVEX_CHANNEL.SITUATION_ID)
  channel.send('test')
}
