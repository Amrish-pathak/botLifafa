import axios from "axios";

const api = axios.create({
  baseURL: "https://tgautomactiontool-backend.onrender.com",
});

export default api;
