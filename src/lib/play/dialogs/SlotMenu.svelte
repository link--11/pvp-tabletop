<script>
   import ContextMenu from '$lib/components/ContextMenu.svelte'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'

   import { getContext } from 'svelte'

   const { hand, discard, active } = getContext('playBoard')
   const { openSlotDetails, moveSelection, toActive, toBench, removeSlot } = getContext('boardActions')

   export let selection

   $: heading = $selection.length === 1 ?
      $selection[0].pokemon.get()[0].name : `${$selection.length} Pokémon`

   let menu

   export function open (x, y,) {
      menu.open(x, y)
   }

   /* move actions analog zu CardMenu.svelte */

   function moveTo (targetPile, options = {}) {
      moveSelection(targetPile, options)
      menu.close()
   }

   function callThenClose (action) {
      action()
      menu.close()
   }

   function damage (e) {
      const dmg = e.altKey ? 50 : 10
      for (const slot of $selection) {
         slot.damage.update(before => before + dmg)
      }
   }

   function heal (e) {
      let dmg = e.altKey ? 50 : 10

      let dmgLeft = false

      for (const slot of $selection) {
         const before = slot.damage.get()
         if (dmg > before) slot.damage.set(0)
         else slot.damage.set(before - dmg)

         if (before > dmg) dmgLeft = true
      }

      if (!dmgLeft) menu.close()
   }

   function setDamage () {
      let x = prompt('How much damage is on the Pokémon?')
      for (const slot of $selection) {
         slot.damage.set(x)
      }
   }

   function returnPokemon () {
      for (const slot of $selection) {
         removeSlot(slot)
         hand.merge(slot.pokemon.get())
         discard.merge(slot.energy.get())
         discard.merge(slot.trainer.get())
      }
      menu.close()
   }

   function discardEnergy () {
      for (const slot of $selection) {
         discard.merge(slot.energy.get())
         slot.energy.clear()
      }
      menu.close()
   }

</script>

<ContextMenu bind:this={menu} {heading}>
   <ContextMenuOption click={damage} text="Damage" />
   <ContextMenuOption click={heal} text="Heal" />
   <ContextMenuOption click={setDamage} text="Set Damage" />
   <hr>
   {#if $selection.length === 1 && $selection[0] !== $active}
      <ContextMenuOption click={() => callThenClose(toActive)} text="Move to Active" shortcut="a" />
   {/if}
   {#if $selection.includes($active)}
      <ContextMenuOption click={() => callThenClose(toBench)} text="Move to Bench" shortcut="b" />
   {/if}

   <ContextMenuOption click={() => moveTo(discard)} text="Discard all" shortcut="d" />
   <ContextMenuOption click={() => moveTo(hand)} text="Return to Hand" shortcut="h" />
   <ContextMenuOption click={() => returnPokemon()} text="Return Pokémon, Discard Rest" />
   <ContextMenuOption click={() => discardEnergy()} text="Discard all Energy" />

   {#if $selection.length === 1}
      <hr>
      <ContextMenuOption click={() => openSlotDetails($selection[0])} text="Show All" />
   {/if}
</ContextMenu>