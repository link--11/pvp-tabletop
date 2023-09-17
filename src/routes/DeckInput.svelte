<script>
	import { slide } from './slide.js'
   import { cards } from '$lib/stores/play.js'
   import { post } from '$lib/util/fetch-web.js'
   import Spinner from './Spinner.svelte'

   let isOpen = true

   let txt = ''
   let language = 'en'
   let response = ''
   let loading = false

   function importDeck () {
      loading = true
      post(`/api/dm/import?lang=${language}`, { input: txt }, (res) => {
         const count = res.cards.reduce((c, card) => c + card.count, 0)
         loading = false
         if (res.errors.length) response = res.errors.join("\n")
         else if (count !== 60) response = 'Decklist is not 60 cards!'
         else {
            response = 'Import successful!'
            isOpen = false
         }

         cards.set(res.cards)
      })
   }
</script>

{#if isOpen}
   <div class="fixed z-15 h-screen w-[50vw] max-w-[750px] min-w-[300px] bg-gray-300 shadow-lg shadow-dark-400" transition:slide={{ axis: 'x' }}>

      <div class="flex flex-col h-full">
         <button class="self-start bg-yellow-500 !rounded-none !rounded-br-md !p-3" on:click={() => isOpen = false}>Close</button>

         <div class="flex-1 flex flex-col gap-2 p-3 overflow-hidden">
            <label class="flex gap-2 items-center">
               Language
               <select class="px-2 py-1 rounded-md" bind:value={language}>
                  <option value="en">English</option>
                  <option value="jp">日本語</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
               </select>
            </label>

            <textarea class="h-[65vh] rounded-md p-2" bind:value={txt} on:keydown|stopPropagation />
            <button class="bg-[var(--primary-color)] flex gap-4 justify-center items-center" on:click={importDeck}>
               Import Deck
               {#if loading}
                  <Spinner />
               {/if}
            </button>

            <p class="flex-1 min-h-0 whitespace-pre text-lg overflow-y-auto">{response}</p>
         </div>
      </div>
   </div>
{:else}
   <button class="fixed z-14 top-0 left-0 bg-yellow-500 !rounded-none !rounded-br-md !p-3" on:click={() => isOpen = true}>Edit Deck</button>
{/if}

<style>
   button {
      @apply p-2 rounded-md text-white font-bold;
   }
</style>