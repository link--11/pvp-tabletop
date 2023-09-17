<script>
   import { getContext } from 'svelte'
   import Slot from './Slot.svelte'
   import { ctrlA } from '$lib/actions/customEvents.js'

   const { active, bench } = getContext('playBoard')
   const { toBench, resetSelection, selectSlot } = getContext('boardActions')

   /* DnD */

   import { dnd } from '$lib/dnd/actions.js'
   import { draggedCard, source } from '$lib/dnd/store.js'

   const allowDrop = () => $source && $source !== 'stadium' && ($source !== 'slot' || $draggedCard === $active)

   function onDragDrop () {
      toBench()
   }

   const dndConfig = {
      drop: onDragDrop,
      allowDrop
   }

   function selectAll () {
      resetSelection()
      for (const slot of $bench) {
         selectSlot(slot, true)
      }
   }

</script>

<div class="p-1 focus:outline-none" use:dnd={dndConfig}
   tabindex="0" use:ctrlA on:ctrlA={selectAll}>

   <div class="px-1">Bench ({$bench.length})</div>

   <div class="flex gap-4">
      {#each $bench as slot (slot.id)}
         <Slot bind:slot={slot} />
      {/each}
   </div>
</div>