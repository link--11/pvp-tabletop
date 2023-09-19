<script>
   import { onDestroy, getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import { share } from '$lib/stores/connection.js'

   const { discard } = getContext('playBoard')
   const {
      openSlotDetails,
      slotSelection: selection, selectSlot, removeSlot, openSlotMenu,
      attaching, evolving, attachSelection, cardSelection
   } = getContext('boardActions')

   export let slot

   $: ({ pokemon, trainer, energy, damage } = slot)
   $: if (!$pokemon.length) {
      // discard the slot if it contains no pokemon (they can be moved away through the details view)
      discard.merge([ ...$trainer, ...$energy ])

      share('cardsMoved', { cards: $trainer.map(card => card._id), from: trainer.name, to: 'discard' })
      share('cardsMoved', { cards: $energy.map(card => card._id), from: energy.name, to: 'discard' })

      trainer.clear()
      energy.clear()
      removeSlot(slot)

      share('slotDiscarded', { slotId: slot.id })
   }

   $: top = $pokemon[ $pokemon.length - 1]

   const unsub = slot.damage.subscribe(value => {
      share('damageUpdated', { slotId: slot.id, damage: value })
	})
	onDestroy(unsub)

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
      e.stopPropagation()
      if ($attaching || $evolving) attachSelection(slot)
      else selectSlot(slot, e.ctrlKey)
   }

   function onCtx (e) {
      e.preventDefault()

      if (!$selection.includes(slot)) {
         selectSlot(slot, false)
      }

      openSlotMenu(e.clientX, e.clientY)
   }
</script>

<div class="slot relative w-max z-15" style="margin-right: {$energy.length * 25 + $trainer.length * 35}px"
   class:dragged={$dragging && $selection.includes(slot)}
   on:click={onClick}
   on:contextmenu={onCtx}
   on:dblclick={() => openSlotDetails(slot)}
   use:dnd={dndConfig}>

   {#if $damage}
      <span class="counter absolute bottom-1 left-1 z-15 rounded-full p-4 bg-red-500 text-white font-bold flex justify-center items-center">{$damage}</span>
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
         style="bottom: 15px; left: {(i + 1)* 25}px; z-index: {9 - i}">
   {/each}

   {#each $trainer as tool, i (tool._id)}
      <img src="{cardImage(tool, 'xs')}" alt="{tool.name}" class="card absolute" draggable=false
         style="bottom: 30px; left: {$energy.length * 25 + (i + 1) * 35}px; z-index: {9 - i - $energy.length}">
   {/each}
</div>

<style>
   img.card {
      @apply box-content border-2 border-transparent rounded-md;
   }

   img.card.selected {
      @apply border-yellow-400;
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
      width: calc(var(--card-width) / 2.5);
      height: calc(var(--card-width) / 2.5);
   }
</style>