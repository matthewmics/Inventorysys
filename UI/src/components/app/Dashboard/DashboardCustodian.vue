<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <div class="md-layout">
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
        >
          <md-card>
            <md-card-header data-background-color="green">
              <h4 class="title">Buildings</h4>
              <p class="category">Assigned buildings</p>
            </md-card-header>
            <md-card-content>
              <p v-for="building in buildings" :key="building.id">
                {{ building.name }}
              </p>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
    <div class="md-layout-item"></div>
    <div class="md-layout-item"></div>
    <div class="md-layout-item"></div>
  </div>
</template>

<script>
import agent from "../../../agent";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      buildings: [],
    };
  },
  methods: {
    async loadBuildings() {
      const response = await agent.Custodian.listBuildings(
        this.loggedInUser.id
      );

      this.buildings = response;
    },
  },
  computed: mapGetters(["loggedInUser"]),
  created() {
    this.loadBuildings();
  },
};
</script>

<style scoped>
</style>