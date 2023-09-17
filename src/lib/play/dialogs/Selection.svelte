<script>
   import { getContext } from 'svelte'
   import Card from '../board/Card.svelte'
   import Popup from './Popup.svelte'

   const { deck, discard, hand } = getContext('playBoard')
   const { choice } = getContext('boardActions')

   let popup

   $: if (popup && $choice.length === 0) popup.close()

   let bottom = false // to know where where to "put back" the cards when closed

   export function open (_bottom = false) {
      bottom = _bottom
      popup.open()
   }

   function putBack () {
      while ($choice.length) {
         const card = choice.pop()
         if (bottom) deck.unshift(card)
         else deck.push(card)
      }
   }

   function shuffleBack () {
      deck.merge($choice)
      choice.clear()
      deck.shuffle()
   }

   function closeAndReturn () {
      popup.close()
      putBack()
   }

   function closeAndShuffle () {
      popup.close()
      shuffleBack()
   }

   function closeAndMove (pile) {
      popup.close()
      pile.merge($choice)
      choice.clear()
   }
</script>

<Popup bind:this={popup} on:closed={putBack}>
   <div class="flex flex-wrap gap-1 p-2">
      {#each $choice as card (card._j)}
         <Card {card} pile={choice} />
      {/each}
   </div>

   <svelte:fragment slot="buttons">
      <button class="action" on:click={closeAndReturn}>Close</button>
      <button class="action" on:click={closeAndShuffle}>Shuffle Back</button>
      <button class="action" on:click={() => closeAndMove(discard)}>Discard</button>
      <button class="action" on:click={() => closeAndMove(hand)}>To Hand</button>
   </svelte:fragment>
</Popup>

<style>
   button.action {
      @apply p-2 rounded-lg font-bold text-white bg-[var(--primary-color)];
   }
</style>