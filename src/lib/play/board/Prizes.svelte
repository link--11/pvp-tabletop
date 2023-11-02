<script>
   import { getContext } from 'svelte'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'
   import Vertical from '$lib/components/scroll/Vertical.svelte'
   import Pile from './Pile.svelte'
   import Card from './Card.svelte'
   import { share, publishLog } from '$lib/stores/connection.js'

   import { prizes, deck, prizesFlipped } from '$lib/stores/player.js'

   let menu

   function switchVisibility () {
      prizesFlipped.update(val => !val)
      menu.close()
      share('prizeToggle', { flipped: prizesFlipped.get() })
   }

   function shuffle () {
      prizes.shuffle()
      menu.close()
      publishLog('Shuffled Prizes')
   }

   function shuffleBack () {
      const cards = $prizes.map(card => card._id)

      deck.merge($prizes)
      prizes.clear()
      menu.close()
      deck.shuffle()

      share('cardsMoved', { cards, from: 'prizes', to: 'deck' })
      publishLog('Shuffled Prizes into Deck')
   }

   const { openSelection } = getContext('boardActions')

   function pickupPrizes () {
      openSelection(prizes, $prizes.length)
   }

</script>

<Pile pile={prizes} name="Prizes" bind:menu={menu}>
   <Vertical>
      <div class="prizes p-1 grid grid-cols-2 gap-1 w-fit">
         {#each $prizes as card (card._id)}
            <Card {card} pile={prizes} revealed={$prizesFlipped} />
         {/each}
      </div>
   </Vertical>

   <svelte:fragment slot="menu">
      <ContextMenuOption click={switchVisibility} text={$prizesFlipped ? 'Hide Prizes' : 'Show Prizes'} />
      <ContextMenuOption click={shuffle} text="Shuffle" />
      <ContextMenuOption click={shuffleBack} text="Shuffle All Into Deck" />
      <ContextMenuOption click={pickupPrizes} text="Inspect Prizes" />
   </svelte:fragment>
</Pile>

<style>
   .prizes {
      --card-width: 95px;
      --card-height: 132px;
   }
</style>