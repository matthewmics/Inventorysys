import axios from "axios";
import agent from "../../agent";
import { getToken, setToken, clearToken } from "../../helpers";

const state = {
  inventoryPagiData: {},
  inventoryLoading: false,
};

const getters = {
  inventoryPagiData: (state) => state.inventoryPagiData,
  inventoryLoading: (state) => state.inventoryLoading,
};

const actions = {
  async fetchInventoryPagi({ commit }, page) {
    commit("setInventoryLoading", true);
    try {
      const response = await agent.Inventory.list(page);
      commit("setInventoryPagiData", response);
    } catch (err) {
    } finally {
      commit("setInventoryLoading", false);
    }
  },
  async createInventoryItem({ commit }, req) {
    commit("setInventoryLoading", true);
    try {
      const response = await agent.Inventory.create(req);
      commit("addNewInventoryItem", response);
    } catch (err) {
    } finally {
      commit("setInventoryLoading", false);
    }
  },
};

const mutations = {
  setInventoryPagiData: (state, val) => (state.inventoryPagiData = val),
  setInventoryLoading: (state, val) => (state.inventoryLoading = val),
  addNewInventoryItem: (state, val) => {
    state.inventoryPagiData.data = [val, ...state.inventoryPagiData.data];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
