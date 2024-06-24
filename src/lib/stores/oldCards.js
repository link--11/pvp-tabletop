// most of this code comes from ptcgsim.online

const oldSetCode_to_PokemonTcgApiId = {
    // https://limitlesstcg.com/set-codes
    'BS': 'base1', 'JU': 'base2', 'FO': 'base3', 'B2': 'base4', 'TR': 'base5', 'G1': 'gym1', 'G2': 'gym2',
    'N1': 'neo1', 'N2': 'neo2', 'N3': 'neo3', 'N4': 'neo4', 'E1': 'ecard1', 'EXP': 'ecard1', 'E2': 'ecard2', 'AQ': 'ecard2', 'AQP': 'ecard2', 'E3': 'ecard3', 'SK': 'ecard3', 'SKR': 'ecard3',
    'RS': 'ex1', 'SS': 'ex2', 'DR': 'ex3', 'PR-NP': 'np', 'MA': 'ex4', 'HL': 'ex5', 'RG': 'ex6', 'FRLG': 'ex6', 'TRR': 'ex7', 'DX': 'ex8', 'EM': 'ex9', 'UF': 'ex10', 'DS': 'ex11', 'LM': 'ex12', 'HP': 'ex13', 'CG': 'ex14', 'DF': 'ex15', 'PK': 'ex16',
    'DP': 'dp1', 'MT': 'dp2', 'SW': 'dp3', 'GE': 'dp4', 'MD': 'dp5', 'LA': 'dp6', 'SF': 'dp7', 'PL': 'pl1', 'RR': 'pl2', 'SV': 'pl3', 'AR': 'pl4',
    'POP1': 'pop1', 'POP2': 'pop2', 'POP3': 'pop3', 'POP4': 'pop4', 'POP5': 'pop5', 'POP6': 'pop6', 'POP7': 'pop7', 'POP8': 'pop8', 'POP9': 'pop9',
    'P1': 'pop1', 'P2': 'pop2', 'P3': 'pop3', 'P4': 'pop4', 'P5': 'pop5', 'P6': 'pop6', 'P7': 'pop7', 'P8': 'pop8', 'P9': 'pop9',
    'WBP': 'basep', 'WBSP': 'basep', 'NP': 'np', 'NBSP': 'np', 'DPP': 'dpp', 'BS2': 'base4', 'LC': 'base6', 'SI': 'si1', // idk what VM is
     
    // other set codes not currently supported by Limitless
    'pop1': 'pop1', 'pop2': 'pop2', 'pop3': 'pop3', 'pop4': 'pop4', 'pop5': 'pop5', 'pop6': 'pop6', 'pop7': 'pop7', 'pop8': 'pop8', 'pop9': 'pop9',
    'EX': 'ecard1', 'BP': 'bp', 'RM': 'ru1', 'FUT20': 'fut20'
};

const noImg_to_PokemonTcgApiId = {
    'BUS 112a' : 'sm3-112a',
    'FLI 102a' : 'sm6-102a',
    'UNM 191a' : 'sm11-191a',
    'GRI 121a' : 'sm2-121a',
    'UPR 119a' : 'sm5-119a',
    'BUS 115a' : 'sm3-115a',
    'UPR 125a' : 'sm5-125a',
    'UPR 153a' : 'sm5-153a',
    'UNB 182a' : 'sm10-182a',
    'TEU 152a' : 'sm9-152a',
    'LOT 188a' : 'sm8-188a',
    'SLG 68a' : 'sm35-68a',
    'UPR 135a' : 'sm5-135a',
    'UNB 189a' : 'sm10-189a'
}

export function fixOld (cards) {
    cards.forEach((card) => {
        if (card.region === 'int') {
            if (card.modern === false) {
                if (oldSetCode_to_PokemonTcgApiId[card.set]) {
                    var number = card.number
                    if (card.set === 'DPP') {
                        number = 'DP' + (card.number.length < 3 ? card.number.padStart(2, '0') : card.number);
                    }
                    card.pokemontcgapi_id = oldSetCode_to_PokemonTcgApiId[card.set] + '-' + number
                }
            }
            else {
                const codeAndNumber = card.set + ' ' + card.number
                if (noImg_to_PokemonTcgApiId[codeAndNumber]) {
                    card.pokemontcgapi_id = noImg_to_PokemonTcgApiId[codeAndNumber]
                }
            }
        }
    })
}