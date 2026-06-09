import API from "./axios";

export const sendAIChatMessageApi = (message) => {
  return API.post("/ai/chat", { message });
};
