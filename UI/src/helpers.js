import moment from "moment";

const getToken = () =>
  window.localStorage.getItem("inventorysystem_sanctum_token");

const setToken = (token) =>
  window.localStorage.setItem("inventorysystem_sanctum_token", token);

const clearToken = () =>
  window.localStorage.removeItem("inventorysystem_sanctum_token");

const dateStringToLocal = (date) => {
  var stillUtc = moment.utc(date).toDate();
  return moment(stillUtc).local().format("YYYY-MM-DD hh:mm:ss");
};

export { getToken, setToken, clearToken, dateStringToLocal };
