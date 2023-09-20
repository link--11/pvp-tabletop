<script>
	import { slide } from './slide.js'
   import { importDeck } from '$lib/stores/player.js'
   import Spinner from './Spinner.svelte'

   let isOpen = true

   let txt = ''
   let response = ''
   let loading = false
   let loadingRandom = false

   function doImport () {
      loading = true
      importDeck(txt, (res) => {
         const count = res.cards.reduce((c, card) => c + card.count, 0)
         loading = false
         if (res.errors.length) response = res.errors.join("\n")
         else if (count !== 60) response = 'Decklist is not 60 cards!'
         else {
            response = 'Import successful!'
            isOpen = false
         }
      })
   }

   function randomImport () {
      loadingRandom = true
      importDeck(txt, (res) => {
         loadingRandom = false
         isOpen = false
      }, true)
   }
</script>

{#if isOpen}
   <div class="fixed z-20 h-screen w-[50vw] max-w-[750px] min-w-[300px] bg-gray-300 shadow-lg shadow-dark-400" transition:slide={{ axis: 'x' }}>

      <div class="flex flex-col h-full">
         <button class="self-start bg-blue-500 !rounded-none !rounded-br-md !p-3" on:click={() => isOpen = false}>Close</button>

         <div class="flex-1 flex flex-col gap-2 p-3 overflow-hidden">
            <textarea class="h-[65vh] rounded-md p-2" bind:value={txt} on:keydown|stopPropagation />
            <button class="bg-[var(--primary-color)] button-with-spinner" on:click={doImport}>
               Import Deck
               {#if loading}
                  <Spinner />
               {/if}
            </button>

            <p class="flex-1 min-h-0 whitespace-pre text-lg overflow-y-auto">{response}</p>

            <button class="primary self-start mt-auto button-with-spinner" on:click={randomImport}>
               Import Random Deck
               {#if loadingRandom}
                  <Spinner />
               {/if}
            </button>
         </div>
      </div>
   </div>
{:else}
   <button class="fixed z-14 top-0 left-0 bg-blue-500 !rounded-none !rounded-br-md !p-3" on:click={() => isOpen = true}>Edit Deck</button>
{/if}

<style>
   button {
      @apply p-2 rounded-md text-white font-bold;
   }

   .button-with-spinner {
      @apply flex gap-4 justify-center items-center;
   }
</style>