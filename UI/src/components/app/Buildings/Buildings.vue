<template>
  <div class="content">
    <BuildingsForm
      @on-form-submit="submitForm"
      @form-close="showForm = false"
      :show="showForm"
      :building="buildingSelectedBuildingInForm"
    />
    <md-progress-bar
      v-if="buildingLoading || buildingFormLoading"
      md-mode="indeterminate"
    ></md-progress-bar>
    <div v-if="!buildingLoading">
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">
            Buildings<md-button
              style="position: absolute; right: 10px"
              class="md-raised md-primary"
              @click="openForm(null)"
              :disabled="buildingFormLoading"
              >Add new building</md-button
            >
          </h1>
        </md-table-toolbar>

        <md-table-row>
          <md-table-head style="width: 50%">Name</md-table-head>
          <md-table-head style="width: 22.5%">Created</md-table-head>
          <md-table-head style="width: 22.5%">Updated</md-table-head>
          <md-table-head>Actions</md-table-head>
        </md-table-row>

        <md-table-row :key="building.id" v-for="building in buildingsList">
          <md-table-cell>{{ building.name }}</md-table-cell>
          <md-table-cell>{{
            dateStringToLocal(building.created_at)
          }}</md-table-cell>
          <md-table-cell>{{
            dateStringToLocal(building.updated_at)
          }}</md-table-cell>
          <md-table-cell>
            <div>
              <span class="clickable" @click="openForm(building)"
                ><md-icon style="margin-right: 15px; color: #43a047"
                  >edit</md-icon
                ></span
              >
              <md-icon class="clickable" style="color: #e53935">delete</md-icon>
            </div>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { dateStringToLocal } from "../../../helpers";
import BuildingsForm from "./BuildingsForm";

export default {
  name: "Buildings",
  data() {
    return {
      showForm: false,
    };
  },
  components: {
    BuildingsForm,
  },
  emitters: ["form-close", "on-submit-form"],
  computed: mapGetters([
    "buildingsList",
    "buildingLoading",
    "buildingFormLoading",
    "buildingSelectedBuildingInForm",
  ]),
  methods: {
    ...mapActions([
      "fetchBuildingsList",
      "addNewBuilding",
      "updateBuilding",
      "setSelectedBuildingInForm",
    ]),
    dateStringToLocal,
    openForm(building) {
      this.setSelectedBuildingInForm(building);
      this.showForm = true;
    },
    submitForm(formValues) {
      if (!formValues.hasOwnProperty("id")) this.addNewBuilding(formValues);
      else this.updateBuilding(formValues);
    },
  },
  created() {
    this.fetchBuildingsList();
  },
};
</script>

<style scoped>
</style>