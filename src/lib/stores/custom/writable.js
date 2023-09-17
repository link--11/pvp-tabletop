import { writable as coreWritable } from 'svelte/store'

/**
 * Writable store with get() method
 */
export function writable (init) {
   let value = init
   const { set, subscribe } = coreWritable(init)

   const set2 = (val) => {
      value = val
      set(val)
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