import API from "./axios";

export const getProfileApi = () => {
  return API.get("/profile");
};

export const updateProfileApi = (data) => {
  return API.put("/profile", data);
};

export const uploadResumeApi = (formData) => {
  return API.post("/profile/upload-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
