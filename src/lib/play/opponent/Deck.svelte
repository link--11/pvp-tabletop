<script>
   import Pile from './Pile.svelte'
   import cardback from '$lib/assets/cardback_int.png'
   import { deck } from '$lib/stores/opponent.js'
</script>

<Pile pile={deck} name="Deck">
   {#if $deck.length > 0}
      <img class="card" src={cardback} alt="" draggable="false">
   {/if}
</Pile>