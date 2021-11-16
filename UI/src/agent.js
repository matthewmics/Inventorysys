import axios from "axios";
import { getToken } from "./helpers";

axios.defaults.baseURL = process.env.VUE_APP_API_URL + "/api";
const sleepDuration = process.env.VUE_APP_API_SLEEP_DURATION;

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const responseBody = (response) => response.data;

const sleep = (ms) => (response) =>
  new Promise((resolve) => setTimeout(() => resolve(response), ms));

const requests = {
  get: (url) => axios.get(url).then(sleep(sleepDuration)).then(responseBody),
  post: (url, body) =>
    axios.post(url, body).then(sleep(sleepDuration)).then(responseBody),
  put: (url, body) =>
    axios.put(url, body).then(sleep(sleepDuration)).then(responseBody),
  delete: (url) =>
    axios.delete(url).then(sleep(sleepDuration)).then(responseBody),
};

const User = {
  login: (formValues) => requests.post("/auth/login", formValues),
  currentUser: () => requests.get("/auth/me"),
  logout: () => requests.post("/auth/logout"),
};

const Building = {
  list: () => requests.get("/buildings"),
  find: (id) => requests.get(`/buildings/${id}`),
  delete: (id) => requests.delete(`/buildings/${id}`),
  update: (id) => requests.put(`/buildings/${id}`),
  create: (formValues) => requests.put(`/buildings`, formValues),
};

const agent = {
  User,
  Building,
};

export default agent;
