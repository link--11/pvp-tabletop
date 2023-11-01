<script>
   import Card from '../opponent/Card.svelte'
   import Popup from './Popup.svelte'
   import { share } from '$lib/stores/connection.js'

   let popup
   let id, pokemon, trainer, energy, damage

   $: if (!$pokemon?.length) popup?.close()

   export function open (slot) {
      id = slot.id
      pokemon = slot.pokemon
      trainer = slot.trainer
      energy = slot.energy
      damage = slot.damage
      popup.open()
   }

   function updateDamage () {
      share('oppDamageUpdated', { slotId: id, damage: damage.get() })
   }
</script>

<Popup bind:this={popup}>
   <div class="w-fit m-auto">
      <div class="flex flex-col gap-2 items-center p-2">
         <span class="font-bold">{$pokemon[$pokemon.length - 1]?.name}</span>
         <div class="flex bg-[rgba(255,255,255,0.6)] rounded-md">
            <input type="text" class="p-1 rounded-md border border-black w-20"
               bind:value={$damage}
               on:keydown={(e) => e.stopPropagation()}
               on:change={updateDamage}>
            <span class="p-2 text-black">Damage</span>
         </div>
      </div>

      <div class="flex flex-col gap-2 p-3 items-center">
         <div class="flex gap-2">
            {#each $pokemon as card (card._id)}
               <Card {card} pile={pokemon} />
            {/each}
         </div>
         <div class="flex gap-2">
            {#each $energy as card (card._id)}
               <Card {card} pile={energy} />
            {/each}
            {#each $trainer as card (card._id)}
               <Card {card} pile={trainer} />
            {/each}
         </div>
      </div>
   </div>

   <svelte:fragment slot="buttons">
      <button class="action" on:click={() => popup.close()}>Close</button>
   </svelte:fragment>
</Popup>

<style>
   button.action {
      @apply px-3 py-2 rounded-lg font-bold text-white bg-[var(--primary-color)];
   }
</style>