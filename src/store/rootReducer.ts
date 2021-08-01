import { combineReducers } from '@reduxjs/toolkit';
import { pokemonApi } from '../services/pokemon/pokemon';
import example from './example';
import user from './user';

const rootReducer = combineReducers({
    example,
    user,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
