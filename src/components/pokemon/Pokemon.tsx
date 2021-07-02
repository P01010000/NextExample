import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';
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

    const onChange = useCallback((ev) => {
        const value = ev.target.value.toLowerCase();
        setValue(value);
        searchPokemon(value);
    }, [searchPokemon]);

    const selectPokemon = useMemo(() => pokemonApi.endpoints.getPokemonByName.select(search), [search]);
    const pokemon = useSelector(selectPokemon);

    return (
        <div style={{ margin: 20 }}>
            <h3>Pokemon search</h3>
            <input
                value={value}
                onChange={onChange}
                placeholder="Pokemon"
                style={{ marginBottom: 20 }}
            />
            {pokemon.status === QueryStatus.pending && (
                <p>Loading...</p>
            )}
            {pokemon.status === QueryStatus.rejected && (
                <p>An error occured while searching for <i>{search}</i></p>
            )}
            {value && pokemon.status === QueryStatus.fulfilled && pokemon.data && (
                <>
                    <div>Name: {pokemon.data.name}</div>
                    <div>Order: {pokemon.data.order}</div>
                    <div>Height: {pokemon.data.height}</div>
                    <div>Weight: {pokemon.data.weight}</div>
                    <div>Types: {pokemon.data.types.map(t => t.type.name).join(', ')}</div>
                </>
            )}
        </div>
    )
}

Pokemon.displayName = 'Pokemon';

export default Pokemon;
