<script>
   import { setContext, onMount } from 'svelte'
   import { dragging } from '$lib/dnd/pointer.js'
   import { pick, shuffle, pokemonHidden, handRevealed } from '$lib/stores/player.js'

   import Hand from './board/Hand.svelte'
   import Deck from './board/Deck.svelte'
   import Prizes from './board/Prizes.svelte'
   import Discard from './board/Discard.svelte'
   import LostZone from './board/LostZone.svelte'
   import Bench from './board/Bench.svelte'
   import Active from './board/Active.svelte'
   import Stadium from './board/Stadium.svelte'
   import Table from './board/Temp.svelte'

   import DndCard from './DndCard.svelte'
   import Controls from './Controls.svelte'

   import OppHand from './opponent/Hand.svelte'
   import OppDeck from './opponent/Deck.svelte'
   import OppPrizes from './opponent/Prizes.svelte'
   import OppDiscard from './opponent/Discard.svelte'
   import OppLostZone from './opponent/LostZone.svelte'
   import OppBench from './opponent/Bench.svelte'
   import OppActive from './opponent/Active.svelte'
   import OppStadium from './opponent/Stadium.svelte'
   import OppTable from './opponent/Temp.svelte'

   import Inspection from './dialogs/Inspection.svelte'
   import Selection from './dialogs/Selection.svelte'
   import SlotDetails from './dialogs/SlotDetails.svelte'
   import CardDetails from './dialogs/CardDetails.svelte'
   import Message from './dialogs/Message.svelte'
   import CardMenu from './dialogs/CardMenu.svelte'
   import SlotMenu from './dialogs/SlotMenu.svelte'

   import OppInspection from './dialogs/OppInspection.svelte'
   import OppSlotDetails from './dialogs/OppSlotDetails.svelte'
   import OppSlotMenu from './dialogs/OppSlotMenu.svelte'

   import {
      hand, deck, discard, prizes, lz, table,
      draw,
      cardSelection, slotSelection, selectionPile, selectPile,
      moveSelection, toBench, toActive, toStadium,
      startAttachEvolve,
      resetSelection, toggleMarker
   } from '$lib/stores/player.js'

   let inspectionModal
   let selectionModal
   let slotModal
   let detailsModal
   let messageAlert
   let cardMenu
   let slotMenu

   let oppInspectionModal
   let oppSlotModal
   let oppSlotMenu

   function openPile (pile) {
      inspectionModal.open(pile)
   }

   function openOppPile (pile) {
      oppInspectionModal.open(pile)
   }

   function openSelection (source, count, options = {}) {
      pick(source, count, options)
      selectionModal.open(!!options.bottom, source)
   }

   function openSlotDetails (slot) {
      slotModal.open(slot)
   }

   function openOppSlotDetails (slot) {
      oppSlotModal.open(slot)
   }

   function openDetails (card) {
      detailsModal.open(card)
   }

   function showMessage (message) {
      messageAlert.show(message)
   }

   function openCardMenu (x, y, revealed = true) {
      cardMenu.open(x, y, selectionPile, revealed)
   }

   function openSlotMenu (x, y) {
      slotMenu.open(x, y)
   }

   function openOppSlotMenu (x, y, slot) {
      oppSlotMenu.open(x, y, slot)
   }

   function startAE (evo = false) { // attach / evolve
      // close any open Deck or Discard pile, so that you can select the pokemon on board
      inspectionModal.close()

      startAttachEvolve(evo)
   }

   setContext('boardActions', {
      openPile, openOppPile,
      openSelection,
      openSlotDetails, openOppSlotDetails,
      openDetails, showMessage,
      openCardMenu, openSlotMenu, openOppSlotMenu,
      startAE
   })

   /* Keyboard shortcuts */

   function keydown (e) {
      const key = e.key.toLowerCase()

      if (!isNaN(e.key)) e.altKey ? openSelection(deck, parseInt(e.key)) : draw(parseInt(e.key))

      else if (key === 'd') moveSelection(discard)
      else if (key === 'h') moveSelection(hand)
      else if (key === 'l') moveSelection(lz)
      else if (key === 'p') moveSelection(prizes)
      else if (key === 'b') toBench()
      else if (key === 'a' && !e.ctrlKey) toActive()
      else if (key === 'g') toStadium()

      else if (key === 's') {
         if ($cardSelection.length || $slotSelection.length) moveSelection(deck, { shuffle: true })
         else shuffle()
      }

      else if (key === 't') moveSelection(deck)
      else if (key === 'm') moveSelection(deck, { bottom: true })

      else if (key === 'q') startAE(false)
      else if (key === 'e') startAE(true)

      else if (key === 'v') openPile(deck)
      else if (key === 'u') toggleMarker(deck)

      else if (key === 'w') moveSelection(table) // older version table shortcut without the extra functionality
      else if (key === 'x') {
         if ($cardSelection.length) moveSelection(table)
         else if ($table.length) {
            selectPile(table)
            moveSelection(hand)
         }
      }

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

</script>

<DndCard />

<Controls />

<div class="h-screen overflow-y-auto flex-1">
   <div class="game flex flex-col h-full max-w-[1920px] m-auto select-none relative">

      <CardMenu bind:this={cardMenu} selection={cardSelection} />
      <SlotMenu bind:this={slotMenu} selection={slotSelection} />

      <Inspection bind:this={inspectionModal} />
      <Selection bind:this={selectionModal} />
      <SlotDetails bind:this={slotModal} />
      <CardDetails bind:this={detailsModal} />

      <OppInspection bind:this={oppInspectionModal} />
      <OppSlotDetails bind:this={oppSlotModal} />
      <OppSlotMenu bind:this={oppSlotMenu} />

      <div class="gameboard min-h-0 relative flex-1">

         <div class="hand2 flip">
            <OppHand />
         </div>

         <div class="prizes2 flip">
            <OppPrizes />
         </div>

         <div class="deck2 flip">
            <OppDeck />
         </div>

         <div class="discard2 flip">
            <OppDiscard />
         </div>

         <div class="lz2 flip">
            <OppLostZone />
         </div>

         <div class="bench2 flip">
            <OppBench />
         </div>

         <div class="play2 flip">
            <OppTable />
         </div>

         <div class="play">
            <Table />
         </div>

         <div class="stadium2 flip">
            <OppStadium />
         </div>

         <div class="stadium">
            <Stadium />
         </div>

         <div class="active">
            <div class="active2 flip">
               <OppActive />
            </div>
            <div class="active1">
               <Active />
            </div>
         </div>

         <div class="bench">
            <Bench />
         </div>

         <div class="veil" class:applied={$pokemonHidden}></div>

         <div class="lz">
            <LostZone />
         </div>

         <div class="discard">
            <Discard />
         </div>

         <div class="deck">
            <Deck />
         </div>

         <div class="prizes">
            <Prizes />
         </div>

         <div class="hand" class:revealed={$handRevealed}>
            <Hand />
         </div>
      </div>

      <Message bind:this={messageAlert} />

   </div>
</div>

<style>
   :global(.dragover) {
      background: rgba(187, 247, 208, 0.5);
   }

   :global(.dragged) {
      @apply opacity-50;
   }

   .game {
      --card-width: 105px;
      --card-height: 145px;
   }

   .game :global(img.card) {
      filter: drop-shadow(1px 1px 2px var(--shadow-color));
   }

   .gameboard {
      display: grid;
      grid-template-columns: 0.8fr 0.8fr 1fr 1.5fr 1fr 0.8fr 0.8fr;
      grid-template-rows: 0.9fr 1fr 1fr 1fr 1fr 0.9fr;
      grid-template-areas:
         "hand2 hand2 hand2 hand2 hand2 hand2 hand2"
         ". discard2 bench2 bench2 bench2 prizes2 prizes2"
         "lz2 deck2 stadium active play prizes2 prizes2"
         "prizes prizes stadium active play deck lz"
         "prizes prizes bench bench bench discard ."
         "hand hand hand hand hand hand hand";
      column-gap: var(--scaled-rem);
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
      z-index: 10; /* above opponent's stadium! */
      pointer-events: none; /* to click on opp stadium below - overwritten when own stadium is in play */
   }

   .active {
      grid-area: active;
      display: grid;
      grid-template-rows: 1fr 1fr;
      position: relative;
   }

   .active1 {
      grid-row: 2;
      grid-column: 1;
   }

   .active2 {
      grid-row: 1;
      grid-column: 1;
   }

   .active:before {
      content: ' ';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      background-image: url('/pokeball.svg');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      pointer-events: none;
   }

   .active > div > :global(div:first-child) {
      @apply w-full h-full;
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

   .hand.revealed {
      background: rgba(254, 249, 195, 0.5);
   }

   .play {
      grid-area: play;
      z-index: 10; /* shares table space with opp */
   }

   .prizes2 {
      grid-area: prizes2;
   }

   .bench2 {
      grid-area: bench2;
   }

   .lz2 {
      grid-area: lz2;
   }

   .deck2 {
      grid-area: deck2;
   }

   .discard2 {
      grid-area: discard2;
   }

   .hand2 {
      grid-area: hand2;
      border-top: 2px solid var(--text-color);
   }

   .play2 {
      grid-area: play;
   }

   .stadium2 {
      grid-area: stadium;
   }

   .flip {
      transform: scale(-1, -1);
   }

   .flip :global(img.card) {
      filter: drop-shadow(-1px -1px 2px var(--shadow-color));
   }

   .veil {
      pointer-events: none;
      grid-row-start: prizes;
      grid-row-end: bench;
      grid-column-start: stadium;
      grid-column-end: bench;
   }

   .veil.applied {
      background-color: rgba(50,50,50,0.3);
      z-index: 15;
   }

</style>