<template>
  <div class="content">
    <md-progress-bar
      v-if="buildingLoading"
      md-mode="indeterminate"
    ></md-progress-bar>
    <div v-else>
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">
            Buildings<md-button
              style="position: absolute; right: 10px"
              class="md-raised md-primary"
              >Add new building</md-button
            >
          </h1>
        </md-table-toolbar>

        <md-table-row>
          <md-table-head style="width: 50%">Name</md-table-head>
          <md-table-head style="width: 20%">Created</md-table-head>
          <md-table-head style="width: 20%">Updated</md-table-head>
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
              <md-icon
                class="clickable"
                style="margin-right: 15px; color: #43a047"
                >edit</md-icon
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
import { dateStringToLocal } from "../../helpers";
export default {
  name: "Buildings",
  methods: {
    ...mapActions(["fetchBuildingsList"]),
    dateStringToLocal,
  },
  computed: mapGetters(["buildingsList", "buildingLoading"]),
  created() {
    console.log("created");
    this.fetchBuildingsList();
  },
};
</script>

<style scoped>
</style>