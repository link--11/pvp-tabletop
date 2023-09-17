import { dragging } from './pointer.js'
import { dragOffset, draggedCard } from './store.js'

let $dragging = false
const dragCallbacks = []

dragging.subscribe(value => {
   $dragging = value
   if ($dragging) {
      dragCallbacks.forEach(cb => cb())
   }
})

let $card = null
draggedCard.subscribe(value => {
   $card = value
})

export function dragStart (node, { cb, ...data }) {
   node.addEventListener('pointerdown', (e) => {
      const rect = node.getBoundingClientRect()
      dragOffset.set({
         x: e.clientX - rect.x,
         y: e.clientY - rect.y
      })
      cb({ ...data, e})
   })
}

export function dragEnter (node, { cb, ...data }) {
   node.addEventListener('pointerenter', (e) => {
      if ($dragging) cb({ ...data, e})
   })
}

export function dragLeave (node, { cb, ...data }) {
   node.addEventListener('pointerleave', (e) => {
      if ($dragging) cb({ ...data, e})
   })
}

export function dragDrop (node, { cb, ...data }) {
   node.addEventListener('pointerup', (e) => {
      if ($dragging) cb({ ...data, e})
   })
}

/* alternative API (experimental) */

export function dnd (node, config) {

   const { start, drag, drop, allowDrop } = config

   if (start) {
      node.addEventListener('pointerdown', (e) => {
         const rect = node.getBoundingClientRect()
         dragOffset.set({
            x: e.clientX - rect.x,
            y: e.clientY - rect.y
         })
         start({ e })
      })
   }

   const onDrag = () => {
      drag({ $card })
   }

   if (drag) dragCallbacks.push(onDrag)

   if (drop) {
      const allow = allowDrop || (() => true)

      node.addEventListener('pointerup', (e) => {
         if ($dragging && $card && allow()) {
            drop({ e })
            node.classList.remove('dragover')
         }
      })

      node.addEventListener('pointerenter', () => {
         if ($dragging && $card && allow()) {
            node.classList.add('dragover')
         }
      })

      node.addEventListener('pointerleave', () => {
         if ($dragging) {
            node.classList.remove('dragover')
         }
      })
   }

   return {
      destroy: () => {
         if (drag) {
            dragCallbacks.splice(dragCallbacks.indexOf(onDrag), 1)
         }
      }
   }
}