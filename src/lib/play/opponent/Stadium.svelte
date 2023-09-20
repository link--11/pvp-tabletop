<script>
   import Card from './Card.svelte'
   import { stadium } from '$lib/stores/opponent.js'
</script>

<div class="p-1 flex justify-center items-center">
   {#if $stadium}
      <Card card={$stadium} pile="stadium" />
   {/if}
</div>