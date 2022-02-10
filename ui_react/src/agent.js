import axios from "axios";
import { getToken } from "./helpers";

export const apiUrl = "http://127.0.0.1:5000";

axios.defaults.baseURL = apiUrl + "/api";
const sleepDuration = 0;

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

axios.interceptors.response.use(undefined, (error) => {
  throw error.response;
});

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
  list: () => requests.get(`/users`),
  find: (id) => requests.get(`/users/${id}`),
  changePassword: (id, request) =>
    requests.post(`/users/${id}/change-password`, request),
  create: (request) => requests.post(`/users`, request),
  delete: (id) => requests.delete(`/users/${id}`),
};

const Building = {
  list: () => requests.get("/buildings"),
  create: (request) => requests.post("/buildings", request),
  update: (request, id) => requests.put(`/buildings/${id}`, request),
  delete: (id) => requests.delete(`/buildings/${id}`),
};

const Room = {
  list: () => requests.get("/rooms"),
  create: (request) => requests.post("/rooms", request),
  update: (request, id) => requests.put(`/rooms/${id}`, request),
  delete: (id) => requests.delete(`/rooms/${id}`),
};

const agent = {
  User,
  Building,
  Room
};

export default agent;
