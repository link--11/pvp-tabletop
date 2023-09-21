import { board } from './custom/board.js'
import { slot } from './custom/cards.js'
import { socket } from './connection.js'
import { discardStadium } from './player.js'

export const {
   cards, deck, hand, prizes, discard, lz,
   bench, active, stadium, table, pickup,
   vstarUsed, gxUsed,
   prizesFlipped, handRevealed, pokemonHidden,
   reset
} = board()

const reload = (deck) => {
   cards.set(deck)
   reset()
}

const removeCard = (id, pile) => {
   if (pile === stadium) {
      const card = stadium.get()
      stadium.set(null)
      return card

   } else {
      const card = pile.get().find(card => card._id === id)
      pile.remove(card)
      return card
   }
}

const moveCards = (ids, source, target) => {
   for (const id of ids) {
      const card = removeCard(id, source)
      target.push(card)
   }
}

const findSlot = (slotId) => {
   if (active.get()?.id === slotId) return active.get()
   else return bench.get().find(s => s.id === slotId)
}

const removeSlot = (slot) => {
   if (active.get() === slot) active.set(null)
   else bench.remove(slot)
}

socket.on('leftRoom', () => {
   reload([])
})

socket.on('opponentLeft', () => {
   reload([])
})

socket.on('boardState', ({ cards, board }) => {
   reload(cards)
   // all cards are in deck now, move them to where they should be

   moveCards(board.hand, deck, hand)
   moveCards(board.prizes, deck, prizes)
   moveCards(board.discard, deck, discard)
   moveCards(board.lz, deck, lz)
   moveCards(board.table, deck, table)

   const importSlot = (data) => {
      const p = slot(null, data.id)
      moveCards(data.pokemon, deck, p.pokemon)
      moveCards(data.energy, deck, p.energy)
      moveCards(data.trainer, deck, p.trainer)
      p.damage.set(data.damage)
      return p
   }

   for (const e of board.bench) {
      bench.add(importSlot(e))
   }

   if (board.active) active.set(importSlot(board.active))

   if (board.stadium) {
      const card = removeCard(board.stadium, deck)
      stadium.set(card)
   }

   if (board.vstarUsed) vstarUsed.set(true)
   if (board.gxUsed) gxUsed.set(true)
   if (board.pokemonHidden) pokemonHidden.set(true)
   if (board.prizesFlipped) prizesFlipped.set(true)
   if (board.handRevealed) handRevealed.set(true)
})

socket.on('deckLoaded', ({ deck }) => {
   reload(deck)
})

socket.on('boardReset', () => {
   reset()
})

socket.on('cardsMoved', ({ cards, from, to }) => {
   const pile1 = getPile(from)
   const pile2 = getPile(to)

   for (const id of cards) {
      pile2.push(removeCard(id, pile1))
   }
})

socket.on('slotsMoved', ({ slots, to }) => {
   const pile = getPile(to)

   for (const id of slots) {
      const slot = findSlot(id)
      removeSlot(slot)

      pile.merge([
         ...slot.trainer.get(),
         ...slot.energy.get(),
         ...slot.pokemon.get()
      ])
   }
})

socket.on('cardsBenched', ({ cards, from }) => {
   const pile = getPile(from)

   for (const { cardId, slotId } of cards) {
      const card = removeCard(cardId, pile)
      bench.add(slot(card, slotId))
   }
})

socket.on('activeBenched', () => {
   const slot = active.get()
   active.set(null)
   bench.add(slot)
})

socket.on('cardPromoted', ({ cardId, slotId, from }) => {
   const card = removeCard(cardId, getPile(from))
   if (active.get()) bench.add(active.get())
   active.set(slot(card, slotId))
})

socket.on('slotPromoted', ({ slotId }) => {
   const pokemon = bench.get().find(s => s.id === slotId)
   bench.remove(pokemon)
   if (active.get()) bench.add(active.get())
   active.set(pokemon)
})

socket.on('cardsEvolved', ({ slotId, cards, from }) => {
   const slot = findSlot(slotId)
   const pile = getPile(from)

   for (const id of cards) {
      const card = removeCard(id, pile)
      slot.pokemon.push(card)
   }
})

socket.on('cardsAttached', ({ slotId, cards, from }) => {
   const slot = findSlot(slotId)
   const pile = getPile(from)

   for (const id of cards) {
      const card = removeCard(id, pile)
      if (card.card_type === 'trainer') slot.trainer.push(card)
      else slot.energy.push(card)
   }
})

socket.on('damageUpdated', ({ slotId, damage }) => {
   const slot = findSlot(slotId)
   slot.damage.set(damage)
})

socket.on('slotDiscarded', ({ slotId }) => {
   const slot = findSlot(slotId)
   removeSlot(slot)
})

socket.on('stadiumPlayed', ({ cardId, from }) => {
   const card = removeCard(cardId, getPile(from))
   stadium.set(card)
   // discard your own stadium (if applicable) as a response
   discardStadium()
})

socket.on('pokemonToggle', ({ hidden }) => {
   pokemonHidden.set(hidden)
})

socket.on('prizeToggle', ({ flipped }) => {
   prizesFlipped.set(flipped)
})

socket.on('handToggle', ({ revealed }) => {
   handRevealed.set(revealed)
})

/* helper */

const slotRegex = /^([0-9a-z-]{36}).(pokemon|trainer|energy)$/i

function getPile (name) {
   let regexRes = null

   if (name === 'hand') return hand
   else if (name === 'deck') return deck
   else if (name === 'prizes') return prizes
   else if (name === 'discard') return discard
   else if (name === 'lz') return lz
   else if (name === 'table') return table
   else if (name === 'pickup') return pickup

   else if (regexRes = slotRegex.exec(name)) {
      const id = regexRes[1]
      const type = regexRes[2]
      const slot = findSlot(id)
      return slot[type]
   }

   else if (name === 'stadium') return stadium
}