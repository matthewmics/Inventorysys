<template>
  <div class="content">
    <rooms-form
      :show="showForm"
      @form-close="showForm = false"
      @form-submit="onFormSubmit"
    >
    </rooms-form>

    <div>
      <md-button @click="showForm = true" class="md-raised md-primary"
        >Add new
      </md-button>
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">Labs &amp; Rooms</h1>
        </md-table-toolbar>

        <md-table-row>
          <md-table-head style="width: 20%">Name</md-table-head>
          <md-table-head style="width: 20%">Type</md-table-head>
          <md-table-head style="width: 27%">Created</md-table-head>
          <md-table-head style="width: 27%">Updated</md-table-head>
          <md-table-head>Actions</md-table-head>
        </md-table-row>

        <md-table-row
          v-if="!roomPagiData.data || roomPagiData.data.length === 0"
        >
          <md-table-cell>
            <b>No records</b>
          </md-table-cell>
        </md-table-row>

        <md-table-row :key="room.id" v-for="room in roomPagiData.data">
          <md-table-cell> {{ room.name }}</md-table-cell>
          <md-table-cell>{{ room.room_type }}</md-table-cell>
          <md-table-cell>{{
            dateStringToLocal(room.created_at)
          }}</md-table-cell>
          <md-table-cell>{{
            dateStringToLocal(room.created_at)
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

        <md-table-row>
          <td colspan="100%">
            <md-progress-bar v-if="roomLoading" md-mode="indeterminate">
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
import RoomsForm from "./RoomsForm";

export default {
  data() {
    return {
      currentPage: 1,
      totalPage: 1,
      showForm: false,
    };
  },
  components: {
    SlidingPagination,
    RoomsForm,
  },
  emitters: ["form-close"],
  computed: mapGetters(["roomPagiData", "roomLoading"]),
  methods: {
    onFormSubmit(request) {
      this.addNewRoom(request);
    },
    ...mapActions(["fetchRoomPagi", "addNewRoom"]),
    pageChanged(page) {
      this.loadPagi(page);
    },
    dateStringToLocal,
    loadPagi(page) {
      this.fetchRoomPagi(page).then(() => {
        this.currentPage = page;
        this.totalPage = this.roomPagiData.last_page;
      });
    },
  },
  created() {
    this.loadPagi(1);
  },
};
</script>

<style scoped>
</style>