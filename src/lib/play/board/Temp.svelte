<script>
   import { getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import Pile from './Pile.svelte'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'

   import { table, selectPile, cardSelection } from '$lib/stores/player.js'
   const { openPile } = getContext('boardActions')

   $: top = $table[$table.length - 1]

   function selected (selection) {
      for (const card of $table) {
         if (selection.includes(card)) return true
      }
      return false
   }

   function selectAll () {
      selectPile(table)
   }

   /* DnD */

   import { dnd } from '$lib/dnd/actions.js'
   import { draggedCard, source } from '$lib/dnd/store.js'
   import { dragging } from '$lib/dnd/pointer.js'

   function onDragStart () {
      draggedCard.set(top)
      source.set(table)
   }

   function onDrag ({ $card }) {
      if ($card !== top) return
      if (!$cardSelection.includes(top)) {
         selectAll()
      }
   }

   const dndConfig = {
      start: onDragStart,
      drag: onDrag
   }

   function onCtx (e) {
      if (!$table.length) {
         e.stopPropagation() // don't open the menu if table is empty
      }
   }

</script>

<Pile pile={table} name="Table" displayCount={false}>
   <div class="h-full flex justify-center items-center" on:contextmenu={onCtx}>
      <div class="relative w-max"
         style="margin-bottom: {($table.length - 1) * 35}px; margin-right: {$table.length > 1 ? 20 : 0}px"
         class:selected={selected($cardSelection)}
         class:dragged={$dragging && $cardSelection.includes(top)}
         on:click|stopPropagation={selectAll}
         on:dblclick={() => openPile(table)}
         use:dnd={dndConfig}>

         {#if $table.length > 0}
            <img class="card" src="{cardImage($table[0], 'xs')}" alt={$table[0].name} draggable="false">
            {#each $table as card, i (card._id)}
               {#if i >= 1}
                  <img class="card absolute" src="{cardImage(card, 'xs')}" alt={card.name} draggable="false"
                     style="bottom: -{i * 35}px; left: {i % 2 !== 0 ? 20 : 0}px">
               {/if}
            {/each}
         {/if}
      </div>
   </div>

   <svelte:fragment slot="menu">
      <ContextMenuOption click={() => openPile(table)} text="View All" shortcut="w" />
   </svelte:fragment>
</Pile>

<style>
   .selected {
      --drop-shadow-color: #fbbf24;
      filter: drop-shadow(0px 0px 10px var(--drop-shadow-color)) !important;
   }
</style>