<script>
   import Game from '$lib/play/Game.svelte'
   import DeckInput from './DeckInput.svelte'
</script>

<svelte:head>
   <title>Limitless Tabletop</title>
</svelte:head>

<span class="fixed z-15 top-2 right-4 opacity-75 font-bold">Beta</span>

<DeckInput />
<Game />