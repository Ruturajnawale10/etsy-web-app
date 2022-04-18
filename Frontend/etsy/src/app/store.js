import { configureStore } from '@reduxjs/toolkit';
import checkoutSliceReducer from '../reducers/checkoutSlice';

export const store = configureStore({
  reducer: {
    checkoutSlice: checkoutSliceReducer
  },
});
