const getToken = () =>
  window.localStorage.getItem("inventorysystem_sanctum_token");

const setToken = (token) =>
  window.localStorage.setItem("inventorysystem_sanctum_token", token);

export { getToken, setToken };
