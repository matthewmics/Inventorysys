import axios from "axios";
import agent from "../../agent";
import { getToken, setToken, clearToken } from "../../helpers";

const state = {
  builldings: [],
  buildingLoading: false,
};

const getters = {
  buildingsList: (state) => state.builldings,
  buildingLoading: (state) => state.buildingLoading,
};

const actions = {
  async fetchBuildingsList({ commit }) {
    commit("setBuildingLoading", true);
    try {
      const response = await agent.Building.list();
      commit("setBuildingsList", response);
    } catch (err) {
      console.log(err);
    } finally {
      commit("setBuildingLoading", false);
    }
  },
};

const mutations = {
  setBuildingsList: (state, buildingsList) =>
    (state.builldings = buildingsList),
  setBuildingLoading: (state, isLoading) => (state.buildingLoading = isLoading),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
