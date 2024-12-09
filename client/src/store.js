import { configureStore } from '@reduxjs/toolkit';
import cvReducer from './features/cvSlice';

export const store = configureStore({
  reducer: {
    cv: cvReducer,
  },
});
