<script>
   import { getContext } from 'svelte'
   import ContextMenu from '$lib/components/ContextMenu.svelte'
   import { ctrlA } from '$lib/actions/customEvents.js'
   import { down } from '$lib/icons/paths.js'
   import Icon from '$lib/components/Icon.svelte'

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

<div class="pile p-1 rounded flex flex-col focus:outline-none relative" tabindex="0"
   on:contextmenu|preventDefault={(e) => menu.open(e.clientX, e.clientY)}
   use:ctrlA on:ctrlA={selectAll}
   use:dnd={dndConfig}>

   {#if name}
      <div class="count" on:click={openMenu} bind:this={heading}>
         {$pile.length}
         <div class="name gap-1 items-center"><span>{name}</span> <Icon path={down} class="text-xs" /></div>
      </div>
   {/if}

   <slot menu={menu}></slot>
</div>

<ContextMenu bind:this={menu} heading={name}>
   <slot name="menu"></slot>
</ContextMenu>

<style>
   .count {
      background-color: rgba(255, 255, 255, 0.5);
      @apply absolute z-10 top-1 left-1 font-bold p-1 cursor-pointer rounded-md;
   }

   .name {
      display: none;
   }

   .pile:hover .name {
      display: inline-flex;
   }
</style>