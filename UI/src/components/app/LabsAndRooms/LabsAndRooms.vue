<template>
  <div class="content">
    <md-progress-bar v-if="false" md-mode="indeterminate"></md-progress-bar>
    <div>
      <md-button class="md-raised md-primary">Add new</md-button>
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">Labs &amp; Rooms</h1>
        </md-table-toolbar>

        <md-table-row>
          <md-table-head style="width: 50%">Name</md-table-head>
          <md-table-head style="width: 22.5%">Created</md-table-head>
          <md-table-head style="width: 22.5%">Updated</md-table-head>
          <md-table-head>Actions</md-table-head>
        </md-table-row>

        <md-table-row>
          <md-table-cell>-</md-table-cell>
          <md-table-cell>-</md-table-cell>
          <md-table-cell>-</md-table-cell>
          <md-table-cell>
            <div>
              <span class="clickable"
                ><md-icon style="margin-right: 15px; color: #43a047"
                  >edit</md-icon
                ></span
              >
              <span class="clickable">
                <md-icon class="clickable" style="color: #e53935"
                  >delete</md-icon
                >
              </span>
            </div>
          </md-table-cell>
        </md-table-row>
      </md-table>

      <sliding-pagination
        style="float: right"
        :current="currentPage"
        :total="totalPage"
        @page-change="pageChanged"
      ></sliding-pagination>
    </div>
  </div>
</template>

<script>
import SlidingPagination from "vue-sliding-pagination";
export default {
  data() {
    return {
      currentPage: 1,
      totalPage: 1,
    };
  },
  components: {
      SlidingPagination
  },
  methods: {
    pageChanged(page) {},
  },
};
</script>

<style scoped>
</style>