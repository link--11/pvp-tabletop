<script>
   import Vertical from '$lib/components/scroll/Vertical.svelte'
   import Pile from './Pile.svelte'
   import Card from './Card.svelte'

   import { prizes, prizesFlipped } from '$lib/stores/opponent.js'
</script>

<Pile pile={prizes} name="Prizes">
   <Vertical>
      <div class="prizes p-1 grid grid-cols-2 gap-1 w-fit">
         {#each $prizes as card (card._id)}
            <Card {card} pile={prizes} revealed={$prizesFlipped} />
         {/each}
      </div>
   </Vertical>
</Pile>

<style>
   .prizes {
      --card-width: 95px;
      --card-height: 132px;
   }
</style>