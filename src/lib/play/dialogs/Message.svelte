<script>
	import { fade } from 'svelte/transition'

   let active = false
   let message

   let timeout

   export function show (_message, time = 2000) {
      if (timeout) clearTimeout(timeout)

      message = _message
      active = true

      timeout = setTimeout(() => {
         active = false
      }, time)
   }
</script>

{#if active}
   <div class="absolute left-1/2 top-16 p-2 bg-purple-400 rounded transform translate-x-[-50%]" transition:fade={{ duration: 200 }}>
      {message}
   </div>
{/if}