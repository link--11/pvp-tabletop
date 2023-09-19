<script>
   import Slot from './Slot.svelte'

   import { bench } from '$lib/stores/opponent.js'
</script>

<div class="p-1 focus:outline-none" tabindex="0">
   <div class="flex gap-4">
      {#each $bench as slot (slot.id)}
         <Slot bind:slot={slot} />
      {/each}
   </div>
</div>