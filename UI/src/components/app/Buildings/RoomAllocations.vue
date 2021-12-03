<template>
  <div class="content">
    <md-progress-bar
      style="margin-bottom: 2em"
      v-if="loading"
      md-mode="indeterminate"
    ></md-progress-bar>
    <div style="font-size: 20px">
      <span class="link" @click="$router.push('/buildings')">Buildings</span>
      <span style="margin: 0px 10px">➜</span>
      <span>{{ currentBuilding ? currentBuilding.name : "Loading..." }}</span>
    </div>
    <div>
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">Allocated</h1>
        </md-table-toolbar>

        <md-table-row>
          <md-table-head style="width: 40%">Name</md-table-head>
          <md-table-head style="width: 55%">Type</md-table-head>
          <md-table-head>Actions</md-table-head>
        </md-table-row>

        <md-table-row v-if="allocatedRooms.length === 0"
          ><md-table-cell colspan="3"
            ><b>No record</b></md-table-cell
          ></md-table-row
        >
        <md-table-row v-for="room in allocatedRooms" :key="room.id">
          <md-table-cell>{{ room.name }}</md-table-cell>
          <md-table-cell>{{ room.room_type }}</md-table-cell>
          <md-table-cell
            ><md-button :disabled="loading" @click="removeRoom(room.id)"
              >Remove</md-button
            ></md-table-cell
          >
        </md-table-row>
      </md-table>
    </div>

    <div>
      <md-table md-card>
        <md-table-toolbar>
          <h1 class="md-title">Unallocated</h1>
        </md-table-toolbar>

        <md-table-row>
          <md-table-head style="width: 40%">Name</md-table-head>
          <md-table-head style="width: 55%">Type</md-table-head>
          <md-table-head>Actions</md-table-head>
        </md-table-row>
        <md-table-row v-if="unallocatedRooms.length === 0"
          ><md-table-cell colspan="3"
            ><b>No record</b></md-table-cell
          ></md-table-row
        >
        <md-table-row v-for="room in unallocatedRooms" :key="room.id">
          <md-table-cell>{{ room.name }}</md-table-cell>
          <md-table-cell>{{ room.room_type }}</md-table-cell>
          <md-table-cell
            ><md-button
              @click="addRoom(room.id)"
              class="md-primary"
              :disabled="loading"
              >ADD</md-button
            ></md-table-cell
          >
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
import agent from "../../../agent";
export default {
  data() {
    return {
      currentBuilding: null,
      loading: false,
      allocatedRooms: [],
      unallocatedRooms: [],
    };
  },
  methods: {
    async addRoom(id) {
      this.loading = true;
      try {
        await agent.Room.allocate(id, {
          building_id: this.currentBuilding.id,
        });

        this.allocatedRooms = [
          this.unallocatedRooms.find((a) => a.id === id),
          ...this.allocatedRooms,
        ];
        this.unallocatedRooms = this.unallocatedRooms.filter(
          (a) => a.id !== id
        );
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    async removeRoom(id) {
      this.loading = true;
      try {
        await agent.Room.unallocate(id);
        this.unallocatedRooms = [
          this.allocatedRooms.find((a) => a.id === id),
          ...this.unallocatedRooms,
        ];
        this.allocatedRooms = this.allocatedRooms.filter((a) => a.id !== id);
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    const buildingId = this.$route.params.id;
    this.loading = true;
    try {
      const response1 = await agent.Building.find(buildingId);
      this.currentBuilding = response1;
      const response2 = await agent.Room.listUnallocated();
      this.unallocatedRooms = response2;
      const response3 = await agent.Building.rooms(buildingId);
      this.allocatedRooms = response3;
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
</style>