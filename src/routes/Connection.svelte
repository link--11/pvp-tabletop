<script>
   import Chat from './Chat.svelte'
   import Spinner from './Spinner.svelte'
   import { connected, room, createRoom, joinRoom, leaveRoom } from '$lib/stores/connection.js'

   let roomId = ''

   let copyButtonText = 'Copy to Clipboard'

   function copyToClipboard () {
      navigator.clipboard.writeText($room).then(() => {
         copyButtonText = 'Copied!'
         setTimeout(() => {
            copyButtonText = 'Copy to Clipboard'
         }, 3000)
      })
   }

   function leave () {
      if (!window.confirm('Sure?')) return
      leaveRoom()
   }
</script>

<div class="p-4 w-[350px] flex flex-col h-screen">
   {#if !$room}
      <div class="text-center mb-4 italic font-bold">not connected</div>

      <div class="flex flex-col justify-center gap-3">
         <button class="connect" on:click={createRoom}>Create Room</button>
         <hr>
         <form class="flex flex-col gap-2" on:submit|preventDefault={() => joinRoom(roomId)}>
            <input
               class="p-2 border border-[var(--bg-color-three)] rounded-lg"
               type="text" name="roomId" bind:value={roomId} placeholder="Room ID" on:keydown|stopPropagation
               required
            >

            <button class="connect">Join Room</button>
         </form>
      </div>

   {:else}
      <div class="flex flex-col gap-1 mb-5">
         <div class="text-center font-bold">
            {#if $connected}
               connected to
            {:else}
               <div class="flex gap-3 items-center justify-center bg-yellow-400 text-black p-1 rounded-md mb-2">
                  lost connection
                  <Spinner />
               </div>
            {/if}
            <div class="text-sm text-[var(--text-color-two)]">{$room}</div>
         </div>

         <button
            class="self-center py-1 px-2 primary rounded-md text-sm font-bold"
            on:click={copyToClipboard}>
               {copyButtonText}
         </button>
      </div>

      <Chat />

      <button class="mt-4 text-center" on:click={leave}>Leave Room</button>

   {/if}
</div>

<style>
   button.connect {
      @apply py-2 px-3 font-bold text-white bg-[var(--primary-color)] rounded-lg;
   }
</style>