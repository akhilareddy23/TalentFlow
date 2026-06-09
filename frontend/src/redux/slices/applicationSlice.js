import { createSlice } from "@reduxjs/toolkit";
import {
  applyJobApi,
  getMyApplicationsApi,
  getJobApplicationsApi,
  updateApplicationStatusApi,
} from "../../api/applicationApi";
import { toast } from "react-hot-toast";

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    applicants: [],
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    setApplicants: (state, action) => {
      state.applicants = action.payload;
    },
  },
});

export const { setLoading, setApplications, setApplicants } =
  applicationSlice.actions;

// Thunks
export const fetchMyApplications = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await getMyApplicationsApi();
    dispatch(setApplications(res.data));
  } catch (err) {
    console.error(err);
  } finally {
    dispatch(setLoading(false));
  }
};

export const applyToJob = (jobId, applicationData, callback) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await applyJobApi(jobId, applicationData);
    toast.success(res.data.message || "Applied successfully!");
    dispatch(fetchMyApplications());
    if (callback) callback(null);
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to apply";
    toast.error(errorMsg);
    if (callback) callback(err);
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchJobApplicants = (jobId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await getJobApplicationsApi(jobId);
    dispatch(setApplicants(res.data));
  } catch (err) {
    console.error(err);
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateApplicationStatus = (appId, status, jobId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await updateApplicationStatusApi(appId, status);
    toast.success(res.data.message || `Status updated to ${status}`);
    dispatch(fetchJobApplicants(jobId));
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to update status";
    toast.error(errorMsg);
  } finally {
    dispatch(setLoading(false));
  }
};

export default applicationSlice.reducer;
