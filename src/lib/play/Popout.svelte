<script>
   import { onMount } from 'svelte'
   import { cardImage } from '$lib/util/assets.js'
   import { ctrlA } from '$lib/actions/customEvents.js'
   import ContextMenu from '$lib/components/ContextMenu.svelte'
   import ContextMenuOption from '$lib/components/ContextMenuOption.svelte'

   let hand = []
   let selection = []

   let broadcast
   let menu

   $: menuHeading = selection.length === 1 ? selection[0].name : `${selection.length} cards`

   onMount(() => {
      broadcast = new BroadcastChannel('popout')

      broadcast.postMessage({ type: 'hello' }) // tells the main app to send over the current status

      broadcast.addEventListener('message', ({ data }) => {
         if (data.type === 'hand') hand = data.message
         else if (data.type === 'selection') selection = data.message
      })

      return sayBye
   })

   function sayBye () {
      broadcast.postMessage({ type: 'bye' })
   }

   // needs to have selection as an argument to become reactive
   function inSelection (card, selection) {
      for (const c of selection) {
         if (c._j === card._j) return true
      }
      return false
   }

   function onClick (e, card) {
      e.stopPropagation()

      selectCard(card, e.ctrlKey)
   }

   function onCtx (e, card) {
      e.preventDefault()

      if (!inSelection(card, selection)) {
         selectCard(card, false)
      }

      menu.open(e.clientX, e.clientY)
   }

   function selectCard (card, push = false) {
      broadcast.postMessage({
         type: 'select',
         message: { card, push }
      })
   }

   function selectAll () {
      postAction('reset')
      for (const card of hand) {
         selectCard(card, true)
      }
   }

   function postAction (key) {
      broadcast.postMessage({
         type: 'action',
         message: key
      })
   }

   function menuClick (action) {
      postAction(action)
      menu.close()
   }

   /* like keydown in Board.svelte */

   const reset = () => postAction('reset')

   function keydown (e) {
      // forward the keypress to the main window
      broadcast.postMessage({
         type: 'key',
         message: { key: e.key, altKey: e.altKey, ctrlKey: e.ctrlKey }
      })
   }

   onMount(() => {
      document.addEventListener('keydown', keydown)
      document.addEventListener('click', reset)
      return () => {
         document.removeEventListener('keydown', keydown)
         document.removeEventListener('click', reset)
      }
   })

   let pile = 'hand' // might want to add deck and prizes eventually
</script>

<svelte:window on:beforeunload={sayBye} />

<div class="w-screen h-screen bg-gray-100" tabindex="0" use:ctrlA on:ctrlA={selectAll}>
   <div class="flex flex-wrap gap-2 p-2">
      {#each hand as card (card._j)}
         <div
            on:click={(e) => onClick(e, card)}
            on:contextmenu={(e) => onCtx(e, card)}
            class="border-2 border-transparent rounded-md"
            class:selected={inSelection(card, selection)}>

            <img class="card" src="{cardImage(card, 'xs')}" alt="{card.name}" draggable=false>
         </div>
      {/each}
   </div>
</div>

<ContextMenu bind:this={menu} heading={menuHeading}>
   {#if pile !== 'hand'}
      <ContextMenuOption click={() => menuClick('hand')} text="To Hand" shortcut="h"/>
   {/if}

   <ContextMenuOption click={() => menuClick('discard')} text="To Discard" shortcut="d"/>
   <ContextMenuOption click={() => menuClick('bench')} text="To Bench" shortcut="b" />

   {#if selection.length === 1}
      <ContextMenuOption click={() => menuClick('active')} text="To Active" shortcut="a" />
      <ContextMenuOption click={() => menuClick('stadium')} text="To Stadium" shortcut="g" />
   {/if}

   {#if pile !== 'deck'}
      <ContextMenuOption click={() => menuClick('deck')} text="Shuffle into Deck" shortcut="s" />
      <ContextMenuOption click={() => menuClick('top')} text="To top of Deck" shortcut="t" />
      <ContextMenuOption click={() => menuClick('bottom')} text="To bottom of Deck" shortcut="m" />
   {/if}

   <ContextMenuOption click={() => menuClick('lz')} text="To Lost Zone" shortcut="l" />

   {#if pile !== 'prizes'}
      <ContextMenuOption click={() => menuClick('prizes')} text="To Prizes" shortcut="p" />
   {/if}

   <ContextMenuOption click={() => menuClick('table')} text="To Table" shortcut="w" />

   <ContextMenuOption click={() => menuClick('attach')} text="Attach" shortcut="q" />
   <ContextMenuOption click={() => menuClick('evolve')} text="Evolve" shortcut="e" />

   {#if selection.length === 1}
      <ContextMenuOption click={() => menuClick('swap')} text="Switch with top of Deck" />
      <ContextMenuOption click={() => menuClick('details')} text="Show Details" />
   {/if}
</ContextMenu>

<style>
   .selected {
      @apply border-blue-500;
   }

   img.card {
      filter: drop-shadow(1px 1px 2px var(--shadow-color));
   }
</style>