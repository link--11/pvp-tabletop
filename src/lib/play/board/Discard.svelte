<script>
   import { getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'
   import Pile from './Pile.svelte'
   import { share, publishLog } from '$lib/stores/connection.js'

   import { discard, deck } from '$lib/stores/player.js'
   const { openPile } = getContext('boardActions')

   let menu
   $: top = $discard[ $discard.length - 1 ]

   function shuffleBack () {
      const cards = $discard.map(card => card._id)

      deck.merge($discard)
      discard.clear()
      menu.close()
      deck.shuffle()

      share('cardsMoved', { cards, from: 'discard', to: 'deck' })
      publishLog('Shuffled Discard into Deck')
   }
</script>

<Pile pile={discard} name="Discard" bind:menu={menu}>
   {#if $discard.length}
      <img class="card" src="{cardImage(top, 'xs')}" alt="{top.name}" on:click|stopPropagation={() => openPile(discard)}>
   {/if}

   <svelte:fragment slot="menu">
      <ContextMenuOption click={() => openPile(discard)} text="View All" />
      <ContextMenuOption click={() => shuffleBack()} text="Shuffle All Into Deck" />
   </svelte:fragment>
</Pile>