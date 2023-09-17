import { writable } from '$lib/stores/custom/writable.js'
import { shuffle } from '$lib/util/array.js'

/**
 * Writable array store with some useful methods
 */
export function pile () {
   const { get, set, subscribe, update } = writable([])

   return {
      get, set, subscribe, update,
      push: (val) => {
         update(v => {
            v.push(val)
            return v
         })
      },
      pop: () => {
         let card = null
         update(v => {
            card = v.pop()
            return v
         })
         return card
      },
      shuffle: () => {
         update(v => {
            shuffle(v)
            return v
         })
      },
      clear: () => {
         set([])
      },
      remove: (card) => {
         update(v => {
            v.splice(v.indexOf(card), 1)
            return v
         })
      },
      unshift: (val) => {
         update(v => {
            v.unshift(val)
            return v
         })
      },
      shift: () => {
         let card = null
         update(v => {
            card = v.shift()
            return v
         })
         return card
      },
      merge: (array) => {
         update(v => {
            v.push(...array)
            return v
         })
      },
      swap: (rem, add) => {
         update(v => {
            v.splice(v.indexOf(rem), 1, add)
            return v
         })
      }
   }
}

export function slots () {
   const { set, subscribe, update } = writable([])

   const add = (slot) => {
      update(v => {
         v.push(slot)
         return v
      })
   }

   const remove = (slot) => {
      update(v => {
         v.splice(v.indexOf(slot), 1)
         return v
      })
   }

   const clear = () => {
      set([])
   }

   return {
      set, subscribe, update,
      add, remove, clear
   }
}

export function slot (card) {
   const pokemon = pile()
   pokemon.push(card)

   return {
      id: crypto.randomUUID(),
      pokemon,
      energy: pile(),
      trainer: pile(),
      damage: writable(0)
   }
}