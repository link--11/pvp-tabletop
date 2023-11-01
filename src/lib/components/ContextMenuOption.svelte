<script>
   export let text = ''
   export let shortcut = null

   export let click

   function onClick (e) {
      /*
      ContextMenu should not bubble up click event, to skip document level listeners like for closing popups or clearing selection
      there's a stopProp call on ContextMenu itself as well, but if the callback here closes the menu, that listener is not reached!
      */
      e.stopPropagation()

      click(e)
   }
</script>

<div class="item" on:click={onClick}>
   {#if text}
      <div class="flex justify-between gap-2">
         {text}
         {#if shortcut}
            <span class="text-[var(--text-color-two)]">{shortcut}</span>
         {/if}
      </div>
   {:else}
      <slot />
   {/if}
</div>

<style>
   .item {
      padding: 4px 15px;
      cursor: default;
   }

   .item:hover {
      background: #0002;
   }
</style>
