import { createReducer } from '@reduxjs/toolkit';
import { decrement, increment, reset, tick } from './actions';

export type ExampleReducerState = {
    lastUpdate: number;
    light: boolean;
    count: number;
}

const initialState = {
  lastUpdate: 0,
  light: false,
  count: 0,
}

const reducer = createReducer<ExampleReducerState>(initialState, (builder) => {
    builder.addCase(tick, (state, action) => {
        state.lastUpdate = action.payload.lastUpdate;
        state.light = action.payload.light;
    });
    builder.addCase(increment, (state) => {
        state.count++;
    });
    builder.addCase(decrement, (state) => {
        state.count--;
    });
    builder.addCase(reset, (state) => {
        state.count = initialState.count;
    });
});

export default reducer;
