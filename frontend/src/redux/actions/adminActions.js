import API from "../../api/axios";
import { adminStart, adminSuccess, adminFail } from "../slices/adminSlice";

export const fetchAdminStats = () => async (dispatch) => {
  try {
    dispatch(adminStart());

    const res = await API.get("/admin/stats");

    dispatch(adminSuccess(res.data));
  } catch (err) {
    dispatch(adminFail(err.response?.data?.message));
  }
};