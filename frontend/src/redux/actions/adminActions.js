import API from "../../api/axios";
import {
  adminStart,
  adminSuccess,
  adminFail,
  setAdminUsers,
  setAdminJobs,
  setAdminApplications,
  removeAdminUser,
  removeAdminJob,
} from "../slices/adminSlice";
import { toast } from "react-hot-toast";

export const fetchAdminStats = () => async (dispatch) => {
  try {
    dispatch(adminStart());
    const res = await API.get("/admin/stats");
    dispatch(adminSuccess(res.data));
  } catch (err) {
    dispatch(adminFail(err.response?.data?.message || "Failed to load stats"));
  }
};

export const fetchAdminUsers = () => async (dispatch) => {
  try {
    const res = await API.get("/admin/users");
    dispatch(setAdminUsers(res.data));
  } catch (err) {
    toast.error("Failed to load users");
  }
};

export const deleteAdminUser = (userId) => async (dispatch) => {
  try {
    await API.delete(`/admin/users/${userId}`);
    dispatch(removeAdminUser(userId));
    toast.success("User deleted");
  } catch (err) {
    toast.error("Failed to delete user");
  }
};

export const fetchAdminJobs = () => async (dispatch) => {
  try {
    const res = await API.get("/admin/jobs");
    dispatch(setAdminJobs(res.data));
  } catch (err) {
    toast.error("Failed to load jobs");
  }
};

export const deleteAdminJob = (jobId) => async (dispatch) => {
  try {
    await API.delete(`/admin/jobs/${jobId}`);
    dispatch(removeAdminJob(jobId));
    toast.success("Job deleted");
  } catch (err) {
    toast.error("Failed to delete job");
  }
};

export const fetchAdminApplications = () => async (dispatch) => {
  try {
    const res = await API.get("/admin/applications");
    dispatch(setAdminApplications(res.data));
  } catch (err) {
    toast.error("Failed to load applications");
  }
};