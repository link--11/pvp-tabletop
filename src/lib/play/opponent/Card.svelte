<script>
   import { getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import cardback from '$lib/assets/cardback_int.png'

   const { openDetails } = getContext('boardActions')

   export let card
   export let pile
   export let revealed = true

</script>

<div class="border-2 border-transparent rounded-md">
   {#if revealed}
      <img class="card" src="{cardImage(card, 'xs')}" alt="{card.name}" draggable=false on:dblclick={() => openDetails(card)}>
   {:else}
      <img class="card" src={cardback} alt="Hidden Card" draggable=false>
   {/if}
</div>