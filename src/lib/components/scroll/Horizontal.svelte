<script>
   import { onMount } from 'svelte'

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
      container.addEventListener('wheel', scroll)
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