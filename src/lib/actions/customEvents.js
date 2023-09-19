export function clickOutside (node, capture = false) {

   const click = (event) => {
      if (!node.contains(event.target)) {
         node.dispatchEvent(new CustomEvent('outclick'))
      }
   }

   document.addEventListener('click', click, capture)

   return {
      destroy () {
         document.removeEventListener('click', click, capture)
      }
   }
}

export function escape (node) {

   const keydown = (e) => {
      if (e.key === 'Escape') {
         node.dispatchEvent(new CustomEvent('esc'))
      }
   }

   document.addEventListener('keydown', keydown)

   return {
      destroy () {
         document.removeEventListener('keydown', keydown)
      }
   }
}

export function ctrlA (node) {

   node.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase()

      if (key === 'a' && e.ctrlKey) {
         e.preventDefault()
         e.stopPropagation()
         node.dispatchEvent(new CustomEvent('ctrlA'))
      }
   })

}