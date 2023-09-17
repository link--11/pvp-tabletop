<script>
   import { getContext } from 'svelte'
   import { discordMode } from '$lib/stores/play.js'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'
   import Horizontal from '$lib/components/scroll/Horizontal.svelte'
   import Pile from './Pile.svelte'
   import Card from './Card.svelte'

   const { hand, deck, discard } = getContext('playBoard')

   let menu

   function moveAll (targetPile) {
      targetPile.merge($hand)
      hand.clear()
      menu.close()
   }

   function shuffleBack () {
      moveAll(deck)
      deck.shuffle()
   }

   function marnie () {
      hand.shuffle()
      while ($hand.length) {
         deck.unshift(hand.pop())
      }
      menu.close()
   }

   function discardRandom () {
      if (!$hand.length) return
      const card = $hand[Math.floor(Math.random() * $hand.length)]
      hand.remove(card)
      discard.push(card)
   }
</script>

<Pile pile={hand} name="Hand" bind:menu={menu}>
   {#if $discordMode}
      <div class="m-auto">
         Hand hidden (<span class="font-bold">{$hand.length} cards</span>)
      </div>
   {:else}
      <Horizontal>
         <div class="flex gap-2 p-2 m-auto w-max">
            {#each $hand as card (card._j)}
               <Card {card} pile={hand} />
            {/each}
         </div>
      </Horizontal>
   {/if}

   <svelte:fragment slot="menu">
      <ContextMenuOption click={() => moveAll(discard)} text="Discard all" />
      <ContextMenuOption click={() => shuffleBack()} text="Shuffle all into Deck" />
      <ContextMenuOption click={() => marnie()} text="Shuffle all to bottom of Deck" />
      <ContextMenuOption click={() => discardRandom()} text="Discard Random Card" />
   </svelte:fragment>
</Pile>