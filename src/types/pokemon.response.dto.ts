// types are incomplete

export type PokemonDTO = {
    height: number;
    order: number;
    name: string;
    weight: number;
    types: PokemonType[];
    sprites: {
        front_default: string;
        other: {
            dream_world: {
                front_default: string;
            }
        }
    }
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
    Fire = 'fire',
    Grass = 'grass',
    Poison = 'poison',
    Psychic = 'psychic',
    Normal = 'normal',
    Rock = 'rock',
    Flying = 'flying',
    Bug = 'bug',
    Ice = 'ice',
    Fighting = 'fighting',
    Ghost = 'ghost',
    Fairy = 'fairy',
    Dark = 'dark',
    Steel = 'steel',
    Dragon = 'dragon'
}
