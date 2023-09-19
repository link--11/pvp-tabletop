import { copy } from '$lib/util/object.js'
import { writable } from './writable.js'
import { pile, slots } from './cards.js'

export function board () {

   const cards = writable([])

   const deck = pile('deck')
   const hand = pile('hand')
   const prizes = pile('prizes')
   const discard = pile('discard')
   const lz = pile('lz')
   const bench = slots()
   const active = writable(null)
   const stadium = writable(null)
   const table = pile('table')

   const vstarUsed = writable(false)
   const gxUsed = writable(false)

   function loadDeck () {
      let j = 1
      deck.clear()
      for (const card of cards.get()) {
         for (let i = 1; i <= card.count; i++) {
            const c = copy(card, [ 'count' ])
            c._id = j++ // the cards individual "id" for the playtest session
            deck.push(c)
         }
      }
   }

   function reset () {
      deck.clear()
      loadDeck()

      vstarUsed.set(false)
      gxUsed.set(false)

      hand.clear()
      prizes.clear()
      discard.clear()
      lz.clear()
      bench.clear()
      active.set(null)
      stadium.set(null)
      table.clear()
   }

   function exportBoard () {
      const expPile = (p) => p.get().map(card => card._id)
      const expSlot = (s) => ({
         id: s.id,
         pokemon: expPile(s.pokemon),
         energy: expPile(s.energy),
         trainer: expPile(s.trainer),
         damage: s.damage.get()
      })

      return {
         deck: expPile(deck),
         hand: expPile(hand),
         prizes: expPile(prizes),
         discard: expPile(discard),
         lz: expPile(lz),
         active: active.get() ? expSlot(active.get()) : null,
         bench: bench.get().map(slot => expSlot(slot)),
         stadium: stadium.get()?._id,
         table: expPile(table),
         vstarUsed: vstarUsed.get(),
         gxUsed: gxUsed.get()
      }
   }

   return {
      cards, deck, hand, prizes, discard, lz,
      bench, active, stadium, table,
      vstarUsed, gxUsed,
      exportBoard, reset
   }
}
