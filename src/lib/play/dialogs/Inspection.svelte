<script>
   import Card from '../board/Card.svelte'
   import Popup from './Popup.svelte'

   import { deck } from '$lib/stores/player.js'

   let pile = null
   let popup

   let view = 'natural'

   $: reversedPile = $pile ? $pile.slice().reverse() : []
   $: sortedPile = reversedPile.slice().sort((a, b) => a._id - b._id)

   export function open (_pile) {
      pile = _pile
      popup.open()
   }

   export function close () {
      popup.close()
   }

   function closeAndShuffle () {
      popup.close()
      deck.shuffle()
   }
</script>

<Popup bind:this={popup}>
   <div class="flex">
      <button class="flex-1 tab rounded-tl-md" class:active={view === 'natural'} on:click={() => view = 'natural'}>Natural</button>
      <button class="flex-1 tab rounded-tr-md" class:active={view === 'sorted'} on:click={() => view = 'sorted'}>Sorted</button>
   </div>
   <div class="flex flex-wrap gap-1 p-2 inspection">
      {#if view === 'sorted'}
         {#each sortedPile as card (card._id)}
            <Card {card} pile={pile} />
         {/each}
      {:else}
         {#each reversedPile as card (card._id)}
            <Card {card} pile={pile} />
         {/each}
      {/if}
   </div>

   <svelte:fragment slot="buttons">
      <button class="action" on:click={() => popup.close()}>Close</button>
      {#if pile === deck}
         <button class="action" on:click={closeAndShuffle}>Close & Shuffle</button>
      {/if}
   </svelte:fragment>
</Popup>

<style>
   .inspection {
      --card-width: 136px;
      --card-height: 189px;
   }

   button.tab {
      @apply p-2 font-bold;
   }

   button.tab.active {
      @apply text-white bg-[var(--primary-color)];
   }

   button.action {
      @apply px-3 py-2 rounded-lg font-bold text-white bg-[var(--primary-color)];
   }

   div :global(img.card) {
      --shadow-color: transparent; /* the shadow makes it harder to see the active selection on the gray background */
   }
</style>