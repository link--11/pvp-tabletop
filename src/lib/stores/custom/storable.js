import { writable as coreWritable } from 'svelte/store'
import { browser } from '$app/environment'

/**
 * writable that uses localStorage to persist its data
 */
export function storable (init, key) {
   let value = init

   if (browser) {
      const saved = localStorage.getItem(key)
      if (saved !== null) value = JSON.parse(saved)
   }

   const { set, subscribe } = coreWritable(value)

   const set2 = (val) => {
      value = val
      set(val)
      if (browser) localStorage.setItem(key, JSON.stringify(val))
   }

   return {
      set: set2,
      update: (updater) => {
         set2(updater(value))
      },
      get: () => value,
      subscribe
   }
}