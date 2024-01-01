<script>
   import { browser } from '$app/environment'
   import { darkMode } from '$lib/stores/settings.js'
   import Board from '$lib/play/Board.svelte'
   import { github } from '$lib/icons/paths.js'
   import Icon from '$lib/components/Icon.svelte'
   import Connection from './Connection.svelte'
   import DeckInput from './DeckInput.svelte'

   $: if (browser) {
      document.documentElement.classList.toggle('dark', $darkMode)
   }
</script>

<svelte:head>
   <title>PvP Tabletop</title>
</svelte:head>

<a href="https://github.com/link--11/pvp-tabletop" class="fixed z-15 bottom-2 right-4 opacity-75 font-bold flex items-center gap-2">
   Beta <Icon path={github} size={512}></Icon>
</a>

<DeckInput />

<div class="flex gap-2">
   <Board />
   <Connection />
</div>