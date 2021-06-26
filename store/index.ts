import { useMemo } from 'react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './rootReducer';

const initStore = (preloadedState: RootState | undefined): EnhancedStore<RootState> => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
    });
}
let store: EnhancedStore<RootState> | undefined;

export const initializeStore = (preloadedState: RootState | undefined = undefined): ReturnType<typeof initStore> => {
    // Always create new store for server side
    if (typeof window === 'undefined') return initStore(preloadedState);

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        store = initStore({
            ...store.getState(),
            ...preloadedState,
        })
    }

    // Create store once at client
    if (!store) {
        store = initStore(preloadedState);
    }

    return store;
}

export const useStore = (initialState: RootState): ReturnType<typeof initStore> => {
    const store = useMemo(() => initializeStore(initialState), [initialState]);
    return store;
}
