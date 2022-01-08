<template>
  <div class="content">
    <md-dialog-confirm
      :md-active.sync="confirmActive"
      :md-title="isAccept ? 'Confirm Accept' : 'Confirm Decline'"
      :md-content="
        isAccept
          ? 'Are you sure you want to accept this request?'
          : 'Are you sure you want to decline this request?'
      "
      md-confirm-text="Yes"
      md-cancel-text="No"
      @md-cancel="onCancel"
      @md-confirm="onConfirm"
    />

    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Requests</h1>
      </md-table-toolbar>

      <md-table-row>
        <md-table-head style="width: 25%">Requested By</md-table-head>
        <md-table-head style="width: 20%">From</md-table-head>
        <md-table-head style="width: 20%">To</md-table-head>
        <md-table-head style="width: 20%">Date</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>

      <md-table-row v-if="transferList.length === 0">
        <td colspan="100%" class="md-table-row">
          <b>No requests</b>
        </td>
      </md-table-row>

      <md-table-row v-for="row in transferList" :key="row.id">
        <md-table-cell>{{ row.user.name }}</md-table-cell>
        <md-table-cell>{{ row.inventory_item.room.name }}</md-table-cell>
        <md-table-cell>{{ row.room.name }}</md-table-cell>
        <md-table-cell>{{ dateStringToLocal(row.created_at) }}</md-table-cell>
        <md-table-cell>
          <md-button
            class="md-icon-button md-dense md-primary"
            @click="
              selectedRequest = row;
              isAccept = true;
              confirmActive = true;
            "
          >
            <md-icon>check</md-icon>
            <md-tooltip md-direction="top">Accept</md-tooltip>
          </md-button>
          <md-button
            @click="
              selectedRequest = row;
              isAccept = false;
              confirmActive = true;
            "
            class="md-icon-button md-dense"
            style="background-color: red !important"
          >
            <md-icon>cancel</md-icon>
            <md-tooltip md-direction="top">Decline</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>

      <md-table-row>
        <td colspan="100%">
          <md-progress-bar v-if="loading" md-mode="indeterminate">
          </md-progress-bar>
        </td>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import agent from "../../../agent";
import { dateStringToLocal } from "../../../helpers";

export default {
  data() {
    return {
      loading: false,
      transferList: [],
      selectedRequest: null,
      confirmActive: false,
      isAccept: false,
      dialogTitle: "Confirm decline",
      dialogDescription: "Are you sure you want to accept this request?",
    };
  },
  methods: {
    dateStringToLocal,
    async loadTransferRequests() {
      this.loading = true;
      const response = await agent.ItemTransfer.list();
      this.transferList = response;
      this.loading = false;
    },
    onCancel() {},
    async onConfirm() {
      this.loading = true;

      if (this.isAccept) {
        await agent.ItemTransfer.accept(this.selectedRequest.id);
      } else {
        await agent.ItemTransfer.decline(this.selectedRequest.id);
      }

      this.loading = false;

      this.loadTransferRequests();
    },
  },
  created() {
    this.loadTransferRequests();
  },
};
</script>

<style scoped>
</style>