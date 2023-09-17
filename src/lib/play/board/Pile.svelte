<script>
   import { getContext } from 'svelte'
   import ContextMenu from '$lib/components/ContextMenu.svelte'
   import { ctrlA } from '$lib/actions/customEvents.js'

   const { selectCard, resetSelection, moveSelection } = getContext('boardActions')

   export let pile
   export let name = null
   export let menu = undefined

   /* DnD */

   import { dnd } from '$lib/dnd/actions.js'
   import { source } from '$lib/dnd/store.js'

   const allowDrop = () => $source && $source !== pile

   function onDragDrop () {
      moveSelection(pile)
   }

   const dndConfig = {
      drop: onDragDrop,
      allowDrop
   }

   function selectAll () {
      resetSelection()
      for (const card of $pile) {
         selectCard(card, pile, true)
      }
   }

   let heading
   function openMenu () {
      const rect = heading.getBoundingClientRect()
      menu.open(rect.left, rect.bottom)
   }

</script>

<div class="p-1 rounded flex flex-col focus:outline-none" tabindex="0"
   on:contextmenu|preventDefault={(e) => menu.open(e.clientX, e.clientY)}
   use:ctrlA on:ctrlA={selectAll}
   use:dnd={dndConfig}>

   {#if name}
      <div class="px-1 cursor-pointer" on:click={openMenu} bind:this={heading}>{name} ({$pile.length})</div>
   {/if}

   <slot menu={menu}></slot>
</div>

<ContextMenu bind:this={menu} heading={name}>
   <slot name="menu"></slot>
</ContextMenu>