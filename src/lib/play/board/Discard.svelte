<script>
   import { getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'
   import Pile from './Pile.svelte'

   const { discard, deck } = getContext('playBoard')
   const { openPile } = getContext('boardActions')

   let menu
   $: top = $discard[ $discard.length - 1 ]

   function shuffleBack () {
      deck.merge($discard)
      discard.clear()
      menu.close()
      deck.shuffle()
   }
</script>

<Pile pile={discard} name="Discard" bind:menu={menu}>
   {#if $discard.length}
      <img class="card" src="{cardImage(top, 'xs')}" alt="{top.name}" on:click|stopPropagation={() => openPile(discard)}>
   {/if}

   <svelte:fragment slot="menu">
      <ContextMenuOption click={() => openPile(discard)} text="View All" />
      <ContextMenuOption click={() => shuffleBack()} text="Shuffle all into Deck" />
   </svelte:fragment>
</Pile>