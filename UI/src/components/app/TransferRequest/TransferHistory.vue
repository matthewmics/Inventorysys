<template>
  <div class="content">
    <div>
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">History</h1>
        </md-table-toolbar>
        <md-table-row>
          <md-table-head>Requested By</md-table-head>
          <md-table-head>Handled By</md-table-head>
          <md-table-head>Item</md-table-head>
          <md-table-head>From</md-table-head>
          <md-table-head>To</md-table-head>
          <md-table-head>Result</md-table-head>
          <md-table-head>Date</md-table-head>
        </md-table-row>

        <md-table-row
          v-if="!transferHistoryPage.data || transferHistoryPage.length === 0"
        >
          <md-table-cell><b>No records</b></md-table-cell>
        </md-table-row>

        <md-table-row v-for="row in transferHistoryPage.data" :key="row.id">
          <md-table-cell>{{ row.custodian.name }}</md-table-cell>
          <md-table-cell>{{ row.acceptor.name }}</md-table-cell>
          <md-table-cell>
            {{ row.item_transfer.inventory_item.name }}
          </md-table-cell>
          <md-table-cell>
            {{ row.room_from.name }}
          </md-table-cell>
          <md-table-cell>
            {{ row.room_to.name }}
          </md-table-cell>
          <md-table-cell>
            {{ row.transfer_result }}
          </md-table-cell>
          <md-table-cell>
            {{ dateStringToLocal(row.created_at) }}
          </md-table-cell>
        </md-table-row>

        <md-table-row>
          <td colspan="100%">
            <md-progress-bar v-if="loading" md-mode="indeterminate">
            </md-progress-bar>
          </td>
        </md-table-row>
      </md-table>

      <sliding-pagination
        style="float: right"
        :current="currentPage"
        :total="totalPage"
        @page-change="pageChanged"
      >
      </sliding-pagination>
    </div>
  </div>
</template>

<script>
import SlidingPagination from "vue-sliding-pagination";
import { dateStringToLocal } from "../../../helpers";
import agent from "../../../agent";

export default {
  data() {
    return {
      loading: false,
      transferHistoryPage: {},

      totalPage: 1,
      currentPage: 1,
    };
  },
  components: {
    SlidingPagination,
  },
  methods: {
    dateStringToLocal,
    async loadHistory(page) {
      this.loading = true;
      const response = await agent.ItemTransfer.history(page);
      this.transferHistoryPage = response;
      this.loading = false;
    },
    loadPagination(page) {
      this.loadHistory(page).then(() => {
        this.currentPage = page;
        this.totalPage = this.inventoryItems.last_page;
      });
    },
    pageChanged(e) {
      this.loadPagination(e);
    },
  },
  created() {
    this.loadPagination(1);
  },
};
</script>

<style scoped>
</style>