<script>
   import { getContext, setContext, onMount } from 'svelte'
   import { base } from '$app/paths'
   import { pile, slot } from './stores.js'
   import { writable } from '$lib/stores/custom/writable.js'
   import { discordMode } from '$lib/stores/play.js'
   import { dragging } from '$lib/dnd/pointer.js'

   import Hand from './board/Hand.svelte'
   import Deck from './board/Deck.svelte'
   import Discard from './board/Discard.svelte'
   import Prizes from './board/Prizes.svelte'
   import LostZone from './board/LostZone.svelte'
   import Bench from './board/Bench.svelte'
   import Active from './board/Active.svelte'
   import Stadium from './board/Stadium.svelte'
   import Table from './board/Temp.svelte'

   import DndCard from './DndCard.svelte'
   import Controls from './Controls.svelte'

   const { draw } = getContext('playActions')
   const { hand, deck, discard, prizes, lz, bench, active, stadium, table } = getContext('playBoard')

   /* Conditional Windows */

   import Inspection from './dialogs/Inspection.svelte'
   import Selection from './dialogs/Selection.svelte'
   import SlotDetails from './dialogs/SlotDetails.svelte'
   import CardDetails from './dialogs/CardDetails.svelte'
   import Message from './dialogs/Message.svelte'
   import CardMenu from './dialogs/CardMenu.svelte'
   import SlotMenu from './dialogs/SlotMenu.svelte'

   let inspectionModal
   let selectionModal
   let slotModal
   let detailsModal
   let messageAlert
   let cardMenu
   let slotMenu

   function openPile (pile) {
      inspectionModal.open(pile)
   }

   let choice = pile()

   function pick (source, count, options = {}) {

      for (let i = 0; i < count; i++) {
         let card
         if (options.bottom) card = source.shift()
         else card = source.pop()
         if (card) choice.push(card)
      }
      selectionModal.open(!!options.bottom)
   }

   function openSlotDetails (slot) {
      slotModal.open(slot)
   }

   function openDetails (card) {
      detailsModal.open(card)
   }

   function showMessage (message) {
      messageAlert.show(message)
   }

   /* Selections and actions on them */

   let cardSelection = pile()
   let slotSelection = pile()

   let selectionPile = writable(null)

   function openCardMenu (x, y) {
      cardMenu.open(x, y, selectionPile)
   }

   function openSlotMenu (x, y) {
      slotMenu.open(x, y)
   }

   function selectCard (card, pile, push = false) {
      slotSelection.clear() // only have 1 of the two selections active at a time
      // allow multi select on the same pile only
      if (!push || selectionPile !== pile) cardSelection.clear()
      if (!$cardSelection.includes(card)) cardSelection.push(card)
      else cardSelection.remove(card)
      selectionPile = pile
   }

   function selectSlot (slot, push = false) {
      cardSelection.clear()
      if (!push) slotSelection.clear()
      if (!$slotSelection.includes(slot)) slotSelection.push(slot)
      else slotSelection.remove(slot)
   }

   /** move the selection to a "pile"  */
   function moveSelection (pile, options = {}) {
      if ($cardSelection.length) {
         if (selectionPile === pile) return

         let swap = []
         if (options.switch) {
            for (let i = 0; i < $cardSelection.length; i++) {
               let card = options.bottom ? pile.shift() : pile.pop()
               if (card) swap.push(card)
            }
         }

         for (const card of $cardSelection) {
            if (options.switch) {
               const replacement = swap.pop()
               if (replacement) {
                  if (selectionPile === 'stadium') stadium.set(replacement)
                  else selectionPile.swap(card, replacement)
               }
               else selectionPile.remove(card)
            }
            else if (selectionPile === 'stadium') stadium.set(null)
            else selectionPile.remove(card)

            if (options.bottom) pile.unshift(card)
            else pile.push(card)
         }

      } else {

         for (const slot of $slotSelection) {
            if ($active === slot) active.set(null)
            else bench.remove(slot)

            pile.merge([
               ...slot.trainer.get(),
               ...slot.energy.get(),
               ...slot.pokemon.get()
            ])
         }
      }

      if (options.shuffle) pile.shuffle()
      resetSelection()
   }

   function toBench () {
      if ($cardSelection.length) {

         for (const card of $cardSelection) {
            selectionPile.remove(card)
            bench.add(slot(card))
         }

      } else {

         for (const slot of $slotSelection) {
            if ($active === slot) {
               active.set(null)
               bench.add(slot)
            }
         }
      }

      resetSelection()
   }

   function toActive () {
      if ($cardSelection.length) {
         if ($cardSelection.length !== 1) return
         const card = $cardSelection[0]

         selectionPile.remove(card)
         if ($active) {
            // move the current active out of the way
            bench.add($active)
         }
         active.set(slot(card))

      } else {
         if ($slotSelection.length !== 1) return
         const slot = $slotSelection[0]
         if (slot === $active) return

         bench.remove(slot)
         if ($active) bench.add($active)
         active.set(slot)
      }

      resetSelection()
   }

   function toStadium () {
      if ($cardSelection.length !== 1 || selectionPile === 'stadium') return
      const card = $cardSelection[0]

      selectionPile.remove(card)
      if ($stadium) {
         discard.push($stadium)
      }
      stadium.set(card)

      resetSelection()
   }

   function removeSlot (slot) {
      if ($active === slot) active.set(null)
      else bench.remove(slot)
   }

   let attaching = writable(false)
   let evolving = writable(false)

   function startAE (evo = false) { // attach / evolve
      // close any open Deck or Discard pile, so that you can select the pokemon on board
      inspectionModal.close()

      // override the other if both were clicked
      // if clicked twice cancel the process
      attaching.set(!evo && !$attaching)
      evolving.set(evo && !$evolving)
   }

   function attachSelection (slot) {
      for (const card of $cardSelection) {
         if (selectionPile === 'stadium') stadium.set(null)
         else selectionPile.remove(card)

         if ($evolving) slot.pokemon.push(card)
         else if (card.card_type === 'trainer') slot.trainer.push(card)
         else slot.energy.push(card)
      }

      resetSelection()
   }

   function resetSelection () {
      cardSelection.clear()
      selectionPile = null

      slotSelection.clear()

      attaching.set(false)
      evolving.set(false)
   }

   setContext('boardActions', {
      openPile,
      choice, pick,
      openSlotDetails, openDetails,
      showMessage,
      openCardMenu, openSlotMenu,
      cardSelection, slotSelection,
      selectCard, selectSlot,
      moveSelection, resetSelection,
      toBench, toActive, toStadium,
      removeSlot,
      attaching, evolving,
      startAE, attachSelection
   })

   /* Keyboard shortcuts */

   function keydown (e) {
      const key = e.key.toLowerCase()

      if (!isNaN(e.key)) e.altKey ? pick(deck, parseInt(e.key)) : draw(parseInt(e.key))

      else if (key === 'd') moveSelection(discard)
      else if (key === 'h') moveSelection(hand)
      else if (key === 'l') moveSelection(lz)
      else if (key === 'p') moveSelection(prizes)
      else if (key === 'b') toBench()
      else if (key === 'a' && !e.ctrlKey) toActive()
      else if (key === 'g') toStadium()

      else if (key === 's') {
         if ($cardSelection.length || $slotSelection.length) moveSelection(deck, { shuffle: true })
         else deck.shuffle()
      }

      else if (key === 't') moveSelection(deck)
      else if (key === 'm') moveSelection(deck, { bottom: true })

      else if (key === 'w') moveSelection(table)

      else if (key === 'q') startAE(false)
      else if (key === 'e') startAE(true)

      else if (key === 'v') openPile(deck)

      else if (key === 'escape') {
         if (!$dragging) resetSelection() // allow to Esc close popup while dragging a selection from deck
      }
   }

   onMount(() => {
      document.addEventListener('keydown', keydown)
      document.addEventListener('click', resetSelection)
      return () => {
         document.removeEventListener('keydown', keydown)
         document.removeEventListener('click', resetSelection)
      }
   })

   let game // the dom element, for setting css variables on it

   /* Hand Popout */

   let popout
   let broadcast

   function openPopout () {
      popout = window.open(base + '/hand','hand','popup=true,width=1000,height=600')
   }

   const postHand = () => broadcast?.postMessage({ type: 'hand', message: $hand })
   const postSelection = () => broadcast?.postMessage({ type: 'selection', message: $cardSelection })

   function startBroadcast () {
      broadcast = new BroadcastChannel('popout')

      broadcast.addEventListener('message', ({ data }) => {
         const { type, message } = data

         if (type === 'hello') {
            postHand()
         }
         else if (type === 'bye') {
            discordMode.set(!$discordMode)
         }
         else if (type === 'select') {
            const card = $hand.find(c => c._j === message.card._j)
            selectCard(card, hand, message.push)
         }
         else if (type === 'action') {
            if (message === 'discard') moveSelection(discard)
            else if (message === 'hand') moveSelection(hand)
            else if (message === 'lz') moveSelection(lz)
            else if (message === 'prizes') moveSelection(prizes)
            else if (message === 'bench') toBench()
            else if (message === 'active') toActive()
            else if (message === 'stadium') toStadium()
            else if (message === 'deck') moveSelection(deck, { shuffle: true })
            else if (message === 'top') moveSelection(deck)
            else if (message === 'bottom') moveSelection(deck, { bottom: true })
            else if (message === 'table') moveSelection(table)
            else if (message === 'attach') startAE(false)
            else if (message === 'evolve') startAE(true)
            else if (message === 'reset') resetSelection()
            else if (message === 'swap') moveSelection(deck, { switch: true })
            else if (message === 'details') openDetails($cardSelection[0])
         }
         else if (type === 'key') {
            keydown(message)
         }
      })

      openPopout()
   }

   $: {
      if ($discordMode) startBroadcast()
      else {
         popout?.close()
         broadcast?.close()
         popout, broadcast = null
      }
   }

   $: $hand, postHand()
   $: $cardSelection, postSelection()
</script>

<DndCard />

<div class="fixed top-0 left-0 w-screen h-screen bg-gray-100 overflow-y-auto">
   <div class="game flex flex-col h-full max-w-[1920px] m-auto select-none relative" bind:this={game}>

      <Controls {game} />

      <CardMenu bind:this={cardMenu} selection={cardSelection} />
      <SlotMenu bind:this={slotMenu} selection={slotSelection} />

      <Inspection bind:this={inspectionModal} />
      <Selection bind:this={selectionModal} />
      <SlotDetails bind:this={slotModal} />
      <CardDetails bind:this={detailsModal} />

      <div class="gameboard min-h-0 relative flex-1">

         <div class="prizes">
            <Prizes />
         </div>
         <div class="stadium">
            <Stadium />
         </div>
         <div class="active">
            <Active />
         </div>
         <div class="bench">
            <Bench />
         </div>
         <div class="lz">
            <LostZone />
         </div>
         <div class="deck">
            <Deck />
         </div>
         <div class="discard">
            <Discard />
         </div>
         <div class="hand">
            <Hand />
         </div>
         <div class="play">
            <Table />
         </div>
      </div>

      <Message bind:this={messageAlert} />

   </div>
</div>

<style>
   :global(.dragover) {
      @apply bg-green-100;
   }

   :global(.dragged) {
      @apply opacity-50;
   }

   .game {
      --card-width: 136px;
      --card-height: 189px;
   }

   .game :global(img.card) {
      width: var(--card-width);
      height: auto;
      filter: drop-shadow(1px 1px 2px var(--shadow-color));
   }

   .gameboard {
      display: grid;
      grid-template-columns: 1fr 1fr 2fr 1fr 1fr;
      grid-template-rows: repeat(4, 1fr);
      grid-template-areas:
         "prizes stadium active play lz"
         "prizes . active play deck"
         "prizes bench bench bench discard"
         "hand hand hand hand hand";
      column-gap: 1rem;
   }

   /* https://css-tricks.com/preventing-a-grid-blowout/ */
   .gameboard > div {
      min-width: 0;
   }

   .gameboard > div > :global(div:first-child) {
      @apply w-full h-full;
   }

   .prizes {
      grid-area: prizes;
   }

   .stadium {
      grid-area: stadium;
   }

   .active {
      grid-area: active;
   }

   .bench {
      grid-area: bench;
   }

   .lz {
      grid-area: lz;
   }

   .deck {
      grid-area: deck;
   }

   .discard {
      grid-area: discard;
   }

   .hand {
      grid-area: hand;
      border-top: 2px solid var(--text-color);
   }

   .play {
      grid-area: play;
   }
</style>