<script>
   import { getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'

   const { openOppSlotDetails } = getContext('boardActions')

   export let slot

   $: ({ pokemon, trainer, energy, damage } = slot)

   $: top = $pokemon[ $pokemon.length - 1]
</script>

<div class="slot relative w-max z-15" style="margin-right: {$energy.length * 25 + $trainer.length * 35}px"
   on:click|stopPropagation={() => openOppSlotDetails(slot)}>

   {#if $damage}
      <span class="counter absolute bottom-1 left-1 z-15 rounded-full p-4 bg-red-500 text-white font-bold flex justify-center items-center">{$damage}</span>
   {/if}

   {#if top}
      <img src="{cardImage(top, 'xs')}" alt="{top.name}" draggable=false
         class="card pokemon relative z-10">
   {/if}

   {#each $energy as nrg, i (nrg._id)}
      <img src="{cardImage(nrg, 'xs')}" alt="{nrg.name}" class="card absolute" draggable=false
         style="bottom: 15px; left: {(i + 1)* 25}px; z-index: {9 - i}">
   {/each}

   {#each $trainer as tool, i (tool._id)}
      <img src="{cardImage(tool, 'xs')}" alt="{tool.name}" class="card absolute" draggable=false
         style="bottom: 30px; left: {$energy.length * 25 + (i + 1) * 35}px; z-index: {9 - i - $energy.length}">
   {/each}
</div>

<style>
   img.card {
      @apply box-content border-2 border-transparent rounded-md;
   }

   .counter {
      width: calc(var(--card-width) / 2.5);
      height: calc(var(--card-width) / 2.5);
      transform: scale(-1, -1);
   }
</style>