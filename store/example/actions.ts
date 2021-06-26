import { createAction } from '@reduxjs/toolkit';
import {
    DECREMENT, INCREMENT, RESET, TICK
} from './types';

export const tick = createAction<{ lastUpdate: number, light: boolean}>(TICK);
export const increment = createAction(INCREMENT);
export const decrement = createAction(DECREMENT);
export const reset = createAction(RESET);