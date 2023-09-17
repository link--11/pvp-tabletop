<script>
   import { onMount } from 'svelte'
   import { closeAll } from '$lib/components/ContextMenu.svelte'

   let isOpen = false
   let backdrop

   function click (e) {
      if (!isOpen) return
      /*
         stop click propagation in capturing on document, so basically disables all click handlers globally
         (will cause issues if we ever need clicks inside the modal)
      */
      e.stopPropagation()

      if (e.target === backdrop) isOpen = false
   }

   function keydown (e) {
      if (!isOpen) return
      if (e.key === 'Escape') isOpen = false
   }

   onMount(() => {
      window.addEventListener('click', click, true)
      window.addEventListener('keydown', keydown)

      return () => {
         window.removeEventListener('click', click, true)
         window.removeEventListener('keydown', keydown)
      }
   })

   export const open = () => {
      isOpen = true
      closeAll() // idk, should probably be done with some listener in ContextMenu instead
   }
   export const close = () => isOpen = false
</script>

{#if isOpen}
   <div bind:this={backdrop} class="fixed top-0 left-0 z-30 flex items-center justify-center w-screen h-screen overflow-auto bg-black bg-opacity-50">
      {#if $$slots.raw}
         <slot name="raw"></slot>
      {:else}
         <div class="w-11/12 p-4 bg-white rounded lg:w-1/2 max-w-7xl">
            <slot></slot>
         </div>
      {/if}
   </div>
{/if}