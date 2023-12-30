<script>
   import { onMount } from 'svelte'
   import { isMac } from '$lib/util/ctrlcmd.js'

   let container

   function scroll (e) {
      if (container.scrollWidth > container.clientWidth) {
         e.preventDefault()
         container.scrollBy({
            left: e.deltaY < 0 ? - 50 : 50
         })
      }
   }

   onMount(() => {
      /* support for horizontal scrolling with a mouse wheel -
         it breaks Mac trackpad scrolling, so don't use it there
         (probably also Windows laptops if they use the same gestures, but idk) */
      if (!isMac()) container.addEventListener('wheel', scroll)
   })
</script>

<div class="overflow-x-auto horizontal" bind:this={container}>
   <slot></slot>
</div>

<style>
   .horizontal {
      max-width: 100%;
      scrollbar-color: var(--primary-color) #f5f5f5;
      scrollbar-width: thin;
   }

   .horizontal::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #f5f5f5;
   }

   .horizontal::-webkit-scrollbar {
      height: 10px;
      background-color: #f5f5f5;
   }

   .horizontal::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: var(--primary-color);
   }
</style>