export function cardImage (card, size = null) {
   const host = 'https://limitlesstcg.nyc3.digitaloceanspaces.com'
   const altHost = 'https://images.pokemontcg.io'

   const sizeMod = size ? '_' + size.toUpperCase() : ''

   if (card.pokemontcgapi_id) {
       return `${altHost}/${card.pokemontcgapi_id.replace(/\-/g,'/')}_hires.png`
   }
   if (card.region === 'tpc') {
      return `${host}/tpc/${card.set}/${card.set}_${card.number}_R_JP${sizeMod}.png`

   } else {
      let lang = card.language || 'en'

      const num = card.number.replace(/^(\d{1,2})(a|b)?$/, (_, p1, p2) => {
         return p1.padStart(3, '0') + (p2 || '')
      })

      return `${host}/tpci/${card.set}/${card.set}_${num}_R_${lang.toUpperCase()}${sizeMod}.png`
   }
}