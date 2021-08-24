import './util/prototype'
import * as Discord from 'discord.js'
import ThrowEnv from 'throw-env'
import {Partials, Intents} from './init/setting'
import {ClientEvent} from './init/event'
import {CronOperation} from './cron'

export const Client = new Discord.Client({
  partials: Partials,
  intents: Intents,
})

ClientEvent()
CronOperation()

const token = ThrowEnv('CAL_TOKEN')
Client.login(token)
