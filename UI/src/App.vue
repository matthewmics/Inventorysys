<template>
  <router-view v-if="!authLoading"></router-view>
  <div v-else class="center-screen" style="flex-direction: column">
    <md-progress-spinner
      class="md-accent"
      :md-diameter="30"
      md-mode="indeterminate"
    ></md-progress-spinner>
    <h4>Loading...</h4>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  created() {
    this.currentUser();
  },
  computed: mapGetters(["authLoading"]),
  methods: {
    ...mapActions(["currentUser"]),
  },
};
</script>

<style>
.center-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
}
.clickable {
  cursor: pointer;
}
</style>
