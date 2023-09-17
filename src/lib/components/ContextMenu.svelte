<script context="module">
   let i = 0
   export const elements = new Map()

   export function closeAll () {
      elements.forEach(({ close }) => close())
   }
</script>

<script>
   import { onMount } from 'svelte'
   import { clickOutside, escape } from '$lib/actions/customEvents.js'

   let element
   const j = i++

   let x = 0
   let y = 0
   let isOpen = false

   export let heading = null

   export function open (_x, _y) {
      x = _x
      y = _y
      isOpen = true
   }

   // whenever x and y is changed, restrict box to be within bounds
	$: (() => {
		if (!element) return

		const rect = element.getBoundingClientRect()
		x = Math.min(window.innerWidth - rect.width, x)
		if (y > window.innerHeight - rect.height) y -= rect.height

	})(x, y)

   export function close () {
      if (isOpen) isOpen = false
   }

   function focusout () {
      if (!isOpen) return
      close()
   }

   onMount(() => {
      elements.set(j, { close })
      window.addEventListener('blur', focusout)

      return () => {
         elements.delete(j)
         window.removeEventListener('blur', focusout)
      }
   })

   function closeOthers () {
      elements.forEach(({ close }, k) => {
         if (k !== j) close()
		})
	}

   $: if (isOpen) closeOthers()

   /* @useClickOutside
      fire click on the way down, so it isn't affected if at some point propagation needs to be stopped
      (since context menu should always disappear on any input outside of it,
      even if a different element thinks it should not affect the rest of the page)
   */
</script>

{#if isOpen}
   <div bind:this={element} style="top: {y}px; left: {x}px;" class="z-25"
      on:click={(e) => e.stopPropagation()}
      use:clickOutside={true} on:outclick={close}
      use:escape on:esc={close}>

      {#if heading}
         <span class="font-bold px-3 py-1">{heading}</span>
         <hr>
      {/if}
      <slot />
   </div>
{/if}

<style>
   div {
      position: fixed;
      display: grid;
      border: 1px solid #0003;
      box-shadow: 2px 2px 5px 0px #0002;
      background: var(--bg-color);
   }
</style>