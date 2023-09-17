<script>
   import { getContext } from 'svelte'
   import { draggedCard, source, dragOffset } from '$lib/dnd/store.js'
   import { pos, dragging } from '$lib/dnd/pointer.js'
   import { cardImage } from '$lib/util/assets.js'

   const { cardSelection, slotSelection } = getContext('boardActions')

   let card
   let selection
   $: {
      if ($source === 'slot') {
         const $pokemon = $draggedCard.pokemon.get()
         card = $pokemon[$pokemon.length - 1]
         selection = slotSelection
      }
      else {
         card = $draggedCard
         selection = cardSelection
      }
   }
</script>

{#if $dragging && card}
   <div class="absolute z-20 pointer-events-none select-none" style="top: {$pos.y - $dragOffset.y}px; left: {$pos.x - $dragOffset.x}px;">
      {#if $selection.length > 1}
         <span class="absolute top-0 right-0 transform translate-x-[50%] translate-y-[-50%] px-2 py-1 rounded-full bg-dark-500 text-white font-bold">{$selection.length}</span>
      {/if}
      <img src={cardImage(card, 'xs')} alt={card.name}>
   </div>
{/if}