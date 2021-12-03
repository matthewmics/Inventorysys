import axios from "axios";
import agent from "../../agent";
import { getToken, setToken, clearToken } from "../../helpers";

const state = {
  roomPagiData: {},
  roomLoading: false,
};

const getters = {
  roomPagiData: (state) => state.roomPagiData,
  roomLoading: (state) => state.roomLoading,
};

const actions = {
  async fetchRoomPagi({ commit }, page) {
    commit("setRoomLoading", true);
    try {
      const response = await agent.Room.list(page);
      commit("setRoomPagiData", response);
    } catch (err) {
      console.log(err);
    } finally {
      commit("setRoomLoading", false);
    }
  },
  async addNewRoom({ commit }, formValues) {
    commit("setRoomLoading", true);
    try {
      const response = await agent.Room.create(formValues);
      commit("addToRoom", response);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      commit("setRoomLoading", false);
    }
  },
};

const mutations = {
  setRoomPagiData: (state, val) => (state.roomPagiData = val),
  setRoomLoading: (state, val) => (state.roomLoading = val),
  addToRoom: (state, val) => {
    state.roomPagiData.data = [val, ...state.roomPagiData.data];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
