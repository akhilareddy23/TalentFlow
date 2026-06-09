import API from "./axios";

export const fetchJobsApi = () => {
  return API.get("/jobs");
};

export const createJobApi = (data, token) => {
  return API.post("/jobs", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteJobApi = (id) => {
  return API.delete(`/jobs/${id}`);
};