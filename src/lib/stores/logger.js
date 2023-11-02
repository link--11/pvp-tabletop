import { s } from '$lib/util/strings.js'
import { publishLog } from './connection.js'
import { prizesFlipped, handRevealed, pokemonHidden, findSlot } from './player.js'

const slotRegex = /^([0-9a-z-]{36}).(pokemon|trainer|energy)$/i

function isPublicMove (from, to) {
   const zones = {
      hand: handRevealed.val,
      deck: false,
      discard: true,
      lz: true,
      prizes: prizesFlipped.val,
      stadium: true,
      table: true,
      pickup: false,
      play: !pokemonHidden.val
   }

   const fromPublic = zones[from] || slotRegex.test(from)
   const toPublic = zones[to] || slotRegex.test(to)

   return fromPublic || toPublic
}

const piles = {
   hand: 'Hand',
   deck: 'Deck',
   discard: 'Discard',
   lz: 'Lost Zone',
   prizes: 'Prizes',
   bench: 'Bench',
   active: 'Active',
   stadium: 'Stadium',
   table: 'Table',
   pickup: 'Picked Up',
   play: 'Play'
}

function pileName (key) {
   let regexRes = null

   if (key in piles) return piles[key]
   else if (regexRes = slotRegex.exec(key)) {
      const slot = findSlot(regexRes[1])
      return slot.pokemon.get().at(-1)?.name || 'Play'
   }

   return key
}

function names (array) {
   return array.map(el => el.name).join(', ')
}

export function logMove (cards, from, to, options = {}) {
   const fromName = pileName(from)
   const toName = pileName(to)

   if (isPublicMove(from, to)) {
      if (options.switch) publishLog(`Switched [${names(cards)}] from ${fromName} with ${s('card', cards.length)} from ${toName}`)
      else if (options.shuffle) publishLog(`Shuffled [${names(cards)}] from ${fromName} into ${toName}`)
      else publishLog(`Moved [${names(cards)}] from ${options.top ? 'top of ' : ''}${fromName} to ${options.bottom ? 'bottom of ' : ''}${toName}`)
   } else {
      const a = `${cards.length} ${s('card', cards.length)}`
      if (options.switch) publishLog(`Switched ${a} from ${fromName} with ${s('card', cards.length)} from ${toName}`)
      else if (options.shuffle) publishLog(`Shuffled ${a} from ${fromName} into ${toName}`)
      else publishLog(`Moved ${a} from ${options.top ? 'top of ' : ''}${fromName} to ${options.bottom ? 'bottom of ' : ''}${toName}`)
   }
}

export function logSlotMove (slots, to, options) {
   if (isPublicMove('play', to)) {
      if (options.shuffle) publishLog(`Shuffled {${names(slots)}} from Play into ${pileName(to)}`)
      else publishLog(`Moved {${names(slots)}} from Play to ${options.bottom ? 'bottom of ' : ''}${pileName(to)}`)
   } else {
      if (options.shuffle) publishLog(`Shuffled ${slots.length} Pokémon from Play into ${pileName(to)}`)
      else publishLog(`Moved ${slots.length} Pokémon from Play to ${options.bottom ? 'bottom of ' : ''}${pileName(to)}`)
   }
}

export function logPickup (count, from, options) {
   publishLog(`Picked up ${count} ${s('card', count)} from ${options.bottom ? 'bottom of ' : ''}${pileName(from)}`)
}

export function logBenched (cards, from) {
   if (isPublicMove(from, 'play')) {
      publishLog(`Moved [${names(cards)}] from ${pileName(from)} to Bench`)
   } else {
      publishLog(`Moved ${cards.length} ${s('card', cards.length)} from ${pileName(from)} to Bench`)
   }
}

export function logPromoted (card, from) {
   if (isPublicMove(from, 'play')) {
      publishLog(`Moved [${card.name}] from ${pileName(from)} to Active`)
   } else {
      publishLog(`Moved 1 card from ${pileName(from)} to Active`)
   }
}

export function logAttachment (slot, cards, from) {
   publishLog(`Attached [${names(cards)}] from ${pileName(from)} to {${slot.name}}`)
}

export function logEvolve (slot, cards, from) {
   publishLog(`Evolved {${slot.pokemon.get().at(-(cards.length+1)).name}} into [${names(cards)}] from ${pileName(from)}`)
}

export function logStadium (card, from) {
   publishLog(`Moved [${card.name}] from ${pileName(from)} to Stadium`)
}