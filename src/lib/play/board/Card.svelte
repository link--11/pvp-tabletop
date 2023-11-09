<script>
   import { getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import { dnd } from '$lib/dnd/actions.js'
   import { draggedCard, source } from '$lib/dnd/store.js'
   import { dragging } from '$lib/dnd/pointer.js'
   import cardback from '$lib/assets/cardback_int.png'

   import { cardSelection as selection, selectCard } from '$lib/stores/player.js'
   const { openDetails, openCardMenu } = getContext('boardActions')

   export let card
   export let pile
   export let revealed = true

   function onDragStart () {
      draggedCard.set(card)
      source.set(pile)
   }

   function onDrag ({ $card }) {
      if ($card !== card) return
      if (!$selection.includes(card)) {
         selectCard(card, pile, false)
      }
   }

   const dndConfig = {
      start: onDragStart,
      drag: onDrag
   }

   function onClick (e) {
      // further up is a click listener that reset the selection, so stop that
      e.stopPropagation()

      selectCard(card, pile, e.ctrlKey) // if ctrl is pressed, add to selection instead of overwriting
   }

   function onCtx (e) {
      e.stopPropagation() // to not get overridden by the pile level context menu

      if (!$selection.includes(card)) {
         selectCard(card, pile, false)
      }

      openCardMenu(e.clientX, e.clientY, revealed)
   }

</script>

<div
   on:click={onClick}
   on:contextmenu={onCtx}
   on:dblclick={() => openDetails(card)}
   class="border-2 border-transparent rounded-md"
   class:dragged={$dragging && $selection.includes(card)}
   class:selected={$selection.includes(card)}
   use:dnd={dndConfig}>

   {#if revealed}
      <img class="card" src="{cardImage(card, 'xs')}" alt="{card.name}" draggable=false>
   {:else}
      <img class="card" src={cardback} alt="Hidden Card" draggable=false>
   {/if}
</div>

<style>
   .selected {
      @apply border-[var(--selection-color)];
      --shadow-color: transparent;
   }
</style>