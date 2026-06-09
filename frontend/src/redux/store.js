import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import jobReducer from "./slices/jobSlice";
import applicationReducer from "./slices/applicationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    jobs: jobReducer,
    applications: applicationReducer,
  },
});