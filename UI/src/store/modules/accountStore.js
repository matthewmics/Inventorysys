import axios from "axios";
import agent from "../../agent";
import { getToken, setToken, clearToken } from "../../helpers";

const state = {
  accountPagiData: {},
  accountLoading: false,
};

const getters = {
  accountLoading: (state) => state.accountLoading,
  accountPagiData: (state) => state.accountPagiData,
};

const actions = {};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations,
};
