<script>
   import { getContext } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import cardback from '$lib/assets/cardback_int.png'

   import { pokemonHidden } from '$lib/stores/opponent.js'
   const { openOppSlotDetails, openOppSlotMenu, openDetails } = getContext('boardActions')

   export let slot

   $: ({ pokemon, trainer, energy, damage, marker } = slot)
   $: top = $pokemon[ $pokemon.length - 1]

   function onClick (e) {
      if ($pokemonHidden) return
      if (e.altKey) openDetails(top)
      else openOppSlotDetails(slot)
   }

   function onCtx (e) {
      if ($pokemonHidden) return
      openOppSlotMenu(e.clientX, e.clientY, slot)
   }
</script>

<div class="slot relative w-max z-15" style="margin-right: calc({$energy.length * 25 + $trainer.length * 35}px * var(--card-scale))"
   on:click|stopPropagation={onClick}
   on:contextmenu={onCtx}>

   {#if $damage}
      <span class="counter absolute bottom-1 left-1 z-15 rounded-full p-4 bg-red-500 text-white font-bold flex justify-center items-center">{$damage}</span>
   {/if}

   {#if $marker}
      <span class="counter absolute top-1 right-1 z-15 rounded-full p-4 bg-yellow-500 text-white font-bold flex justify-center items-center"></span>
   {/if}

   {#if top}
      <img
         src="{$pokemonHidden ? cardback : cardImage(top, 'xs')}"
         alt="{$pokemonHidden ? 'Hidden Pokémon' : top.name}"
         class="card pokemon relative z-10" draggable=false>
   {/if}

   {#each $energy as nrg, i (nrg._id)}
      <img src="{cardImage(nrg, 'xs')}" alt="{nrg.name}" class="card absolute" draggable=false
         style="bottom: calc(17px * var(--card-scale)); left: calc({(i + 1)* 25}px * var(--card-scale)); z-index: {9 - i}">
   {/each}

   {#each $trainer as tool, i (tool._id)}
      <img src="{cardImage(tool, 'xs')}" alt="{tool.name}" class="card absolute" draggable=false
         style="bottom: calc(34px * var(--card-scale)); left: calc({$energy.length * 25 + (i + 1) * 35}px * var(--card-scale)); z-index: {9 - i - $energy.length}">
   {/each}
</div>

<style>
   img.card {
      @apply box-content border-2 border-transparent rounded-md;
   }

   .counter {
      width: calc(var(--card-width) * var(--card-scale) / 2.5);
      height: calc(var(--card-width) * var(--card-scale) / 2.5);
      transform: scale(-1, -1);
   }
</style>