import { writable } from './custom/writable.js'

export let cards = writable([])
export let autoMulligan = writable(true)
export let discordMode = writable(false)