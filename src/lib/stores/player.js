import { get, post } from '$lib/util/fetch-web.js'
import { board } from './custom/board.js'
import { pile, slot } from './custom/cards.js'
import { writable } from './custom/writable.js'
import { share, react, publishLog } from './connection.js'
import { fixOld } from './oldCards.js'
import { s } from '$lib/util/strings.js'
import {
   logMove, logSlotMove, logPickup,
   logBenched, logPromoted, logStadium,
   logAttachment, logEvolve
} from './logger.js'

export const {
   cards, deck, hand, prizes, discard, lz,
   bench, active, stadium, table, pickup,
   vstarUsed, gxUsed,
   prizesFlipped, handRevealed, pokemonHidden,
   reset, exportBoard, findSlot
} = board()

export function importDeck (txt, cb, rd = false) {
   const callback = (res) => {
      fixOld(res.cards)
      cards.set(res.cards)
      reset()

      cb(res)
      share('deckLoaded', { deck: res.cards })
      publishLog(rd ? 'random deck ⚆ _ ⚆' : 'Imported deck')
   }

   if (rd) get('/api/dm/random', callback)
   else post(`/api/dm/import`, { input: txt }, callback)
}

export function draw (count = 1, setup = false) {
   const cards = []
   for (let i = 0; i < count; i++) {
      if (deck.get().length) {
         const card = deck.pop()
         hand.push(card)
         cards.push(card._id)
      }
   }

   if (!setup) {
      share('cardsMoved', { cards, from: 'deck', to: 'hand' })
      publishLog(`Drew ${count} ${s('card', count)}`)
   }
}

export function pick (source, count, options = {}) {
   const cards = []

   for (let i = 0; i < count; i++) {
      const card = options.bottom ? source.shift() : source.pop()
      if (card) {
         pickup.push(card)
         cards.push(card._id)
      }
   }

   share('cardsMoved', { cards, from: source.name, to: 'pickup' })
   logPickup(count, source.name, options)
}

export function shuffle () {
   deck.shuffle()
   publishLog('Shuffled Deck')
}

export let cardSelection = pile()
export let slotSelection = pile()

export let selectionPile = null

export function selectCard (card, pile, push = false) {
   slotSelection.clear() // only have 1 of the two selections active at a time
   // allow multi select on the same pile only
   if (!push || selectionPile !== pile) cardSelection.clear()
   if (!cardSelection.get().includes(card)) cardSelection.push(card)
   else cardSelection.remove(card)
   selectionPile = pile
}

export function selectPile (pile) {
   resetSelection()
   for (const card of pile.get()) {
      cardSelection.push(card)
   }
   selectionPile = pile
}

export function selectSlot (slot, push = false) {
   cardSelection.clear()
   if (!push) slotSelection.clear()
   if (!slotSelection.get().includes(slot)) slotSelection.push(slot)
   else slotSelection.remove(slot)
}

/** move the selection to a "pile"  */

export function moveSelection (pile, options = {}) {

   if (cardSelection.get().length) {
      if (selectionPile === pile) return
      if (selectionPile.get && !selectionPile.get().length) return // user cleared the pile with a shortcut while dragging cards from there, which are now not in there anymore

      const ids = []
      const swapIds = []

      const from = selectionPile === 'stadium' ? 'stadium' : selectionPile.name

      let swap = []
      if (options.switch) {
         for (let i = 0; i < cardSelection.get().length; i++) {
            let card = options.bottom ? pile.shift() : pile.pop()
            if (card) swap.push(card)
         }
      }

      for (const card of cardSelection.get()) {
         ids.push(card._id)

         let replacement = null

         if (options.switch) {
            replacement = swap.pop()
            if (replacement) swapIds.push(replacement._id)
         }

         if (from === 'stadium') {
            if (replacement) stadium.set(replacement)
            else stadium.set(null)
         } else {
            if (replacement) selectionPile.swap(card, replacement)
            else selectionPile.remove(card)
         }

         if (options.bottom) pile.unshift(card)
         else pile.push(card)
      }

      share('cardsMoved', { cards: ids, from, to: pile.name })
      if (swapIds.length) {
         if (from === 'stadium') share('stadiumPlayed', { cardId: swapIds[0], from: pile.name })
         else share('cardsMoved', { cards: swapIds, from: pile.name, to: from })
      }

      logMove(cardSelection.get(), from, pile.name, options)

   } else if (slotSelection.get().length) {
      const ids = []

      for (const slot of slotSelection.get()) {
         if (active.get() === slot) active.set(null)
         else bench.remove(slot)

         ids.push(slot.id)

         pile.merge([
            ...slot.trainer.get(),
            ...slot.energy.get(),
            ...slot.pokemon.get()
         ])
      }

      share('slotsMoved', { slots: ids, to: pile.name })
      logSlotMove(slotSelection.get(), pile.name, options)
   }

   if (options.shuffle) pile.shuffle()
   resetSelection()
}

export function toBench () {
   if (cardSelection.get().length) {
      if (selectionPile.get && !selectionPile.get().length) return // see moveSelection

      const ids = []

      const from = selectionPile === 'stadium' ? 'stadium' : selectionPile.name

      for (const card of cardSelection.get()) {
         if (from === 'stadium') stadium.set(null)
         else selectionPile.remove(card)

         const s = slot(card)
         bench.add(s)
         ids.push({ cardId: card._id, slotId: s.id })
      }

      share('cardsBenched', { cards: ids, from })
      logBenched(cardSelection.get(), from)

   } else if (slotSelection.get().length) {

      for (const slot of slotSelection.get()) {
         if (active.get() === slot) {
            active.set(null)
            bench.add(slot)

            share('activeBenched')
         }
      }
   }

   resetSelection()
}

export function toActive () {
   const cs = cardSelection.get()
   if (cs.length) {
      if (cs.length !== 1) return
      if (selectionPile.get && !selectionPile.get().length) return // see moveSelection

      const card = cs[0]

      const from = selectionPile === 'stadium' ? 'stadium' : selectionPile.name

      if (from === 'stadium') stadium.set(null)
      else selectionPile.remove(card)

      if (active.get()) {
         // move the current active out of the way
         bench.add(active.get())
      }
      const s = slot(card)
      active.set(s)

      share('cardPromoted', { cardId: card._id, slotId: s.id, from })
      logPromoted(card, from)

   } else {
      if (slotSelection.get().length !== 1) return
      const slot = slotSelection.get()[0]
      const a = active.get()

      if (slot === a) return

      bench.remove(slot)
      if (a) bench.add(a)
      active.set(slot)

      share('slotPromoted', { slotId: slot.id })
      publishLog(`Moved {${slot.name}} into the Active Spot`)
   }

   resetSelection()
}

export function discardStadium () {
   const st = stadium.get()
   if (st) {
      discard.push(st)
      stadium.set(null)
      share('cardsMoved', { cards: [ st._id ], from: 'stadium', to: 'discard' })
   }
}

export function toStadium () {
   if (cardSelection.get().length !== 1 || selectionPile === 'stadium' || !selectionPile.get().length) return
   const card = cardSelection.get()[0]

   selectionPile.remove(card)

   discardStadium()
   stadium.set(card)

   share('stadiumPlayed', { cardId: card._id, from: selectionPile.name })
   logStadium(card, selectionPile.name)

   resetSelection()
}

export function removeSlot (slot) {
   if (active.get() === slot) active.set(null)
   else bench.remove(slot)
}

export let attaching = writable(false)
export let evolving = writable(false)

export function startAttachEvolve (evo = false) {
   // override the other if both were clicked
   // if clicked twice cancel the process
   attaching.set(!evo && !attaching.get())
   evolving.set(evo && !evolving.get())
}

export function attachSelection (slot) {
   if (!cardSelection.get().length) return

   const ids = []
   const from = selectionPile === 'stadium' ? 'stadium' : selectionPile.name

   for (const card of cardSelection.get()) {
      if (from === 'stadium') stadium.set(null)
      else selectionPile.remove(card)

      ids.push(card._id)

      if (evolving.get()) slot.pokemon.push(card)
      else if (card.card_type === 'trainer') slot.trainer.push(card)
      else slot.energy.push(card)
   }

   share(
      evolving.get() ? 'cardsEvolved' : 'cardsAttached',
      { slotId: slot.id, cards: ids, from }
   )

   if (evolving.get()) logEvolve(slot, cardSelection.get(), from)
   else logAttachment(slot, cardSelection.get(), from)

   resetSelection()
}

export function resetSelection () {
   cardSelection.clear()
   selectionPile = null

   slotSelection.clear()

   attaching.set(false)
   evolving.set(false)
}

export function toggleMarker () {
   if (!slotSelection.get().length) return
   for (const slot of slotSelection.get()) {
      slot.marker.update(b => !b)
      share('markerUpdated', { slotId: slot.id, state: slot.marker.get() })
   }
}

/* full board sharing */

export function shareBoardstate () {
   const deck = cards.get()
   if (deck) share('boardState', { cards: deck, board: exportBoard() })
}

react('joinedRoom', () => {
   shareBoardstate()
})

react('opponentJoined', () => {
   shareBoardstate()
})

/* functions that let the opponent manipulate our board */

react('oppDamageUpdated', ({ slotId, damage }) => {
   const slot = findSlot(slotId)
   slot.damage.set(damage)
})