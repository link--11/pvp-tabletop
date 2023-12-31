<script>
   import { getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import { holdingCtrlOrCmd } from '$lib/util/ctrlcmd.js'
   import { share } from '$lib/stores/connection.js'

   import {
      discard, slotSelection as selection, selectSlot, removeSlot,
      attaching, evolving, attachSelection, cardSelection
   } from '$lib/stores/player.js'

   const { openSlotDetails, openSlotMenu, openDetails } = getContext('boardActions')

   export let slot

   $: ({ pokemon, trainer, energy, damage, marker } = slot)
   $: if (!$pokemon.length) {
      // discard the slot if it contains no pokemon (they can be moved away through the details view)
      discard.merge([ ...$trainer, ...$energy ])

      share('cardsMoved', { cards: $trainer.map(card => card._id), from: trainer.name, to: 'discard' })
      share('cardsMoved', { cards: $energy.map(card => card._id), from: energy.name, to: 'discard' })

      removeSlot(slot)

      share('slotDiscarded', { slotId: slot.id })
   }

   $: top = $pokemon[ $pokemon.length - 1]

   /* DnD */

   import { dnd } from '$lib/dnd/actions.js'
   import { draggedCard, source } from '$lib/dnd/store.js'
   import { dragging } from '$lib/dnd/pointer.js'

   const allowDrop = () => $source && $source !== 'slot' && $source !== 'stadium'

   function onDragStart () {
      draggedCard.set(slot)
      source.set('slot')
   }

   function onDrag ({ $card }) {
      if ($card !== slot) return
      if (!$selection.includes(slot)) {
         selectSlot(slot)
      }
   }

   function onDragDrop () {
      if (!$attaching && !$evolving && $cardSelection.reduce((b, card) => b && card.card_type === 'pokemon', true)) {
         // neutral drag + all dragged cards are Pokémon, do evolve instead of attaching
         evolving.set(true)
      }
      attachSelection(slot)
   }

   const dndConfig = {
      start: onDragStart,
      drag: onDrag,
      drop: onDragDrop,
      allowDrop
   }

   /* selections analog zu Card.svelte */

   function onClick (e) {
      if ($attaching || $evolving) attachSelection(slot)
      else if (e.altKey) openDetails(top)
      else if (e.shiftKey) openSlotDetails(slot)
      else selectSlot(slot, holdingCtrlOrCmd(e))
   }

   function onCtx (e) {
      if (!$selection.includes(slot)) {
         selectSlot(slot, false)
      }

      openSlotMenu(e.clientX, e.clientY)
   }
</script>

<div class="slot relative w-max z-15" style="margin-right: calc({$energy.length * 25 + $trainer.length * 35}px * var(--card-scale))"
   class:dragged={$dragging && $selection.includes(slot)}
   on:click|stopPropagation={onClick}
   on:contextmenu={onCtx}
   on:dblclick={() => openSlotDetails(slot)}
   use:dnd={dndConfig}>

   {#if $damage}
      <span class="counter absolute bottom-1 left-1 z-15 rounded-full p-4 bg-red-500 text-white font-bold flex justify-center items-center">{$damage}</span>
   {/if}

   {#if $marker}
      <span class="counter absolute top-1 right-1 z-15 rounded-full p-4 bg-yellow-500 text-white font-bold flex justify-center items-center"></span>
   {/if}

   {#if top}
      <img src="{cardImage(top, 'xs')}" alt="{top.name}" draggable=false
         class="card pokemon relative z-10"
         class:selected={$selection.includes(slot)}
         class:target={$attaching || $evolving}
         class:attach={$attaching} class:evolve={$evolving}>
   {/if}

   {#each $energy as nrg, i (nrg._id)}
      <img src="{cardImage(nrg, 'xs')}" alt="{nrg.name}" class="card absolute" draggable=false
         style="bottom: calc(17px * var(--card-scale)); left: calc({(i + 1)* 25}px * var(--card-scale)); z-index: {9 - i}">
   {/each}

   {#each $trainer as tool, i (tool._id)}
      <img src="{cardImage(tool, 'xs')}" alt="{tool.name}" class="card absolute" draggable=false
         style="bottom: calc(34px * var(--card-scale)); left: calc({$energy.length * 25 + (i + 1) * 35}px * var(--card-scale)); z-index: {9 - i - $energy.length}">
   {/each}
</div>

<style>
   img.card {
      @apply box-content border-2 border-transparent rounded-md;
   }

   img.card.selected {
      @apply border-[var(--selection-color)];
   }

   .target {
      filter: drop-shadow(0px 0px 10px var(--drop-shadow-color)) !important;
   }

   .target.attach {
      --drop-shadow-color: purple;
   }

   .target.evolve {
      --drop-shadow-color: blue;
   }

   :global(.slot.dragover) .pokemon {
      @apply border-green-500;
   }

   .counter {
      width: calc(calc(var(--card-width) * var(--card-scale)) / 2.5);
      height: calc(calc(var(--card-width) * var(--card-scale)) / 2.5);
   }
</style>