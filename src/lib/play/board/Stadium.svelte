<script>
   import Card from './Card.svelte'
   import { dragging } from '$lib/dnd/pointer.js'

   import { stadium, toStadium, cardSelection as selection } from '$lib/stores/player.js'

   /* DnD */

   import { dnd } from '$lib/dnd/actions.js'
   import { draggedCard, source } from '$lib/dnd/store.js'

   const allowDrop = () => $source && $source !== 'slot' && $draggedCard !== $stadium && $selection.length === 1

   function onDragDrop () {
      toStadium()
   }

   const dndConfig = {
      drop: onDragDrop,
      allowDrop
   }

</script>

<div class="p-1 flex justify-center items-center"
   class:pointer-events-auto={!!$stadium || $dragging}
   use:dnd={dndConfig}>
   {#if $stadium}
      <Card card={$stadium} pile="stadium" />
   {/if}
</div>