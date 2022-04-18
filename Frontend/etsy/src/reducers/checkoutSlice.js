import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  canCheckout: 'YES'
}

export const checkoutSlice = createSlice({
  name: 'checkoutSlice',
  initialState,
  reducers: {
    setCannotCheckOut(state) {
      state.canCheckout = 'NO';
    }
  }
})

const { actions, reducer } = checkoutSlice;

export const { setCannotCheckOut } = actions;

export default reducer;
