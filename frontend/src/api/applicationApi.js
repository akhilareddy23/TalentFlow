import API from "./axios";

export const applyJobApi = (jobId, data) => {
  return API.post(`/applications/apply/${jobId}`, data);
};

export const getMyApplicationsApi = () => {
  return API.get("/applications/my-applications");
};

export const getJobApplicationsApi = (jobId) => {
  return API.get(`/applications/job/${jobId}`);
};

export const updateApplicationStatusApi = (applicationId, status) => {
  return API.put(`/applications/${applicationId}/status`, { status });
};
