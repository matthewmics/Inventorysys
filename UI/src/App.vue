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
@import "~vue-sliding-pagination/dist/style/vue-sliding-pagination.css";

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
.c-sliding-pagination__list-element {
  background: white;
  font-size: 14px;
}
.c-sliding-pagination__list-element a {
  color: black !important;
  padding: 12px;
}

.c-sliding-pagination__list-element:hover {
  background: #e1f5fe;
}

.c-sliding-pagination__list-element.c-sliding-pagination__list-element--active {
  background: #9c27b0;
}
.c-sliding-pagination__list-element.c-sliding-pagination__list-element--active
  a {
  color: white !important;
}
</style>
