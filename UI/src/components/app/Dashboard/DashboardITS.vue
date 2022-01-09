<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <stats-card data-background-color="green">
        <template slot="header">
          <md-icon>store</md-icon>
        </template>

        <template slot="content">
          <p class="category">Pending Transfers</p>
          <h3 class="title">{{ totalPendingTransfers }}</h3>
        </template>

        <template slot="footer">
          <div class="stats">
            <md-icon>date_range</md-icon>
            Last 30 Days
          </div>
        </template>
      </stats-card>
    </div>
    <div class="md-layout-item"></div>
    <div class="md-layout-item"></div>
    <div class="md-layout-item"></div>
  </div>
</template>

<script>
import { StatsCard } from "@/components";
import agent from "../../../agent";
export default {
  data() {
    return {
      totalPendingTransfers: 0,
    };
  },
  components: {
    StatsCard,
  },
  methods: {
    async loadTransferRequests() {
      const response = await agent.ItemTransfer.list();
      this.totalPendingTransfers = response.length;
    },
  },
  created() {
    this.loadTransferRequests();
  },
};
</script>

<style scoped>
</style>