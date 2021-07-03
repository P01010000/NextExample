import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Ajv from 'ajv';
import type { PokemonDTO } from '../../types/pokemon.response.dto';
import { PokemonListDTO } from '../../types/pokemonList.response.dto';
import pokemonDtoJsc from '../../types/schema/pokemon-dto.jsc';
import pokemonListDtoJsc from '../../types/schema/pokemon-list-dto.jsc';

const ajv = new Ajv();
const validatePokemonDto = ajv.compile(pokemonDtoJsc);
const validatePokemonListDto = ajv.compile(pokemonListDtoJsc);

export const pokemonApi = createApi({
    reducerPath: 'pokemon',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://pokeapi.co/api/v2/',
    }),
    endpoints: (builder) => ({
        getPokemonList: builder.query<PokemonListDTO, Record<'offset' | 'limit', number>>({
            query: (params) => ({ url: `pokemon`, params }),
            transformResponse: (response) => {
                const valid = validatePokemonListDto(response);
                if (valid) {
                    return response as PokemonListDTO;
                }
                console.error(validatePokemonListDto.errors)
                throw new Error('response did not match expected format');
            }
        }),
        getPokemonByName: builder.query<PokemonDTO | null, string>({
            query: (name) => `pokemon/${name}`,
            transformResponse: (response) => {
                const valid = validatePokemonDto(response);
                if (valid) {
                    return response as PokemonDTO
                }
                console.error(validatePokemonDto.errors)
                throw new Error('response did not match expected format');
            }
        }),
    }),
});
