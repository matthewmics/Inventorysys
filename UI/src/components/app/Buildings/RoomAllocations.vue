<template>
  <div class="content">
    <md-progress-bar style="margin-bottom: 2em;" v-if="loading" md-mode="indeterminate"></md-progress-bar>
    <div style="font-size: 20px">
      <span class="link" @click="$router.push('/buildings')">Buildings</span>
      <span style="margin: 0px 10px">➜</span>
      <span>{{ currentBuilding ? currentBuilding.name : "Loading..." }}</span>
    </div>
    <div>
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">Allocated</h1>
        </md-table-toolbar>

        <md-table-row>
          <md-table-head style="width: 55%">Name</md-table-head>
          <md-table-head style="width: 40%">Type</md-table-head>
          <md-table-head>Actions</md-table-head>
        </md-table-row>
      </md-table>
    </div>

    <div>
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">Unallocated</h1>
        </md-table-toolbar>

        <md-table-row>
          <md-table-head style="width: 55%">Name</md-table-head>
          <md-table-head style="width: 40%">Type</md-table-head>
          <md-table-head>Actions</md-table-head>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
import agent from "../../../agent";
export default {
  data() {
    return {
      currentBuilding: null,
      loading: false,
    };
  },
  async created() {
    const buildingId = this.$route.params.id;
    this.loading = true;
    try {
      const response = await agent.Building.find(buildingId);
      this.currentBuilding = response;
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
</style>