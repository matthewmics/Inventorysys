import axios from "axios";
import agent from "../../agent";

const state = {
  user: {
    id: 0,
    name: "",
    email: "",
  },
  loginLoading: false,
};

const getters = {
  loggedInUser: (state) => state.user,
};

const actions = {
  async login({ commit }, request) {
    commit("setLoadingLoading", true);
    try {
      const response = await agent.User.login(request);
    } catch (err) {
      console.log(err);
      alert("Invalid email/password");
    }
    commit("setLoadingLoading", false);
  },
};

const mutations = {
  setLoadingLoading: (state, isLoading) => (state.loginLoading = isLoading),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
