import { combineReducers, configureStore } from '@reduxjs/toolkit';
import example from './example';

const rootReducer = combineReducers({
    example,
});

// only required to ensure correct typings for appDispatch
const _store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof _store.dispatch;

export default rootReducer;