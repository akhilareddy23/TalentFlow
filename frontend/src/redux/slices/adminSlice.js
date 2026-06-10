import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: null,
  users: [],
  jobs: [],
  applications: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    adminSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    },
    adminFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setAdminUsers: (state, action) => {
      state.users = action.payload;
    },
    setAdminJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setAdminApplications: (state, action) => {
      state.applications = action.payload;
    },
    removeAdminUser: (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },
    removeAdminJob: (state, action) => {
      state.jobs = state.jobs.filter((j) => j._id !== action.payload);
    },
  },
});

export const {
  adminStart,
  adminSuccess,
  adminFail,
  setAdminUsers,
  setAdminJobs,
  setAdminApplications,
  removeAdminUser,
  removeAdminJob,
} = adminSlice.actions;

export default adminSlice.reducer;