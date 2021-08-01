import { useSelector } from 'react-redux';
import type { RootState } from '../rootReducer';

export const useUser = () => useSelector((state: RootState) => state.user);
