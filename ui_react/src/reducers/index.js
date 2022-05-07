import { combineReducers } from "redux";
import loggedReducer from "./isLogged";
import counterReducer from "./counter";
import authReducer from "./authReducer";
import modalReducer from "./modalReducer";
import notificationReducer from "./notificationReducer";
import reportReducer from "./reportReducer";

const allReducers = combineReducers({
  counter: counterReducer,
  logged: loggedReducer,
  auth: authReducer,
  modal: modalReducer,
  notification: notificationReducer,
  report: reportReducer,
});

export default allReducers;
