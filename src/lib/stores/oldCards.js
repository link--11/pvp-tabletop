// current list of retro sets that are supported on Limitless and use images from the Pokémon TCG API
const retroSets = {
   BS: 'base1',
   JU: 'base2',
   FO: 'base3',
   TR: 'base5',
   G1: 'gym1',
   G2: 'gym2',
   N1: 'neo1',
   N2: 'neo2',
   N3: 'neo3',
   N4: 'neo4',
   E1: 'ecard1',
   BG: 'bp',
   E2: 'ecard2',
   E3: 'ecard3',
   RS: 'ex1',
   SS: 'ex2',
   DR: 'ex3',
   MA: 'ex4',
   HL: 'ex5',
   RG: 'ex6',
   TRR: 'ex7',
   DX: 'ex8',
   EM: 'ex9',
   UF: 'ex10',
   DS: 'ex11',
   LM: 'ex12',
   HP: 'ex13',
   CG: 'ex14',
   DF: 'ex15',
   PK: 'ex16',
   DP: 'dp1',
   MT: 'dp2',
   SW: 'dp3',
   GE: 'dp4',
   MD: 'dp5',
   LA: 'dp6',
   SF: 'dp7',
   PL: 'pl1',
   RR: 'pl2',
   SV: 'pl3',
   AR: 'pl4',
   WP: 'basep',
   NP: 'np',
   DPP: 'dpp',
   P1: 'pop1',
   P2: 'pop2',
   P3: 'pop3',
   P4: 'pop4',
   P5: 'pop5',
   P6: 'pop6',
   P7: 'pop7',
   P8: 'pop8',
   P9: 'pop9',
   BS2: 'base4',
   LC: 'base6',
   SI: 'si1',
   RM: 'ru1'
}

// modern cards that are missing an image on Limitless
const noImg_to_PokemonTcgApiCode = {
   'BUS 112a': 'sm3',
   'FLI 102a': 'sm6',
   'UNM 191a': 'sm11',
   'GRI 121a': 'sm2',
   'UPR 119a': 'sm5',
   'BUS 115a': 'sm3',
   'UPR 125a': 'sm5',
   'UPR 153a': 'sm5',
   'UNB 182a': 'sm10',
   'TEU 152a': 'sm9',
   'LOT 188a': 'sm8',
   'SLG 68a': 'sm35',
   'UPR 135a': 'sm5',
   'UNB 189a': 'sm10'
}

export function fixOld (cards) {
   for (const card of cards) {
      if (card.region !== 'int') continue
      const codeAndNumber = card.set + ' ' + card.number

      if (card.set in retroSets) {
         card.ptcgApiCode = retroSets[card.set]
      } else if (codeAndNumber in noImg_to_PokemonTcgApiCode) {
         card.ptcgApiCode = noImg_to_PokemonTcgApiCode[codeAndNumber]
      }
   }
}
