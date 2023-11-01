<script>
   import Slot from './Slot.svelte'

   import { bench } from '$lib/stores/opponent.js'
</script>

<div class="p-1 flex items-center focus:outline-none" tabindex="0">
   <div class="p-1 flex gap-[var(--scaled-rem)] min-w-0">
      {#each $bench as slot (slot.id)}
         <Slot bind:slot={slot} />
      {/each}
   </div>
</div>