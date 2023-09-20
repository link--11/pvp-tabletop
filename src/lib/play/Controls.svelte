<script>
   import { getContext, onMount } from 'svelte'
   import { autoMulligan } from '$lib/stores/settings.js'
   import { publishLog, shareBoardstate } from '$lib/stores/connection.js'
   import { cog } from '$lib/icons/paths.js'
   import Icon from '$lib/components/Icon.svelte'

   const { deckValid, resetBoard, startGame, startTurn } = getContext('playActions')
   const { vstarUsed, gxUsed } = getContext('playStats')
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

   function start () {
      if (!$deckValid && $autoMulligan) return
      const mulligans = startGame()
      if ($autoMulligan) showMessage(`${mulligans} Mulligans`)

      publishLog('Setup' + ($autoMulligan ? ` - ${mulligans} Mulligans` : ''))
      shareBoardstate()
   }

   function flipCoin () {
      const heads = Math.floor(Math.random() * 2)
      showMessage('Coin flip result: ' + (heads ? 'HEADS' : 'TAILS'))
      publishLog('Coin flip: ' + (heads ? 'HEADS' : 'TAILS'))
   }

   function keydown (e) {
      const key = e.key.toLowerCase()

      if (key === 'n') {
         if (window.confirm('Start new game?')) start()
      }
      else if (key === 'f') flipCoin()
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

<div class="self-center flex flex-col gap-2 p-3">
   <button class="action" disabled={!$deckValid && $autoMulligan} on:click={start} title="Shortcut: N">Setup</button>
   <button class="action" on:click={resetBoard}>Reset</button>

   <div class="flex flex-col w-max rounded-lg border border-gray-400">
      <button on:click={() => vstarUsed.set(!$vstarUsed)} class="p-2 rounded-t-lg" class:bg-yellow-200={$vstarUsed}>VSTAR Power</button>
      <button on:click={() => gxUsed.set(!$gxUsed)} class="p-2 rounded-b-lg" class:bg-yellow-200={$gxUsed}>GX Attack</button>
   </div>

   <button class="action" on:click={flipCoin} title="Shortcut: F">Flip Coin</button>
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