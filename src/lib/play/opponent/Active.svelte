<script>
   import Slot from './Slot.svelte'

   import { active } from '$lib/stores/opponent.js'

</script>

<div>
   <div class="h-full flex justify-center items-center">
      {#if $active}
         <Slot bind:slot={$active} />
      {/if}
   </div>
</div>