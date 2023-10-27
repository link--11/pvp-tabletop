<script>
   import { getContext } from 'svelte'
   import ContextMenu from '$lib/components/ContextMenu.svelte'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'

   import { share } from '$lib/stores/connection.js'
   import { pokemonHidden } from '$lib/stores/opponent.js'
   const { openOppSlotDetails } = getContext('boardActions')

   let slot
   let pokemon

   let menu

   export function open (x, y, _slot) {
      slot = _slot
      menu.open(x, y)
   }

   function setDamage () {
      let x = Number(prompt('How much damage is on the Pokémon?'))
      slot.damage.set(x)
      share('oppDamageUpdated', { slotId: slot.id, damage: x })
   }

   $: if (slot) ({ pokemon } = slot)
   $: top = $pokemon ? $pokemon[ $pokemon.length - 1] : null
   $: heading = $pokemonHidden ? 'Hidden Pokémon' : top?.name
</script>

<ContextMenu bind:this={menu} {heading}>
   <ContextMenuOption click={setDamage} text="Set Damage" />
   <ContextMenuOption click={() => openOppSlotDetails(slot)} text="Show All" />
</ContextMenu>