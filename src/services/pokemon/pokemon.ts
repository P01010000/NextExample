import { createApi, fetchBaseQuery }  from '@reduxjs/toolkit/query/react';
import Ajv from 'ajv';
import type { PokemonDTO } from '../../types/pokemon.response.dto';
import pokemonDtoJsc from '../../types/schema/pokemon-dto.jsc';

const ajv = new Ajv();
const validate = ajv.compile(pokemonDtoJsc);

export const pokemonApi = createApi({
    reducerPath: 'pokemon',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://pokeapi.co/api/v2/'
    }),
    endpoints: (builder) => ({
        getPokemonByName: builder.query<PokemonDTO | null, string>({
            query: (name) => `pokemon/${name}`,
            transformResponse: (response) => {
                const valid = validate(response);
                return valid ? response as PokemonDTO : null;
            }
        }),
    }),
});
