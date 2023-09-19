<script>
   import Game from '$lib/play/Game.svelte'
   import Connection from './Connection.svelte'
   import DeckInput from './DeckInput.svelte'
</script>

<svelte:head>
   <title>PvP Tabletop</title>
</svelte:head>

<span class="fixed z-15 bottom-2 right-4 opacity-75 font-bold">Beta</span>

<DeckInput />

<div class="flex bg-gray-100">
   <Game />
   <Connection />
</div>