import moment from "moment";

const tokenName = "inventory2_sanctum_token";

const getToken = () => window.localStorage.getItem(tokenName);

const setToken = (token) => window.localStorage.setItem(tokenName, token);

const clearToken = () => window.localStorage.removeItem(tokenName);

const dateStringToLocal = (date) => {
  var stillUtc = moment.utc(date).toDate();
  // return moment(stillUtc).local().format("YYYY-MM-DD hh:mm:ss");
  return moment(stillUtc).local().format("LLL");
};

const toMoney = (price) => {
  return "₱" + price.toFixed(2);
};

const titleCase = (str) => {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
};

export {
  getToken,
  setToken,
  clearToken,
  dateStringToLocal,
  toMoney,
  titleCase,
};
