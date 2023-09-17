<script>
   import { getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'
   import Pile from './Pile.svelte'

   const { lz } = getContext('playBoard')
   const { openPile } = getContext('boardActions')

   let menu
   $: top = $lz[ $lz.length - 1 ]
</script>

<Pile pile={lz} name="Lost Zone" bind:menu={menu}>
   {#if $lz.length}
      <img class="card" src="{cardImage(top, 'xs')}" alt="{top.name}" on:click|stopPropagation={() => openPile(lz)}>
   {/if}

   <svelte:fragment slot="menu">
      <ContextMenuOption click={() => openPile(lz)} text="View All" />
   </svelte:fragment>
</Pile>