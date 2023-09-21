<script>
   import { setContext } from 'svelte'
   import { writable, derived } from 'svelte/store'
   import { autoMulligan } from '$lib/stores/settings.js'
   import {
      cards, deck, hand, prizes, discard, lz,
      bench, active, stadium, table,
      vstarUsed, gxUsed,
      draw,
      reset as resetBoard
   } from '$lib/stores/player.js'

   import Board from '$lib/play/Board.svelte'

   $: $cards, resetBoard()

   setContext('playBoard', {
      deck, hand, prizes, discard, lz,
      active, bench, stadium, table
   })

   const turn = writable(0)

   setContext('playStats', {
      turn, vstarUsed, gxUsed
   })

   const deckValid = derived(cards, $cards => {
      for (const card of $cards) {
         if (card.stage === 'basic') return true
      }
      return false
   })

   function setup () {
      resetBoard()
      turn.set(0)

      deck.shuffle()
      draw(7, true)

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

   setContext('playActions', {
      deckValid,
      resetBoard, startGame, startTurn, draw
   })

</script>

<Board />