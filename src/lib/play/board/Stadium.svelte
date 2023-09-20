<script>
   import { getContext } from 'svelte'
   import Card from './Card.svelte'
   import { dragging } from '$lib/dnd/pointer.js'

   const { stadium } = getContext('playBoard')
   const { toStadium, cardSelection: selection } = getContext('boardActions')

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