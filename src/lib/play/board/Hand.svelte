<script>
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'
   import Horizontal from '$lib/components/scroll/Horizontal.svelte'
   import Pile from './Pile.svelte'
   import Card from './Card.svelte'
   import { share, publishLog } from '$lib/stores/connection.js'

   import { hand, deck, discard, handRevealed } from '$lib/stores/player.js'

   let menu

   function moveAll (targetPile) {
      const cards = $hand.map(card => card._id)

      targetPile.merge($hand)
      hand.clear()
      menu.close()

      share('cardsMoved', { cards, from: 'hand', to: targetPile.name })
   }

   function discardAll () {
      moveAll(discard)
      publishLog('Discarded Hand')
   }

   function shuffleBack () {
      moveAll(deck)
      deck.shuffle()

      publishLog('Shuffled Hand into Deck')
   }

   function marnie () {
      const cards = $hand.map(card => card._id)

      hand.shuffle()
      while ($hand.length) {
         deck.unshift(hand.pop())
      }

      menu.close()

      share('cardsMoved', { cards, from: 'hand', to: 'deck' }) // order of opponents cards does not matter
      publishLog('Shuffled Hand to bottom of Deck')
   }

   function discardRandom () {
      if (!$hand.length) return
      const card = $hand[Math.floor(Math.random() * $hand.length)]
      hand.remove(card)
      discard.push(card)

      share('cardsMoved', { cards: [ card._id ], from: 'hand', to: 'discard' })
      publishLog(`Randomly discarded [${card.name}] from Hand`)
   }

   function switchVisibility () {
      handRevealed.update(val => !val)
      menu.close()
      share('handToggle', { revealed: handRevealed.get() })
   }
</script>

<Pile pile={hand} name="Hand" bind:menu={menu}>
   <Horizontal>
      <div class="flex gap-2 p-2 m-auto w-max">
         {#each $hand as card (card._id)}
            <Card {card} pile={hand} />
         {/each}
      </div>
   </Horizontal>

   <svelte:fragment slot="menu">
      <ContextMenuOption click={() => discardAll()} text="Discard All" />
      <ContextMenuOption click={() => shuffleBack()} text="Shuffle All Into Deck" />
      <ContextMenuOption click={() => marnie()} text="Shuffle All to Bottom of Deck" />
      <ContextMenuOption click={() => discardRandom()} text="Discard Random Card" />
      <ContextMenuOption click={switchVisibility} text={$handRevealed ? 'Hide Hand' : 'Reveal Hand'} />
   </svelte:fragment>
</Pile>