<script>
   import Slot from './Slot.svelte'

   import { active, toActive, slotSelection, cardSelection } from '$lib/stores/player.js'

   /* DnD */

   import { dnd } from '$lib/dnd/actions.js'
   import { draggedCard, source } from '$lib/dnd/store.js'

   const allowDrop = () => $source && $source !== 'stadium' && $draggedCard !== $active
      && ($slotSelection.length <= 1 && $cardSelection.length <= 1)

   function onDragDrop () {
      // if the drop caused an attach / evolve on the child Slot, the selection is empty by now and the call will do nothing
      toActive()
   }

   const dndConfig = {
      drop: onDragDrop,
      allowDrop
   }

</script>

<div use:dnd={dndConfig}>
   <div class="h-full flex justify-center items-center">
      {#if $active}
         {#key $active.id}
            <Slot bind:slot={$active} />
         {/key}
      {/if}
   </div>
</div>