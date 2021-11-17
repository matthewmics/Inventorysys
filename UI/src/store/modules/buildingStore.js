import axios from "axios";
import agent from "../../agent";
import { getToken, setToken, clearToken } from "../../helpers";

const state = {
  buildings: [],
  buildingLoading: false,
  buildingFormLoading: false,
  formSelectedBuilding: null,
};

const getters = {
  buildingsList: (state) => state.buildings,
  buildingLoading: (state) => state.buildingLoading,
  buildingFormLoading: (state) => state.buildingFormLoading,
  buildingSelectedBuildingInForm: (state) => state.formSelectedBuilding,
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
  async addNewBuilding({ commit }, formValues) {
    commit("setBuildingFormLoading", true);
    try {
      const response = await agent.Building.create(formValues);
      commit("addToBuildingList", response);
    } catch (err) {
      console.log(err);
    } finally {
      commit("setBuildingFormLoading", false);
    }
  },
  async updateBuilding({ commit }, formValues) {
    commit("setBuildingFormLoading", true);
    try {
      const response = await agent.Building.update(formValues);
      console.log(response);
      commit("updateBuildingList", response);
    } catch (err) {
      console.log(err);
    } finally {
      commit("setBuildingFormLoading", false);
    }
  },
  async setSelectedBuildingInForm({ commit }, building) {
    commit("setSelectedBuildingInForm", building);
  },
};

const mutations = {
  setBuildingsList: (state, buildingsList) => (state.buildings = buildingsList),
  addToBuildingList: (state, toAddBuilding) =>
    state.buildings.push(toAddBuilding),
  setSelectedBuildingInForm: (state, building) => {
    state.formSelectedBuilding = building;
  },
  updateBuildingList: (state, building) => {
    return (state.buildings = state.buildings.map((b) => {
      if (b.id === building.id) return building;
      return b;
    }));
  },
  setBuildingLoading: (state, isLoading) => (state.buildingLoading = isLoading),
  setBuildingFormLoading: (state, isLoading) =>
    (state.buildingFormLoading = isLoading),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
