import { combineReducers } from '@reduxjs/toolkit';
import { pokemonApi } from '../services/pokemon/pokemon';
import example from './example';

const rootReducer = combineReducers({
    example,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
