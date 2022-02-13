import axios from "axios";
import { getToken } from "./helpers";

export const apiUrl = "http://192.168.0.17:5000";

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
  itemParents: (id) => requests.get(`/rooms/${id}/item-parents`),
  items: (id, parentId) =>
    requests.get(`/rooms/${id}/parents/${parentId}/items`),
};

const Inventory = {
  parentList: () => requests.get("/inventory/parents"),
  parentListAvailable: () => requests.get("/inventory/parents-available"),
  parentInstance: (id) => requests.get(`/inventory/parents/${id}/instance`),
  parentAvailableItems: (id) =>
    requests.get(`/inventory/parents/${id}/items-available`),
  parentCreate: (request) => requests.post("/inventory/parents", request),
  parentUpdate: (request, id) =>
    requests.put(`/inventory/parents/${id}`, request),
  parentDelete: (id) => requests.delete(`/inventory/parents/${id}`),
  parentItemItems: (id) => requests.get(`/inventory/parents/${id}`),
  itemCreate: (request) => requests.post(`/inventory/items`, request),
  itemUpdate: (request, id) => requests.put(`/inventory/items/${id}`, request),
  itemDelete: (id) => requests.delete(`/inventory/items/${id}`),
};

const Department = {
  getBuildings: (id) => requests.get(`/departments/${id}`),
  setBuildings: (req, id) =>
    requests.post(`/departments/${id}/set-buildings`, req),
  current: () => requests.get("/departments"),
};

const TransferRequest = {
  itemTransfer: (req) => requests.post(`/transfers`, req),
  list: () => requests.get(`/transfers`),
};

const agent = {
  User,
  Building,
  Room,
  Inventory,
  Department,
  TransferRequest,
};

export default agent;
