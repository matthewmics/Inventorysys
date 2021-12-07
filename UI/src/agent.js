import axios from "axios";
import { getToken } from "./helpers";

axios.defaults.baseURL = process.env.VUE_APP_API_URL + "/api";
const sleepDuration = process.env.VUE_APP_API_SLEEP_DURATION;
console.log(sleepDuration);

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
  list: (page) => requests.get(`/buildings?page=${page}`),
  create: (formValues) => requests.post(`/buildings`, formValues),
  find: (id) => requests.get(`/buildings/${id}`),
  delete: (id) => requests.delete(`/buildings/${id}`),
  update: (formValues) =>
    requests.put(`/buildings/${formValues.id}`, formValues),
  rooms: (id) => requests.get(`/buildings/${id}/rooms`),
};

const Room = {
  list: (page) => requests.get(`/rooms?page=${page}`),
  listUnallocated: () => requests.get(`/rooms/unallocated`),
  create: (formValues) => requests.post(`/rooms`, formValues),
  allocate: (id, val) => requests.post(`/rooms/${id}/allocate`, val),
  unallocate: (id) => requests.post(`/rooms/${id}/unallocate`, {}),
};

const Inventory = {
  list: (page) => requests.get(`/inventories?page=${page}`),
  create: (formValues) => requests.post(`/inventories`, formValues),
};

const Account = {
  list: (page) => requests.get(`/accounts?page=${page}`),
  create: (formValues) => requests.post(`/accounts`, formValues),
};

const agent = {
  User,
  Building,
  Room,
  Inventory,
  Account,
};

export default agent;
