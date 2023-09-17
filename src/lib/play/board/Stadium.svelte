<script>
   import { getContext } from 'svelte'
   import Card from './Card.svelte'

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

<div class="p-1" use:dnd={dndConfig}>
   <div class="px-1">Stadium</div>
   <div class="flex">
      {#if $stadium}
         <Card card={$stadium} pile="stadium" />
      {/if}
   </div>
</div>