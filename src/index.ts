import './util/prototype'
import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'
import {Partials, Intents} from './setting'
import {ClientEvent} from './event'
import {CronOperation} from './cron'

export const Client = new Discord.Client({
  partials: Partials,
  intents: Intents,
})

process.on('unhandledRejection', console.dir)

ClientEvent()
CronOperation()

Client.on('rateLimit', info => {
  console.log(info)
})

const token = ThrowEnv('CAL_TOKEN')
Client.login(token)
