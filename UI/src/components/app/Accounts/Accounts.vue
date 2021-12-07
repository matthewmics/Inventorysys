<template>
  <div class="content">
    <AccountsForm
      :show="showForm"
      :role="selectedRole"
      @form-close="showForm = false"
      @form-submit="onFormSubmit"
    />
    <md-tabs @md-changed="tabChanged">
      <md-tab id="Admin" md-label="Admin">
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
      <md-tab id="Custodian" md-label="Custodian">
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
      <md-button class="md-primary" @click="openForm" :disabled="loading"
        >Add new account</md-button
      >
    </div>
  </div>
</template>

<script>
import agent from "../../../agent";
import AccountsForm from "./AccountsForm";
import { dateStringToLocal } from "../../../helpers";
export default {
  data() {
    return {
      loading: false,
      admins: [],
      custodians: [],
      showForm: false,
      selectedRole: "Admin",
    };
  },
  components: {
    AccountsForm,
  },
  emitters: ["form-close", "form-submit"],
  created() {
    this.fetchAccounts();
  },
  methods: {
    tabChanged(e) {
      this.selectedRole = e;
    },
    onFormSubmit(e) {
      this.addNewAccount(e, this.selectedRole);
      console.log(e);
    },
    openForm() {
      this.showForm = true;
      // this.$notify({
      //   message:
      //     "Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer.",
      //   icon: "add_alert",
      //   horizontalAlign: "center",
      //   verticalAlign: "top",
      //   type: "danger",
      // });
    },
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
    async addNewAccount(req, role) {
      this.loading = true;
      try {
        const response = await agent.Account.create(req);
        switch (role) {
          case "Custodian":
            this.custodians = [response, ...this.custodians];
            break;
          default:
            this.admins = [response, ...this.admins];
        }
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
  background-color: #e0e0e0 !important;
}
.md-tabs-navigation .md-button-content {
  color: #616161;
}
</style>