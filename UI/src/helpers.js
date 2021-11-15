const getToken = () =>
  window.localStorage.getItem("inventorysystem_sanctum_token");

const setToken = (token) =>
  window.localStorage.setItem("inventorysystem_sanctum_token", token);

const clearToken = () =>
  window.localStorage.removeItem("inventorysystem_sanctum_token");

export { getToken, setToken, clearToken };
