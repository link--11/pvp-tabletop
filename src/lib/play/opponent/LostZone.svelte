<script>
   import { getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import Pile from './Pile.svelte'

   import { lz } from '$lib/stores/opponent.js'
   const { openOppPile } = getContext('boardActions')

   $: top = $lz[ $lz.length - 1 ]
</script>

<Pile pile={lz} name="Lost Zone">
   {#if $lz.length}
      <img class="card" src="{cardImage(top, 'xs')}" alt="{top.name}" on:click|stopPropagation={() => openOppPile(lz)}>
   {/if}
</Pile>