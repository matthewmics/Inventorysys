<template>
  <div class="content">
    <div>
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">Inventory</h1>
        </md-table-toolbar>
        <md-table-row>
          <md-table-head style="width: 25%">Item</md-table-head>
          <md-table-head style="width: 20%">Type</md-table-head>
          <md-table-head style="width: 25%">Status</md-table-head>
          <md-table-head style="width: 25%">Room</md-table-head>
          <md-table-head>Actions</md-table-head>
        </md-table-row>

        <md-table-row
          v-if="!inventoryItems.data || inventoryItems.length === 0"
        >
          <md-table-cell><b>No records</b></md-table-cell>
        </md-table-row>

        <md-table-row v-for="item in inventoryItems.data" :key="item.id">
          <md-table-cell
            >{{ item.name }}
            <div style="font-size: 11px; color: #616161">
              {{ "SN: " + item.serial_number }}
            </div></md-table-cell
          >
          <md-table-cell>{{ item.item_type }}</md-table-cell>
          <md-table-cell>{{ item.status }}</md-table-cell>
          <md-table-cell>
            <!-- {{
            item.room_id  ? item.room.name : "-"
          }} -->
            <span v-if="!item.room_id"></span>
            <span v-else>{{ item.room.name }}</span>
          </md-table-cell>
          <md-table-cell> - </md-table-cell>
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
      totalPage: 1,
      currentPage: 1,

      inventoryItems: {},
      loading: false,
    };
  },
  components: {
    SlidingPagination,
  },
  methods: {
    pageChanged(e) {
      this.loadPagination(page);
    },
    async loadInventory(page) {
      this.loading = true;
      try {
        const response = await agent.Custodian.listInventory();
        this.inventoryItems = response;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    loadPagination(page) {
      this.loadInventory(page).then(() => {
        this.currentPage = page;
        this.totalPage = this.inventoryItems.last_page;
      });
    },
  },
  created() {
    this.loadPagination(1);
  },
};
</script>

<style>
</style>