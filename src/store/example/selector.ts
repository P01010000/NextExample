import { useSelector } from 'react-redux';
import type { RootState } from '../rootReducer';
import { ExampleReducerState } from './reducer';

export const useLastUpdate = () => useSelector((state: RootState) => state.example.lastUpdate);
export const useExampleStateValue = <T extends keyof ExampleReducerState>(key: T) => useSelector((state: RootState) => state.example[key]);