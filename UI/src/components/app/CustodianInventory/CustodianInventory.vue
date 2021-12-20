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

        <md-table-row v-if="false">
          <md-table-cell><b>No records</b></md-table-cell>
        </md-table-row>

        <md-table-row v-for="item in []" :key="item.id">
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
            <md-button
              @click="
                selectedItem = item;
                showAssignRoom = true;
              "
              v-if="!item.room_id"
              class="md-icon-button md-dense"
            >
              <md-icon>add</md-icon>
            </md-button>
            <span v-else>{{ item.room.name }}</span>
          </md-table-cell>
          <md-table-cell> - </md-table-cell>
        </md-table-row>

        <md-table-row>
          <td colspan="100%">
            <md-progress-bar v-if="false" md-mode="indeterminate">
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
export default {
  data() {
    return {
      totalPage: 1,
      currentPage: 1,
    };
  },
  components: {
    SlidingPagination,
  },
  methods: {
    pageChanged(e) {},
  },
};
</script>

<style>
</style>