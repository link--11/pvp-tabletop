<script>
   import { browser } from '$app/environment'
   import { darkMode } from '$lib/stores/settings.js'
   import Board from '$lib/play/Board.svelte'
   import Connection from './Connection.svelte'
   import DeckInput from './DeckInput.svelte'

   $: if (browser) {
      document.documentElement.classList.toggle('dark', $darkMode)
   }
</script>

<svelte:head>
   <title>PvP Tabletop</title>
</svelte:head>

<span class="fixed z-15 bottom-2 right-4 opacity-75 font-bold">Beta</span>

<DeckInput />

<div class="flex">
   <Board />
   <Connection />
</div>