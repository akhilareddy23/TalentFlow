import { createSlice } from "@reduxjs/toolkit";
import { getProfileApi, updateProfileApi } from "../../api/profileApi";
import { toast } from "react-hot-toast";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    userProfile: null,
    profileStrength: 0,
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProfileData: (state, action) => {
      state.userProfile = action.payload.user;
      state.profileStrength = action.payload.profileStrength;
    },
  },
});

export const { setLoading, setProfileData } = profileSlice.actions;

// Thunks
export const fetchUserProfile = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await getProfileApi();
    dispatch(setProfileData(res.data));
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateUserProfile = (profileData, callback) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await updateProfileApi(profileData);
    toast.success(res.data.message || "Profile updated successfully!");
    dispatch(setProfileData(res.data));
    if (callback) callback(null);
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to update profile";
    toast.error(errorMsg);
    if (callback) callback(err);
  } finally {
    dispatch(setLoading(false));
  }
};

export default profileSlice.reducer;
