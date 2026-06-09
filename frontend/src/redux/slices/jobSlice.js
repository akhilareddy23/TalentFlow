import { createSlice } from "@reduxjs/toolkit";
import { fetchJobsApi, createJobApi, deleteJobApi } from "../../api/jobApi";
import { toast } from "react-hot-toast";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
  },
});

export const { setLoading, setJobs } = jobSlice.actions;

export const fetchJobs = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await fetchJobsApi();

    dispatch(setJobs(res.data));
  } catch (err) {
    console.log(err);
  } finally {
    dispatch(setLoading(false));
  }
};

export const createJob = (jobData, callback) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await createJobApi(jobData);
    
    // Refresh jobs list
    const res = await fetchJobsApi();
    dispatch(setJobs(res.data));
    
    if (callback) callback(null);
  } catch (err) {
    console.error(err);
    if (callback) callback(err);
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteJob = (id, callback) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await deleteJobApi(id);
    
    // Refresh jobs list
    const res = await fetchJobsApi();
    dispatch(setJobs(res.data));
    
    if (callback) callback(null);
  } catch (err) {
    console.error(err);
    if (callback) callback(err);
  } finally {
    dispatch(setLoading(false));
  }
};

export default jobSlice.reducer;