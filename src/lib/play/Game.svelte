<script>
   import { setContext } from 'svelte'
   import { writable, derived } from 'svelte/store'
   import { cards, autoMulligan } from '$lib/stores/play.js'
   import { copy } from '$lib/util/object.js'
   import { pile, slots } from '$lib/play/stores.js'

   import Board from '$lib/play/Board.svelte'

   $: $cards, resetBoard()

   const deck = pile()
   const hand = pile()
   const prizes = pile()
   const discard = pile()
   const lz = pile()
   const bench = slots()
   const active = writable(null)
   const stadium = writable(null)
   const table = pile()

   setContext('playBoard', {
      deck, hand, prizes, discard, lz,
      active, bench, stadium, table
   })

   const turn = writable(0)
   const vstarUsed = writable(false)
   const gxUsed = writable(false)

   setContext('playStats', {
      turn, vstarUsed, gxUsed
   })

   function loadDeck () {
      let j = 1
      deck.clear()
      for (const card of $cards) {
         for (let i = 1; i <= card.count; i++) {
            const c = copy(card, [ 'count' ])
            c._j = j++ // the cards individual "id" for the playtest session
            deck.push(c)
         }
      }
   }

   const deckValid = derived(cards, $cards => {
      for (const card of $cards) {
         if (card.stage === 'basic') return true
      }
      return false
   })

   function resetBoard () {
      deck.clear()
      loadDeck()

      turn.set(0)
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

   function setup () {
      resetBoard()
      deck.shuffle()
      draw(7)

      for (let i = 0; i < 6; i++) {
         const card = deck.pop()
         if (card) prizes.push(card)
      }
   }

   function startGame () {

      if ($autoMulligan) {
         let mulligans = 0
         let hasBasic = false

         while (!hasBasic) {
            setup()

            for (const card of $hand) {
               if (card.stage === 'basic') hasBasic = true
            }

            if (!hasBasic) mulligans++
         }

         return mulligans
      }

      // else
      setup()
   }

   function startTurn () {
      turn.update(n => n + 1)
      draw()
   }

   function draw (count = 1) {
      for (let i = 0; i < count; i++) {
         if ($deck.length) hand.push(deck.pop())
      }
   }

   setContext('playActions', {
      deckValid,
      resetBoard, startGame, startTurn, draw
   })

</script>

<Board />