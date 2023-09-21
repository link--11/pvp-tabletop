import { get, post } from '$lib/util/fetch-web.js'
import { board } from './custom/board.js'
import { pile, slot } from './custom/cards.js'
import { writable } from './custom/writable.js'
import { share, publishLog } from './connection.js'
import { s } from '$lib/util/strings.js'

export const {
   cards, deck, hand, prizes, discard, lz,
   bench, active, stadium, table, pickup,
   vstarUsed, gxUsed,
   prizesFlipped, handRevealed, pokemonHidden,
   reset, exportBoard
} = board()

export function importDeck (txt, cb, rd = false) {
   const callback = (res) => {
      cards.set(res.cards)
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
   publishLog(`Looking at ${count} ${s('card', count)} from ${options.bottom ? 'bottom of ' : ''}${source.name}`)
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

   } else {
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
   }

   if (options.shuffle) pile.shuffle()
   resetSelection()
}

export function toBench () {
   if (cardSelection.get().length) {
      const ids = []

      for (const card of cardSelection.get()) {
         selectionPile.remove(card)
         const s = slot(card)
         bench.add(s)
         ids.push({ cardId: card._id, slotId: s.id })
      }

      share('cardsBenched', { cards: ids, from: selectionPile.name })

   } else {

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
      const card = cs[0]

      selectionPile.remove(card)
      if (active.get()) {
         // move the current active out of the way
         bench.add(active.get())
      }
      const s = slot(card)
      active.set(s)

      share('cardPromoted', { cardId: card._id, slotId: s.id, from: selectionPile.name })

   } else {
      if (slotSelection.get().length !== 1) return
      const slot = slotSelection.get()[0]
      const a = active.get()

      if (slot === a) return

      bench.remove(slot)
      if (a) bench.add(a)
      active.set(slot)

      share('slotPromoted', { slotId: slot.id })
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
   if (cardSelection.get().length !== 1 || selectionPile === 'stadium') return
   const card = cardSelection.get()[0]

   selectionPile.remove(card)

   discardStadium()
   stadium.set(card)

   share('stadiumPlayed', { cardId: card._id, from: selectionPile.name })

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
   const ids = []
   for (const card of cardSelection.get()) {
      if (selectionPile === 'stadium') stadium.set(null)
      else selectionPile.remove(card)

      ids.push(card._id)

      if (evolving.get()) slot.pokemon.push(card)
      else if (card.card_type === 'trainer') slot.trainer.push(card)
      else slot.energy.push(card)
   }

   share(
      evolving.get() ? 'cardsEvolved' : 'cardsAttached',
      { slotId: slot.id, cards: ids, from: selectionPile.name }
   )

   resetSelection()
}

export function resetSelection () {
   cardSelection.clear()
   selectionPile = null

   slotSelection.clear()

   attaching.set(false)
   evolving.set(false)
}