import axios from "axios";
import { apiUrl } from "./environment";
import { getToken } from "./helpers";

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
  postBlob: (url, body) =>
    axios
      .post(url, body, { responseType: "blob" })
      .then(sleep(sleepDuration))
      .then(responseBody),
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
  items: (id) => requests.get(`/buildings/${id}/items`),
};

const Room = {
  list: () => requests.get("/rooms"),
  create: (request) => requests.post("/rooms", request),
  update: (request, id) => requests.put(`/rooms/${id}`, request),
  delete: (id) => requests.delete(`/rooms/${id}`),
  itemParents: (id) => requests.get(`/rooms/${id}/item-parents`),
  items: (id, parentId) =>
    requests.get(`/rooms/${id}/parents/${parentId}/items`),
  allItems: (id) => requests.get(`/rooms/${id}/items`),
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
  itemDispose: (id) => requests.post(`/inventory/items/${id}`, {}),
  diposedItemList: () => requests.get(`/inventory/items/disposed`),

  itemShowComponents: (id) => requests.get(`/inventory/items/${id}/components`),
  setRoom: (id, req) => requests.post(`/inventory/items/${id}/set-room`, req),
  availableItems: () => requests.get(`/inventory/items/available`),

  unavailableItems: () => requests.get(`/inventory/items/unavailable`),
  forBorrows: (parentId, roomId) =>
    requests.get(
      `/inventory/items/for-borrows?parentId=${parentId}&roomId=${roomId}`
    ),
};

const Department = {
  getBuildings: (id) => requests.get(`/departments/${id}`),
  setBuildings: (req, id) =>
    requests.post(`/departments/${id}/set-buildings`, req),
  current: () => requests.get("/departments"),
  rooms: () => requests.get("/departments/rooms"),
};

const TransferRequest = {
  itemTransfer: (req, file) => {
    const formData = new FormData();
    Object.entries(req).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);
    return requests.post(`/transfers`, formData);
  },
  list: () => requests.get(`/transfers`),
};

const RepairRequest = {
  request: (req, file) => {
    const formData = new FormData();
    Object.entries(req).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);
    return requests.post(`/repairs`, formData);
  },
  list: () => requests.get(`/repairs`),
};

const FileStorage = {
  get: (id) => requests.get(`/file-storages/${id}`),
};

const Workers = {
  listTransferRequests: () => requests.get(`/workers/transfer-requests`),
  rejectTransferRequest: (req) =>
    requests.post(`/workers/reject-transfer-request`, req),
  workOnTransferRequest: (req) =>
    requests.post(`/workers/workon-transfer-request`, req),
  completeTransferRequest: (req) =>
    requests.post(`/workers/complete-transfer-request`, req),

  listRepairRequests: () => requests.get(`/workers/repair-requests`),
  rejectRepairRequest: (req) =>
    requests.post(`/workers/reject-repair-request`, req),
  disposeRepairRequest: (req) =>
    requests.post(`/workers/dispose-repair-request`, req),
  createJobOrder: (req) => requests.post(`/workers/repairs/job-order`, req),
};

const Notification = {
  get: () => requests.get(`/notifications`),
  read: (id) => requests.post(`/notifications/${id}/read`),
  readAll: () => requests.post(`/notifications/read-all`),
};

const JobOrders = {
  listPending: () => requests.get(`/job-orders`),
  repair: (id) => requests.post(`/job-orders/${id}/repair`, {}),
  replace: (id, req) => {
    return requests.post(`/job-orders/${id}/replace`, req);
  },
  createPO: (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return requests.post(`/job-orders/${id}/create-po`, formData);
  },
};

const PurchaseOrders = {
  list: () => requests.get(`/purchase-orders`),
  complete: (id) => requests.post(`/purchase-orders/${id}/complete`, {}),
};

const PCComponent = {
  list: () => requests.get(`/pc-components`),
  show: (id) => requests.get(`/pc-components/${id}`),
  create: (req) => requests.post(`/pc-components`, req),
  update: (id, req) => requests.put(`/pc-components/${id}`, req),
  delete: (id) => requests.delete(`/pc-components/${id}`),
};

const PCComponentInstance = {
  list: () => requests.get(`/pc-component-instances`),
  show: (id) => requests.get(`/pc-component-instances/${id}`),
  create: (req) => requests.post(`/pc-component-instances`, req),
  update: (id, req) => requests.put(`/pc-component-instances/${id}`, req),
  delete: (id) => requests.delete(`/pc-component-instances/${id}`),
  available: () => requests.get(`/pc-component-instances/available`),
  setItem: (id, req) =>
    requests.post(`/pc-component-instances/${id}/set-item`, req),
};

const ActivityLogs = {
  list: () => requests.get(`/activity-logs`),
};

const Reports = {
  roomReport: (req) => requests.post(`/reports/room`, req),
  buildingReport: (req) => requests.post(`/reports/building`, req),
  inventoryReport: (req) => requests.post(`/reports/inventory`, req),
  transferReport: (req) => requests.post(`/reports/transfer`, req),
  repairReport: (req) => requests.post(`/reports/repair`, req),
  borrowReport: (req) => requests.post(`/reports/borrow`, req),
  purchaseReport: (req) => requests.post(`/reports/purchase`, req),
};

const Notes = {
  create: (req, file) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    Object.entries(req).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return requests.post(`/notes`, formData);
  },
  show: (id, name) => requests.get(`/notes?name=${name}&id=${id}`),
};

const Borrow = {
  borrowRequest: (req) => requests.post(`/borrows`, req),
  list: () => requests.get(`/borrows`),
  show: (id) => requests.get(`/borrows/${id}`),
  processable: () => requests.get(`/borrows/processable`),

  inprogress: (id) => requests.post(`/borrows/${id}/inprogress`, {}),
  reject: (id, req) => requests.post(`/borrows/${id}/reject`, req),
  borrow: (id, req) => requests.post(`/borrows/${id}/borrow`, req),
  return: (id, req, file) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    Object.entries(req).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return requests.post(`/borrows/${id}/return`, formData);
  },
};

const PurchaseItemRequests = {
  list: () => requests.get(`/purchase-item-requests`),
  create: (req, file) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    Object.entries(req).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return requests.post(`/purchase-item-requests`, formData);
  },
  processAbles: () => requests.get(`/purchase-item-requests/processAbles`),
  reject: (id, req) =>
    requests.post(`/purchase-item-requests/${id}/reject`, req),
  createPo: (id, file) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    return requests.post(`/purchase-item-requests/${id}/create-po`, formData);
  },
};

const agent = {
  User,
  Building,
  Room,
  Inventory,
  Department,
  TransferRequest,
  FileStorage,
  Workers,
  Notification,
  RepairRequest,
  JobOrders,
  PurchaseOrders,
  PCComponent,
  PCComponentInstance,
  Borrow,
  ActivityLogs,
  Reports,
  Notes,
  PurchaseItemRequests,
};

export default agent;
