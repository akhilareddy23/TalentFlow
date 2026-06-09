import axios from "./axios";

export const loginApi = (data) =>
  axios.post("/auth/login", data);

export const registerApi = (data) =>
  axios.post("/auth/register", data);