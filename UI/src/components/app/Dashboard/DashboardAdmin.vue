<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <stats-card data-background-color="green">
        <template slot="header">
          <md-icon>people</md-icon>
        </template>

        <template slot="content">
          <p class="category">New Users</p>
          <h3 class="title">{{ totalNewUsers }}</h3>
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
      totalNewUsers: 0,
    };
  },
  components: {
    StatsCard,
  },
  methods: {
    async loadUsers() {
      const response = await agent.Account.list();
      this.totalNewUsers = response.length;
    },
  },
  created() {
    this.loadUsers();
  },
};
</script>

<style scoped>
</style>