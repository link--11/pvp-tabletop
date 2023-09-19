<script>
   export let pile
   export let name = null
   export let menu = undefined
</script>

<div class="p-1 rounded flex flex-col focus:outline-none relative" tabindex="0">

   {#if name}
      <div class="absolute top-1 left-1 font-bold p-1 count">{$pile.length}</div>
   {/if}

   <slot></slot>
</div>

<style>
   .count {
      transform: scale(-1, -1); /* "unscale" the number */
      z-index: 10;
      background-color: rgba(255, 255, 255, 0.5);
   }
</style>