<script>
   import { getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import Pile from './Pile.svelte'

   import { discard } from '$lib/stores/opponent.js'
   const { openOppPile } = getContext('boardActions')

   $: top = $discard[ $discard.length - 1 ]
</script>

<Pile pile={discard} name="Discard">
   {#if $discard.length}
      <img class="card" src="{cardImage(top, 'xs')}" alt="{top.name}" on:click|stopPropagation={() => openOppPile(discard)}>
   {/if}
</Pile>