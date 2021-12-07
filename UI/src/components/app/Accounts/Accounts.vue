<template>
  <div class="content">
    <!-- form placeholder -->
    <md-tabs>
      <md-tab id="tab-home" md-label="Admin">
        <md-table>
          <md-table-row>
            <md-table-head>Name</md-table-head>
            <md-table-head>Created At</md-table-head>
            <md-table-head>Updated At</md-table-head>
            <md-table-head>Actions</md-table-head>
          </md-table-row>
          <md-table-row v-if="admins.length === 0">
            <md-table-cell colspan="4">No records</md-table-cell>
          </md-table-row>
          <md-table-row v-for="account in admins" :key="account.id">
            <md-table-cell>{{ account.name }}</md-table-cell>
            <md-table-cell>{{
              dateStringToLocal(account.created_at)
            }}</md-table-cell>
            <md-table-cell>{{
              dateStringToLocal(account.updated_at)
            }}</md-table-cell>
            <md-table-cell>-</md-table-cell>
          </md-table-row>
        </md-table>
      </md-tab>
      <md-tab id="tab-pages" md-label="Custodian">
        <md-table>
          <md-table-row>
            <md-table-head>Name</md-table-head>
            <md-table-head>Created At</md-table-head>
            <md-table-head>Updated At</md-table-head>
            <md-table-head>Actions</md-table-head>
          </md-table-row>
          <md-table-row v-if="custodians.length === 0">
            <md-table-cell colspan="4">No records</md-table-cell>
          </md-table-row>
          <md-table-row v-for="account in custodians" :key="account.id">
            <md-table-cell>{{ account.name }}</md-table-cell>
            <md-table-cell>{{
              dateStringToLocal(account.created_at)
            }}</md-table-cell>
            <md-table-cell>{{
              dateStringToLocal(account.updated_at)
            }}</md-table-cell>
            <md-table-cell>-</md-table-cell>
          </md-table-row>
        </md-table>
      </md-tab>
    </md-tabs>

    <div>
      <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
    </div>

    <div>
      <md-button class="md-primary">Add new account</md-button>
    </div>
  </div>
</template>

<script>
import agent from "../../../agent";
import { dateStringToLocal } from "../../../helpers";
export default {
  data() {
    return {
      loading: false,
      admins: [],
      custodians: [],
    };
  },
  created() {
    this.fetchAccounts();
  },
  methods: {
    dateStringToLocal,
    async fetchAccounts() {
      this.loading = true;
      try {
        const response = await agent.Account.list();
        this.admins = response.filter((a) => a.role === "Admin");
        this.custodians = response.filter((a) => a.role === "Custodian");
        console.log(response);
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.md-tabs-navigation {
  background-color: #999 !important;
}
</style>