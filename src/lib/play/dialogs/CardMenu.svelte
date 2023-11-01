<script>
   import { getContext } from 'svelte'
   import ContextMenu from '$lib/components/ContextMenu.svelte'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'

   import {
      hand, discard, deck, prizes, lz, table,
      moveSelection, toActive, toBench, toStadium
   } from '$lib/stores/player.js'

   const { openDetails, startAE } = getContext('boardActions')

   export let selection

   let pile
   let revealed
   let menu

   $: heading = $selection.length === 1 ? (revealed ? $selection[0].name : 'Hidden card') : `${$selection.length} cards`

   export function open (x, y, _pile, _revealed) {
      pile = _pile
      revealed = _revealed
      menu.open(x, y)
   }

   function moveTo (targetPile, options = {}) {
      moveSelection(targetPile, options)
      menu.close()
   }

   function callThenClose (action) {
      action()
      menu.close()
   }

   function attachEvolve (evo = false) {
      startAE(evo)
      menu.close()
   }
</script>

<ContextMenu bind:this={menu} {heading}>
   {#if pile !== hand}
      <ContextMenuOption click={() => moveTo(hand)} text="To Hand" shortcut="h" />
   {/if}
   {#if pile !== discard}
      <ContextMenuOption click={() => moveTo(discard)} text="To Discard" shortcut="d"/>
   {/if}

   <ContextMenuOption click={() => callThenClose(toBench)} text="To Bench" shortcut="b" />
   {#if $selection.length === 1}
      <ContextMenuOption click={() => callThenClose(toActive)} text="To Active" shortcut="a" />
      <ContextMenuOption click={() => callThenClose(toStadium)} text="To Stadium" shortcut="g" />
   {/if}

   {#if pile !== deck}
      <ContextMenuOption click={() => moveTo(deck, { shuffle: true })} text="Shuffle into Deck" shortcut="s" />
      <ContextMenuOption click={() => moveTo(deck)} text="To top of Deck" shortcut="t" />
      <ContextMenuOption click={() => moveTo(deck, { bottom: true })} text="To bottom of Deck" shortcut="m" />
   {/if}

   {#if pile !== lz}
      <ContextMenuOption click={() => moveTo(lz)} text="To Lost Zone" shortcut="l" />
   {/if}
   {#if pile !== prizes}
      <ContextMenuOption click={() => moveTo(prizes)} text="To Prizes" shortcut="p" />
   {/if}
   {#if pile !== table}
      <ContextMenuOption click={() => moveTo(table)} text="To Table" shortcut="w" />
   {/if}

   <ContextMenuOption click={() => attachEvolve()} text="Attach" shortcut="q" />
   <ContextMenuOption click={() => attachEvolve(true)} text="Evolve" shortcut="e" />

   {#if $selection.length === 1}
      {#if $deck.length && pile !== deck}
         <ContextMenuOption click={() => moveTo(deck, { switch: true })} text="Switch with top of Deck" />
      {/if}
      <ContextMenuOption click={() => openDetails($selection[0])} text="Show Details" />
   {/if}
</ContextMenu>