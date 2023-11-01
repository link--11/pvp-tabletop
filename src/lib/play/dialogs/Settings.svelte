<script>
   import { browser } from '$app/environment'
   import { autoMulligan, scale, darkMode } from '$lib/stores/settings.js'
   import Popup from './Popup.svelte'

   let popup
   export const open = () => popup.open()

   const setScale = (scale) => {
      if (browser) {
         document.documentElement.style.setProperty('--card-scale', scale)
      }
   }

   $: setScale($scale)
</script>

<Popup bind:this={popup}>
   <div class="p-4">
      <div class="p-4 bg-[var(--bg-color-zero)] rounded-t-md">
         <label class="px-1">
            <input type="checkbox" bind:checked={$autoMulligan}>
            Automatically re-shuffle mulligans when starting a new game
         </label>
         <p class="text-sm">
            Disable this option when using cards like Talonflame (STS-96) that break the normal rules of setup.
         </p>
      </div>

      <div class="p-4 bg-[var(--bg-color-zero)]">
         <label class="px-1">
            <input type="range" bind:value={$scale} min="0.4" max="1" step="0.05">
            Card Size
         </label>
         <p class="text-sm">
            Scale down the size of card images if the field doesn't fit your screen.
         </p>
      </div>

      <div class="p-4 bg-[var(--bg-color-zero)] rounded-b-md">
         <label class="px-1">
            <input type="checkbox" bind:checked={$darkMode}>
            Use dark mode
         </label>
      </div>
   </div>

   <svelte:fragment slot="buttons">
      <button class="action" on:click={() => popup.close()}>Close</button>
   </svelte:fragment>
</Popup>

<style>
   button.action {
      @apply px-3 py-2 rounded-lg font-bold text-white bg-[var(--primary-color)];
   }
</style>