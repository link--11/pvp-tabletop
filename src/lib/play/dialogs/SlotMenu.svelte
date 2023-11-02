<script>
   import { getContext } from 'svelte'
   import ContextMenu from '$lib/components/ContextMenu.svelte'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'
   import { share } from '$lib/stores/connection.js'
   import { logMove } from '$lib/stores/logger.js'

   import {
      hand, discard, active,
      moveSelection, toActive, toBench, removeSlot,
      toggleMarker
   } from '$lib/stores/player.js'

   const { openSlotDetails } = getContext('boardActions')

   export let selection

   $: heading = $selection.length === 1 ?
      $selection[0].pokemon.get().at(-1).name : `${$selection.length} Pokémon`

   let menu

   export function open (x, y) {
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
         slot.damage.update(before => Number(before) + dmg)
         share('damageUpdated', { slotId: slot.id, damage: slot.damage.get() })
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

         share('damageUpdated', { slotId: slot.id, damage: slot.damage.get() })
      }

      if (!dmgLeft) menu.close()
   }

   function setDamage () {
      let x = Number(prompt('How much damage is on the Pokémon?'))
      for (const slot of $selection) {
         slot.damage.set(x)
         share('damageUpdated', { slotId: slot.id, damage: x })
      }
   }

   function returnPokemon () {
      for (const slot of $selection) {
         const pokemon = slot.pokemon.get()
         const trainer = slot.trainer.get()
         const energy = slot.energy.get()

         hand.merge(pokemon)
         discard.merge(energy)
         discard.merge(trainer)
         removeSlot(slot)

         share('cardsMoved', { cards: pokemon.map(card => card._id), from: slot.pokemon.name, to: 'hand' })
         share('cardsMoved', { cards: energy.map(card => card._id), from: slot.energy.name, to: 'discard' })
         share('cardsMoved', { cards: trainer.map(card => card._id), from: slot.trainer.name, to: 'discard' })

         share('slotDiscarded', { slotId: slot.id })

         if (trainer.length || energy.length) {
            logMove([ ...trainer, ...energy ], slot.name, 'discard')
         }
         logMove(pokemon, 'play', 'hand')
      }

      menu.close()
   }

   function discardEnergy () {
      for (const slot of $selection) {
         const cards = slot.energy.get().slice()

         discard.merge(slot.energy.get())
         slot.energy.clear()

         share('cardsMoved', { cards: cards.map(card => card._id), from: slot.energy.name, to: 'discard' })
         logMove(cards, slot.energy.name, 'discard')
      }
      menu.close()
   }

</script>

<ContextMenu bind:this={menu} {heading}>
   <ContextMenuOption click={damage} text="Damage" />
   <ContextMenuOption click={heal} text="Heal" />
   <ContextMenuOption click={setDamage} text="Set Damage" />
   <ContextMenuOption click={() => toggleMarker()} text="Toggle Marker" shortcut="u" />
   <hr>
   {#if $selection.length === 1 && $selection[0] !== $active}
      <ContextMenuOption click={() => callThenClose(toActive)} text="Move to Active" shortcut="a" />
   {/if}
   {#if $selection.includes($active)}
      <ContextMenuOption click={() => callThenClose(toBench)} text="Move to Bench" shortcut="b" />
   {/if}

   <ContextMenuOption click={() => moveTo(discard)} text="Discard All" shortcut="d" />
   <ContextMenuOption click={() => moveTo(hand)} text="Return to Hand" shortcut="h" />
   <ContextMenuOption click={() => returnPokemon()} text="Return Pokémon, Discard Rest" />
   <ContextMenuOption click={() => discardEnergy()} text="Discard All Energy" />

   {#if $selection.length === 1}
      <hr>
      <ContextMenuOption click={() => openSlotDetails($selection[0])} text="Show All" />
   {/if}
</ContextMenu>