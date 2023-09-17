<script>
   import Modal from '$lib/components/Modal.svelte'
   import { cardImage } from '$lib/util/assets.js'

   let card
   let modal

   export function open (_card) {
      card = _card
      modal.open()
   }
</script>

<Modal bind:this={modal}>
   <img slot="raw" src={cardImage(card)} alt={card.name}>
</Modal>