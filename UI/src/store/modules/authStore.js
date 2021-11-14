import axios from "axios";
import agent from "../../agent";
import { getToken, setToken } from "../../helpers";
import { router } from "../../main";

const state = {
  user: {
    id: 0,
    name: "",
    email: "",
  },
  authLoading: false,
};

const getters = {
  loggedInUser: (state) => state.user,
  authLoading: (state) => state.authLoading,
};

const actions = {
  async login({ commit }, request) {
    commit("setAuthLoading", true);
    try {
      const { user, token } = await agent.User.login(request);
      commit("setLoggedInUser", user);
      setToken(token);
      router.push("/dashboard");
    } catch (err) {
      throw err;
    } finally {
      commit("setAuthLoading", false);
    }
  },
  async currentUser({ commit }) {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    commit("setAuthLoading", true);
    try {
      const { user, token } = await agent.User.currentUser();
      commit("setLoggedInUser", user);

      if (router.currentRoute.path === "/login") {
        router.push("/dashboard");
      }
    } catch (err) {
      console.log(err);
    } finally {
      commit("setAuthLoading", false);
    }
  },
};

const mutations = {
  setAuthLoading: (state, isAuthLoading) => (state.authLoading = isAuthLoading),
  setLoggedInUser: (state, user) => (state.user = user),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
