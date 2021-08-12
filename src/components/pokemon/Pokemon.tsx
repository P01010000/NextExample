import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import Image from 'next/image';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pokemonApi } from '../../services/pokemon/pokemon';
import debounce from '../../utils/debounce';


const Pokemon: FunctionComponent = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState('');
    const [search, setSearch] = useState('');
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const searchPokemon = useCallback(debounce((value: string) => {
        setSearch(value);
        if (value) {
            dispatch(pokemonApi.endpoints.getPokemonByName.initiate(value));
        }
    }, 400), [dispatch])
    
    useEffect(() => {
        dispatch(pokemonApi.endpoints.getPokemonList.initiate({ offset: 0, limit: 151 }));
        const search = new URLSearchParams(location.search).get('search') ?? '';
        if (search) {
            setValue(search);
            setSearch(search);
            searchPokemon(search);
        }
    }, [dispatch, searchPokemon]);

    const onChange = useCallback((ev) => {
        const value = ev.target.value.toLowerCase();
        setValue(value);
        searchPokemon(value);
    }, [searchPokemon]);

    const selectPokemon = useMemo(() => pokemonApi.endpoints.getPokemonByName.select(search), [search]);
    const pokemon = useSelector(selectPokemon);
    const selectPokemonList = useMemo(() => pokemonApi.endpoints.getPokemonList.select({ offset: 0, limit: 151 }), []);
    const list = useSelector(selectPokemonList);

    return (
        <div style={{ margin: 20 }}>
            <h3>Pokemon search</h3>
            <input
                value={value}
                list="pokemonList"
                onChange={onChange}
                placeholder="Pokemon"
                style={{ marginBottom: 20 }}
            />
            <datalist id="pokemonList">
                {list.isSuccess && list.data.results.map(({ name }) => (
                    <option key={name} value={name}/>
                ))}
            </datalist>
            {pokemon.status === QueryStatus.pending && (
                <p>Loading...</p>
            )}
            {pokemon.status === QueryStatus.rejected && (
                <>
                    <p>An error occured while searching for <i>{search}</i></p>
                    <p>{(pokemon.error as Error)?.message}</p>
                </>
            )}
            {value && pokemon.status === QueryStatus.fulfilled && pokemon.data && (
                <>
                    <div>Name: {pokemon.data.name}</div>
                    <div>Order: {pokemon.data.order}</div>
                    <div>Height: {pokemon.data.height}</div>
                    <div>Weight: {pokemon.data.weight}</div>
                    <div>Types: {pokemon.data.types.map(t => t.type.name).join(', ')}</div>
                    <Image src={pokemon.data.sprites.other.dream_world.front_default} alt="" width={192} height={192} unoptimized />
                </>
            )}
        </div>
    )
}

Pokemon.displayName = 'Pokemon';

export default Pokemon;
