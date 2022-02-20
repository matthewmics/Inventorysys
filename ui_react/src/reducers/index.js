import { combineReducers } from "redux";
import loggedReducer from "./isLogged";
import counterReducer from "./counter";
import authReducer from "./authReducer";
import modalReducer from './modalReducer';

const allReducers = combineReducers({
  counter: counterReducer,
  logged: loggedReducer,
  auth: authReducer,
  modal: modalReducer,
});

export default allReducers;
