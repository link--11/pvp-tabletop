<script>
	import { slide } from './slide.js'
   import { importDeck } from '$lib/stores/player.js'
   import Spinner from './Spinner.svelte'

   let isOpen = true

   let txt = ''
   let response = ''
   let loading = false

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

   function randomList () {
      txt = `
Pokémon (18)
3 Ralts ASR 60
1 Ralts SIT 67
3 Kirlia SIT 68
1 Kirlia CRE 60
2 Gardevoir CRE 61
2 Gardevoir ex SVI 86
1 Cresselia LOR 74
1 Mew CEL 11
1 Radiant Greninja ASR 46
1 Lumineon V BRS 40
1 Zacian V CEL 16
1 Manaphy BRS 41

Trainer (30)
3 Iono PAL 185
2 Boss's Orders PAL 172
1 Professor's Research SVI 189
1 Worker SIT 167
4 Battle VIP Pass FST 225
4 Level Ball BST 129
3 Ultra Ball SVI 196
3 Rare Candy SVI 191
2 Fog Crystal CRE 140
2 Super Rod PAL 188
1 Pal Pad SVI 182
1 Lost Vacuum CRZ 135
1 Forest Seal Stone SIT 156
1 Collapsed Stadium BRS 137
1 Artazon PAL 171

Energy (12)
10 Psychic Energy 5
2 Reversal Energy PAL 192
`
   }
</script>

{#if isOpen}
   <div class="fixed z-20 h-screen w-[50vw] max-w-[750px] min-w-[300px] bg-gray-300 shadow-lg shadow-dark-400" transition:slide={{ axis: 'x' }}>

      <div class="flex flex-col h-full">
         <button class="self-start bg-blue-500 !rounded-none !rounded-br-md !p-3" on:click={() => isOpen = false}>Close</button>

         <button class="bg-[var(--primary-color)] flex gap-4 justify-center items-center" on:click={randomList}>RANDOM</button>

         <div class="flex-1 flex flex-col gap-2 p-3 overflow-hidden">
            <!-- <label class="flex gap-2 items-center">
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
            </label> -->

            <textarea class="h-[65vh] rounded-md p-2" bind:value={txt} on:keydown|stopPropagation />
            <button class="bg-[var(--primary-color)] flex gap-4 justify-center items-center" on:click={doImport}>
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
   <button class="fixed z-14 top-0 left-0 bg-blue-500 !rounded-none !rounded-br-md !p-3" on:click={() => isOpen = true}>Edit Deck</button>
{/if}

<style>
   button {
      @apply p-2 rounded-md text-white font-bold;
   }
</style>