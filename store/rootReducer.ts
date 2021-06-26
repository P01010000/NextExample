import { combineReducers, configureStore } from '@reduxjs/toolkit';
import example from './example';

const rootReducer = combineReducers({
    example,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;