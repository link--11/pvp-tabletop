<script>
   import { getContext, onMount } from 'svelte'
   import { autoMulligan } from '$lib/stores/settings.js'
   import { share, publishLog, shareBoardstate } from '$lib/stores/connection.js'
   import { cog } from '$lib/icons/paths.js'
   import Icon from '$lib/components/Icon.svelte'

   import { pokemonHidden } from '$lib/stores/player.js'
   const { deckValid, resetBoard, startGame, startTurn } = getContext('playActions')
   const { turn, vstarUsed, gxUsed } = getContext('playStats')
   const { showMessage } = getContext('boardActions')

   export let game // reference to the top level dom element

   // game is undefined initially before the this bindings are set up
   $: if (game) {
      const bs = getComputedStyle(game)
      initialWidth = parseInt(bs.getPropertyValue('--card-width'))
   }

   let initialWidth
   let scale = 1.0

   $: game?.style.setProperty('--card-width', initialWidth * scale + 'px')

   function setup () {
      if (!$deckValid && $autoMulligan) return
      const mulligans = startGame()
      if ($autoMulligan) showMessage(`${mulligans} Mulligans`)

      publishLog('Setup' + ($autoMulligan ? ` - ${mulligans} Mulligans` : ''))
      shareBoardstate()
   }

   function reset () {
      resetBoard()
      turn.set(0)

      share('boardReset')
   }

   function flipCoin () {
      const heads = Math.floor(Math.random() * 2)
      showMessage('Coin flip result: ' + (heads ? 'HEADS' : 'TAILS'))
      publishLog('Coin flip: ' + (heads ? 'HEADS' : 'TAILS'))
   }

   function switchVisibility () {
      pokemonHidden.update(val => !val)
      share('pokemonToggle', { hidden: pokemonHidden.get() })
   }

   function keydown (e) {
      const key = e.key.toLowerCase()

      if (key === 'n') {
         if (window.confirm('Start new game?')) start()
      }
      else if (key === 'c') startTurn()
      else if (key === 'f') flipCoin()
      else if (key === 'z') switchVisibility()
   }

   onMount(() => {
      document.addEventListener('keydown', keydown)
      return () => {
         document.removeEventListener('keydown', keydown)
      }
   })

   import Settings from './dialogs/Settings.svelte'
   let settings
</script>

<div class="self-center flex flex-col gap-2 p-3 w-[170px]">
   <button class="action" disabled={!$deckValid && $autoMulligan} on:click={setup} title="Shortcut: N">Setup</button>
   <button class="action" on:click={reset}>Reset</button>

   <div class="flex flex-col rounded-lg border border-gray-400">
      <button on:click={() => startTurn()} class="p-2 rounded-t-lg" title="Shortcut: C" >Turn <span class="font-bold">{$turn}</span></button>
      <button on:click={() => vstarUsed.set(!$vstarUsed)} class="p-2" class:bg-yellow-200={$vstarUsed}>VSTAR Power</button>
      <button on:click={() => gxUsed.set(!$gxUsed)} class="p-2 rounded-b-lg" class:bg-yellow-200={$gxUsed}>GX Attack</button>
   </div>

   <button class="action" on:click={flipCoin} title="Shortcut: F">Flip Coin</button>
   <button class="action" on:click={switchVisibility} title="Shortcut: Z">{$pokemonHidden ? 'Show' : 'Hide'} Pokémon</button>
   <button on:click|stopPropagation={() => settings.open()}>
      <Icon path={cog} />
   </button>
</div>

<Settings bind:this={settings} bind:scale={scale} />

<style>
   button.action {
      @apply font-bold text-white bg-[var(--primary-color)] px-3 py-1 rounded-lg;
   }

   button.action:disabled {
      @apply font-normal cursor-default border-gray-500 text-gray-600 bg-gray-100;
   }
</style>