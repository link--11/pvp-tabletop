<script>
   import Vertical from '$lib/components/scroll/Vertical.svelte'
   import Pile from './Pile.svelte'
   import Card from './Card.svelte'

   import { prizes } from '$lib/stores/opponent.js'

   let revealed = false

   function switchVisibility () {
      revealed = !revealed
   }

</script>

<Pile pile={prizes} name="Prizes">
   <Vertical>
      <div class="p-1 grid grid-cols-2 gap-1 w-fit">
         {#each $prizes as card (card._id)}
            <Card {card} pile={prizes} {revealed} />
         {/each}
      </div>
   </Vertical>
</Pile>