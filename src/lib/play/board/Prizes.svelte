<script>
   import { getContext } from 'svelte'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'
   import Vertical from '$lib/components/scroll/Vertical.svelte'
   import Pile from './Pile.svelte'
   import Card from './Card.svelte'

   const { prizes, deck } = getContext('playBoard')

   let menu
   let revealed = false

   function switchVisibility () {
      revealed = !revealed
      menu.close()
   }

   function shuffle () {
      prizes.shuffle()
      menu.close()
   }

   function shuffleBack () {
      deck.merge($prizes)
      prizes.clear()
      menu.close()
      deck.shuffle()
   }

</script>

<Pile pile={prizes} name="Prizes" bind:menu={menu}>
   <Vertical>
      <div class="p-1 grid grid-cols-2 gap-1 w-fit">
         {#each $prizes as card (card._id)}
            <Card {card} pile={prizes} {revealed} />
         {/each}
      </div>
   </Vertical>

   <svelte:fragment slot="menu">
      <ContextMenuOption click={switchVisibility} text={revealed ? 'Hide prizes' : 'Show prizes'} />
      <ContextMenuOption click={shuffle} text="Shuffle" />
      <ContextMenuOption click={shuffleBack} text="Shuffle all into Deck" />
   </svelte:fragment>
</Pile>