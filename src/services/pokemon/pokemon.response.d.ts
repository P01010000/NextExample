// types are incomplete

export type Pokemon = {
    height: number;
    order: number;
    name: string;
    weight: number;
    types: PokemonType[];
}

export type PokemonType = {
    slot: number;
    type: {
        name: ElementTypes;
        url: string;
    }
}

export enum ElementTypes {
    Ground = 'ground',
    Water = 'water',
    Electro = 'electric',
    Fire = 'fire'
}