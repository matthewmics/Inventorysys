<template>
  <div class="content">
    <md-dialog-confirm
      :md-active.sync="deleteDialog"
      md-title="Delete"
      :md-content="`Are you sure you want to delete <b>${
        selectedBuilding ? selectedBuilding.name : ''
      }</b>?`"
      md-confirm-text="Yes"
      md-cancel-text="Cancel"
      @md-cancel="deleteDialog = false"
      @md-confirm="onDeleteBuilding(selectedBuilding.id)"
    />

    <BuildingsForm
      @on-form-submit="submitForm"
      @form-close="showForm = false"
      :show="showForm"
      :building="buildingSelectedBuildingInForm"
    />

    <div>
      <md-button
        class="md-raised md-primary"
        @click="openForm(null)"
        :disabled="buildingFormLoading || buildingLoading"
        >Add new building</md-button
      >
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">Buildings</h1>
        </md-table-toolbar>

        <md-table-row>
          <md-table-head style="width: 50%">Name</md-table-head>
          <md-table-head style="width: 22.5%">Created</md-table-head>
          <md-table-head style="width: 22.5%">Updated</md-table-head>
          <md-table-head>Actions</md-table-head>
        </md-table-row>

        <md-table-row
          v-if="!buildingsList.data || buildingsList.data.length === 0"
        >
          <md-table-cell><b>No records</b></md-table-cell>
        </md-table-row>

        <md-table-row :key="building.id" v-for="building in buildingsList.data">
          <md-table-cell
            ><div
              class="link"
              @click="$router.push(`/buildings/${building.id}/rooms`)"
            >
              {{ building.name }}
            </div></md-table-cell
          >
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
              <span
                class="clickable"
                @click="
                  selectedBuilding = building;
                  deleteDialog = true;
                "
              >
                <md-icon class="clickable" style="color: #e53935"
                  >delete</md-icon
                >
              </span>
            </div>
          </md-table-cell>
        </md-table-row>

        <md-table-row v-if="buildingLoading || buildingFormLoading">
          <td colspan="100%">
            <md-progress-bar md-mode="indeterminate"></md-progress-bar>
          </td>
        </md-table-row>
      </md-table>

      <sliding-pagination
        style="float: right"
        :current="currentPage"
        :total="totalPage"
        @page-change="pageChanged"
      ></sliding-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { dateStringToLocal } from "../../../helpers";
import BuildingsForm from "./BuildingsForm";
import SlidingPagination from "vue-sliding-pagination";

export default {
  name: "Buildings",
  data() {
    return {
      showForm: false,
      currentPage: 1,
      totalPage: 0,
      deleteDialog: false,
      selectedBuilding: null,
    };
  },
  components: {
    BuildingsForm,
    SlidingPagination,
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
      "deleteBuilding",
    ]),
    onDeleteBuilding(id) {
      try {
        deleteBuilding(id);
      } catch (err) {
        alert(
          "Something went wrong while deleting " + this.selectedBuilding.name
        );
      }
      deleteDialog = false;
    },
    pageChanged(page) {
      this.loadBuildingList(page);
    },
    dateStringToLocal,
    openForm(building) {
      this.setSelectedBuildingInForm(building);
      this.showForm = true;
    },
    submitForm(formValues) {
      if (!formValues.hasOwnProperty("id")) this.addNewBuilding(formValues);
      else this.updateBuilding(formValues);
    },
    loadBuildingList(page) {
      this.fetchBuildingsList(page).then(() => {
        this.currentPage = page;
        this.totalPage = this.buildingsList.last_page;
      });
    },
  },
  created() {
    this.loadBuildingList(this.currentPage);
  },
};
</script>

<style scoped>
</style>