<script>
   import { chat, publishToChat } from '$lib/stores/connection.js'
   import { tick } from 'svelte'

   let message = ''

   function sendMessage () {
      if (!message) return
      publishToChat(message, 'chat')
      message = ''
   }

   function chatTime (time) {
      const format = { hour: '2-digit', minute: '2-digit', second: '2-digit' }
      return (new Date(time)).toLocaleTimeString([], format)
   }

   let chatNode

   function autoscroll () {
      if (!chatNode) return
      chatNode.scrollTop = chatNode.scrollHeight
   }

   chat.subscribe(async () => {
      await tick()
      autoscroll()
   })
</script>

<div class="flex-1 flex flex-col gap-2 -mx-1 overflow-hidden">

   <div class="chat" bind:this={chatNode}>
      {#each $chat as entry}
         <p>
            <span class="text-[var(--text-color-two)] text-sm font-">[{entry.self ? 'YOU' : 'OPP'}] {chatTime(entry.time)}</span>
            <span
               class:font-semibold={!entry.self}
               class:font-bold={entry.type === 'important'}
               class:italic={entry.type === 'important'}
               class:opp-message={entry.type === 'chat' && !entry.self}
               >{entry.message}</span>
         </p>
      {/each}
   </div>

   <div class="quick-messages">
      <button on:click={() => publishToChat('Turn End', 'chat')}>Pass</button>
      <button on:click={() => publishToChat('🤔', 'chat')}>🤔</button>
      <button on:click={() => publishToChat('😠', 'chat')}>😠</button>
   </div>

   <form class="flex" on:submit|preventDefault={sendMessage}>
      <input
         class="chat-input" type="text" name="message"
         on:keydown|stopPropagation bind:value={message}
         autocomplete="off">
      <button class="chat-button">Send</button>
   </form>

</div>

<style>
   .chat {
      @apply flex-1 p-2 border border-dark-50 rounded-md overflow-y-scroll bg-[var(--input-color)];
   }

   .chat-input {
      @apply flex-1 p-2 border border-dark-50 border-r-0 rounded-l-md outline-none;
   }

   .chat-button {
      @apply py-2 px-3 font-bold text-white bg-[var(--primary-color)] border border-dark-50 border-l-0 rounded-r-md;
   }

   .quick-messages {
      @apply flex gap-1;
   }

   .quick-messages button {
      @apply font-bold text-white bg-[var(--primary-color)] px-3 py-1.5 w-full;
   }

   .quick-messages button:first-child {
      @apply rounded-l-md;
   }

   .quick-messages button:last-child {
      @apply rounded-r-md;
   }

   .opp-message {
      color: var(--message-color);
   }
</style>

