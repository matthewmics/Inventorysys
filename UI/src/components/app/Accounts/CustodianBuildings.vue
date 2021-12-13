<template>
  <md-dialog
    style="min-width: 300px"
    :md-active.sync="show"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    @md-opened="onOpen"
  >
    <md-dialog-title v-if="custodian">
      {{ custodian.name }}
    </md-dialog-title>
    <md-dialog-content v-if="loading">
      <div class="center-parent">
        <md-progress-spinner
          :md-diameter="30"
          md-mode="indeterminate"
        ></md-progress-spinner>
      </div>
    </md-dialog-content>
    <md-dialog-content v-if="!loading">
      <form id="myForm" @submit.prevent="onSubmit">
        <md-field>
          <label>Buildings</label>
          <md-select v-model="selectedBuildings" md-dense multiple>
            <md-option
              v-for="building in buildings"
              :key="building.id"
              :value="building.id"
              >{{ building.name }}</md-option
            >
          </md-select>
        </md-field>
      </form>
    </md-dialog-content>

    <md-dialog-actions v-if="!loading">
      <md-button class="md-accent" @click="$emit('custodian-buildings-close')"
        >Close</md-button
      >
      <md-button form="myForm" class="md-primary" type="submit">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import agent from "../../../agent";
export default {
  data() {
    return {
      selectedBuildings: [],
      buildings: [],
      loading: false,
    };
  },
  props: {
    show: false,
    custodian: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  methods: {
    async onOpen() {
      if (!this.custodian) return;
      this.loading = true;
      try {
        const response1 = await agent.Building.listAll();
        const response2 = await agent.Custodian.listBuildings(
          this.custodian.id
        );
        this.buildings = response1;
        this.selectedBuildings = response2.map((b) => b.id);
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    async onSubmit(e) {
      const request = {
        building_ids: this.selectedBuildings,
        user_id: this.custodian.id,
      };
      // this.$emit("custodian-buildings-submit", request);

      this.loading = true;
      try {
        await agent.Building.custodianAllocate(request);
      } catch (err) {
        alert("Something went wrong!");
      } finally {
        this.loading = false;
      }

      this.$emit("custodian-buildings-close");
    },
  },
};
</script>

<style>
.md-dialog-container {
  min-width: 500px !important;
}
.md-list-item-text {
  position: unset !important;
}
</style>