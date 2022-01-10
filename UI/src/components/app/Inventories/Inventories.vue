<template>
  <div class="content">
    <md-dialog-confirm
      :md-active.sync="deleteDialog"
      md-title="Delete"
      :md-content="`Are you sure you want to delete <b>${
        selectedItem ? selectedItem.name : ''
      }</b>?`"
      md-confirm-text="Yes"
      md-cancel-text="Cancel"
      @md-cancel="deleteDialog = false"
      @md-confirm="onDeleteItem()"
    />

    <InventoriesForm
      :show="showForm"
      @form-close="showForm = false"
      @form-submit="onFormSubmit"
    />

    <InventoryAssignRoom
      :show="showAssignRoom"
      :inventoryItem="selectedItem"
      @form-close="showAssignRoom = false"
      @form-submit="onAssignRoomSubmit"
    />

    <div>
      <md-button @click="showForm = true" class="md-raised md-primary"
        >Add new</md-button
      >
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">Inventory</h1>
        </md-table-toolbar>
        <md-table-row>
          <md-table-head style="width: 25%">Item</md-table-head>
          <md-table-head style="width: 15%">Type</md-table-head>
          <md-table-head style="width: 20%">Status</md-table-head>
          <md-table-head style="width: 20%">Room</md-table-head>
          <md-table-head style="width: 20%">Created</md-table-head>
          <md-table-head>Actions</md-table-head>
        </md-table-row>

        <md-table-row
          v-if="!inventoryPagiData.data || inventoryPagiData.data.length === 0"
        >
          <md-table-cell><b>No records</b></md-table-cell>
        </md-table-row>

        <md-table-row v-for="item in inventoryPagiData.data" :key="item.id">
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
          <md-table-cell>{{
            dateStringToLocal(item.created_at)
          }}</md-table-cell>
          <!-- <md-table-cell>{{
            dateStringToLocal(item.updated_at)
          }}</md-table-cell> -->
          <md-table-cell>
            <div>
              <span
                class="clickable"
                @click="
                  selectedItem = item;
                  deleteDialog = true;
                "
              >
                <md-icon class="clickable" style="color: #e53935"
                  >delete
                </md-icon>
              </span>
            </div>
          </md-table-cell>
        </md-table-row>

        <md-table-row>
          <td colspan="100%">
            <md-progress-bar
              v-if="inventoryLoading || loading"
              md-mode="indeterminate"
            >
            </md-progress-bar>
          </td>
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
import InventoryAssignRoom from "./InventoryAssignRoom";
import agent from "../../../agent";

export default {
  data() {
    return {
      showForm: false,
      currentPage: 1,
      totalPage: 1,
      showAssignRoom: false,
      selectedItem: {},
      loading: false,
      deleteDialog: false,
    };
  },
  components: {
    SlidingPagination,
    InventoriesForm,
    InventoryAssignRoom,
  },
  emitters: ["form-close", "form-submit"],
  computed: mapGetters(["inventoryPagiData", "inventoryLoading"]),
  methods: {
    async onDeleteItem() {
      this.loading = true;
      try {
        await agent.Inventory.delete(this.selectedItem.id);

        this.loadPagi(this.currentPage);
      } catch (err) {
        alert("Something went wrong while deleting " + this.selectedItem.name);
      } finally {
        this.loading = false;
      }
    },
    onAssignRoomSubmit(e) {
      this.assignInventoryItemRoom({
        id: this.selectedItem.id,
        req: e,
      }).then(() => {
        this.loadPagi(this.currentPage);
      });
    },
    ...mapActions([
      "fetchInventoryPagi",
      "createInventoryItem",
      "assignInventoryItemRoom",
    ]),
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