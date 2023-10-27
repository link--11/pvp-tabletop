<script>
   import Card from '../board/Card.svelte'
   import Popup from './Popup.svelte'
   import { share, publishLog } from '$lib/stores/connection.js'

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

   function calcAttacks (pokes) {
      const a = { attacks: [], abilities: [] }
      if (!pokes) return a

      for (const p of pokes.toReversed()) {
         if (p.a1_name) a.attacks.push(p.a1_name)
         if (p.a2_name) a.attacks.push(p.a2_name)
         if (p.a3_name) a.attacks.push(p.a3_name)
         if (p.ability_name) a.abilities.push(p.ability_name)
      }
      return a
   }

   $: ({ attacks, abilities } = calcAttacks($pokemon))

   function announce (message) {
      publishLog(message)
      popup.close()
   }

   function updateDamage () {
      share('damageUpdated', { slotId: id, damage: damage.get() })
   }
</script>

<Popup bind:this={popup}>
   <div class="w-fit m-auto">
      <div class="flex flex-col gap-2 items-center p-2">
         <span class="font-bold">{$pokemon[$pokemon.length - 1]?.name}</span>
         <div class="flex bg-[rgba(255,255,255,0.6)] rounded-md">
            <input type="text" class="p-1 bg-white rounded-md border border-black w-20"
               bind:value={$damage}
               on:keydown={(e) => e.stopPropagation()}
               on:change={updateDamage}>
            <span class="p-2">Damage</span>
         </div>
      </div>

      <flex class="flex flex-col gap-2 m-2 items-center">
         <div class="flex gap-2">
            {#each attacks as attack}
               <button class="attack primary" on:click={() => announce(`Attack: ${attack}`)}>{attack}</button>
            {/each}
         </div>

         <div class="flex gap-2">
            {#each abilities as ability}
               <button class="attack primary" on:click={() => announce(`Ability: ${ability}`)}>{ability}</button>
            {/each}
         </div>
      </flex>

      <div class="flex flex-col gap-4 p-3 items-center">
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

   button.attack {
      @apply p-2 rounded-lg;
   }
</style>