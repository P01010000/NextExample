import { createReducer } from '@reduxjs/toolkit';
import { loginUserAction, setUser } from './actions';

export type UserReducerState = {
    personId: string,
    firstName: string,
    lastName: string,
    groups: number[],
    token: string,
    isAuthenticated: boolean,
}

const initialState = {
  personId: '',
  firstName: '',
  lastName: '',
  groups: [],
  token: '',
  isAuthenticated: false,
}

const reducer = createReducer<UserReducerState>(initialState, (builder) => {
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
        if (!action.payload) {
            return initialState;
        }
        state.firstName = action.payload.payload.firstName;
        state.lastName = action.payload.payload.lastName;
        state.personId = action.payload.payload.sub!;
        state.groups = action.payload.payload.groups;
        state.token = action.payload.token;
        state.isAuthenticated = true;
    });
    builder.addCase(setUser, (state, action) => {
        if (!action.payload) {
            return initialState;
        }
        return {
            ...action.payload,
            isAuthenticated: true,
        };
    });
});

export default reducer;
