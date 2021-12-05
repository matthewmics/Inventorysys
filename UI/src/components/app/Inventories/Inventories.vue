<template>
  <div class="content">
    <InventoriesForm
      :show="showForm"
      @form-close="showForm = false"
      @form-submit="onFormSubmit"
    />

    <md-progress-bar
      v-if="inventoryLoading"
      md-mode="indeterminate"
    ></md-progress-bar>

    <div>
      <md-button @click="showForm = true" class="md-raised md-primary"
        >Add new</md-button
      >
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">Inventory</h1>
        </md-table-toolbar>
        <md-table-row>
          <md-table-head style="width: 20%">Name</md-table-head>
          <md-table-head style="width: 15%">Type</md-table-head>
          <md-table-head style="width: 15%">Qty</md-table-head>
          <md-table-head style="width: 22.5%">Created</md-table-head>
          <md-table-head style="width: 22.5%">Updated</md-table-head>
          <md-table-head>Actions</md-table-head>
        </md-table-row>

        <md-table-row
          v-if="!inventoryPagiData.data || inventoryPagiData.data.length === 0"
        >
          <md-table-cell><b>No records</b></md-table-cell>
        </md-table-row>

        <md-table-row v-for="item in inventoryPagiData.data" :key="item.id">
          <md-table-cell>{{ item.name }}</md-table-cell>
          <md-table-cell>{{ item.item_type }}</md-table-cell>
          <md-table-cell>{{ item.qty }}</md-table-cell>
          <md-table-cell>{{
            dateStringToLocal(item.created_at)
          }}</md-table-cell>
          <md-table-cell>{{
            dateStringToLocal(item.updated_at)
          }}</md-table-cell>
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
import { mapGetters, mapActions } from "vuex";
import SlidingPagination from "vue-sliding-pagination";
import { dateStringToLocal } from "../../../helpers";
import InventoriesForm from "./InventoriesForm";

export default {
  data() {
    return {
      showForm: false,
      currentPage: 1,
      totalPage: 1,
    };
  },
  components: {
    SlidingPagination,
    InventoriesForm,
  },
  emitters: ["form-close", "form-submit"],
  computed: mapGetters(["inventoryPagiData", "inventoryLoading"]),
  methods: {
    ...mapActions(["fetchInventoryPagi", "createInventoryItem"]),
    dateStringToLocal,
    loadPagi(page) {
      this.fetchInventoryPagi(page).then(() => {
        this.currentPage = page;
        this.totalPage = this.inventoryPagiData.last_page;
      });
    },
    pageChanged(page) {
      this.loadPagi(page);
    },
    onFormSubmit(req) {
      // console.log(req);
      this.createInventoryItem(req);
    },
  },
  created() {
    this.loadPagi(1);
  },
};
</script>

<style scoped>
</style>