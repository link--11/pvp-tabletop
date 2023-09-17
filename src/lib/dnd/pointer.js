import { readable } from 'svelte/store'
import { reset as resetDnd } from '$lib/dnd/store.js'
import { browser } from '$app/environment'

export let pos = readable({ x: 0, y: 0 }, (set) => {
   if (!browser) return

   document.body.addEventListener("pointermove", move)

   function move (event) {
      set({
         x: event.pageX,
         y: event.pageY,
      })
   }

   return () => {
      document.body.removeEventListener("pointermove", move)
   }
})

export let dragging = readable(false, (set) => {
   if (!browser) return

   let pressing = false
   let dragging = false
   let downPos = {}
   const dis = 5 // move distance on which d&d should be triggered

   function down (e) {
      pressing = true
      downPos = { x: e.clientX, y: e.clientY }
   }

   function move (e) {
      if (pressing && !dragging) {
         if (Math.abs(e.clientX - downPos.x) < dis && (Math.abs(e.clientY - downPos.y) < dis)) return
         dragging = true
         set(true)
      }
   }

   function up () {
      pressing = false
      resetDnd()
      if (dragging) {
         dragging = false
         set(false)
      }
   }

   function leave () {
      if (dragging) {
         pressing = false
         resetDnd()
         dragging = false
         set(false)
      }
   }

   document.body.addEventListener("pointerdown", down)
   document.body.addEventListener("pointermove", move)
   document.body.addEventListener("pointerup", up)
   document.body.addEventListener("pointerleave", leave)

   return () => {
      document.body.removeEventListener("pointerdown", down)
      document.body.removeEventListener("pointermove", move)
      document.body.removeEventListener("pointerup", up)
      document.body.removeEventListener("pointerleave", leave)
   }
})