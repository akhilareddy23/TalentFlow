import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminStart: (state) => {
      state.loading = true;
    },
    adminSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    },
    adminFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { adminStart, adminSuccess, adminFail } = adminSlice.actions;
export default adminSlice.reducer;