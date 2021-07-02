// types are incomplete

export type PokemonDTO = {
    height: number;
    order: number;
    name: string;
    weight: number;
    types: PokemonType[];
}

type PokemonType = {
    slot: number;
    type: {
        name: ElementTypes;
        url: string;
    }
}

enum ElementTypes {
    Ground = 'ground',
    Water = 'water',
    Electro = 'electric',
    Fire = 'fire'
}