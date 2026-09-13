import axios from "axios";

const api = axios.create({
  baseURL: "https://server.taskwalasolution.in",
});

export default api;
