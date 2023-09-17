import { writable } from 'svelte/store'

export let draggedCard = writable(null)
export let source = writable('')
export let dragOffset = writable({})

export const reset = () => {
   draggedCard.set(null)
   source.set('')
   dragOffset.set({})
}