<script>
   import Card from '../board/Card.svelte'
   import Popup from './Popup.svelte'
   import { ctrlA } from '$lib/actions/customEvents.js'
   import { share, publishLog } from '$lib/stores/connection.js'
   import { logMove } from '$lib/stores/logger.js'

   import { deck, discard, hand, lz, pickup, shuffle, selectPile } from '$lib/stores/player.js'

   let popup

   $: if (popup && $pickup.length === 0) popup.close()

   // to know where where to "put back" the cards when closed
   let bottom = false
   let origin

   export function open (_bottom = false, _origin = deck) {
      bottom = _bottom
      origin = _origin
      popup.open()
   }

   function putBack () {
      const cards = []

      while ($pickup.length) {
         const card = pickup.pop()
         if (bottom) origin.unshift(card)
         else origin.push(card)

         cards.push(card._id)
      }

      if (cards.length) {
         share('cardsMoved', { cards, from: 'pickup', to: origin.name })
         publishLog('Put back the remaining cards')
      }
   }

   function closeAndMove (pile) {
      const cards = $pickup.slice()
      popup.close()
      pile.merge($pickup)
      pickup.clear()

      share('cardsMoved', { cards: cards.map(card => card._id), from: 'pickup', to: pile.name })
      logMove(cards, 'pickup', pile.name)
   }

   function closeAndReturn () {
      popup.close()
      putBack()
   }

   function closeAndShuffle () {
      closeAndMove(deck)
      shuffle()
   }
</script>

<Popup bind:this={popup} on:closed={putBack}>
   <div class="flex flex-wrap gap-1 p-2 focus:outline-none inspection"
      tabindex="0" use:ctrlA on:ctrlA={() => selectPile(pickup)}>

      {#each $pickup as card (card._id)}
         <Card {card} pile={pickup} />
      {/each}
   </div>

   <svelte:fragment slot="buttons">
      <button class="action" on:click={closeAndReturn}>Close</button>
      {#if (origin === deck)}
         <button class="action" on:click={closeAndShuffle}>Shuffle Back</button>
      {/if}
      <button class="action" on:click={() => closeAndMove(discard)}>Discard</button>
      <button class="action" on:click={() => closeAndMove(hand)}>To Hand</button>
      <button class="action" on:click={() => closeAndMove(lz)}>To LZ</button>
   </svelte:fragment>
</Popup>

<style>
   .inspection {
      --card-width: 136px;
      --card-height: 189px;
   }

   button.action {
      @apply p-2 rounded-lg font-bold text-white bg-[var(--primary-color)];
   }
</style>