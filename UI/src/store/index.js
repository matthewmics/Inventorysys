import Vuex from "vuex";
import Vue from "vue";
import authStore from "./modules/authStore.js";
import buildingStore from "./modules/buildingStore.js";
import roomStore from "./modules/roomStore.js";
import inventoryStore from "./modules/inventoryStore.js";

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    authStore,
    buildingStore,
    roomStore,
    inventoryStore,
  },
});
