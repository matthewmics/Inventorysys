<template>
  <div class="content">
    <DashboardCustodian v-if="['Custodian'].includes(loggedInUser.role)" />
    <DashboardAdmin v-if="['Admin'].includes(loggedInUser.role)" />
    <DashboardPPFO v-if="['PPFO'].includes(loggedInUser.role)" />
    <DashboardITS v-if="['ITS'].includes(loggedInUser.role)" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DashboardCustodian from "../components/app/Dashboard/DashboardCustodian";
import DashboardAdmin from "../components/app/Dashboard/DashboardAdmin";
import DashboardPPFO from "../components/app/Dashboard/DashboardPPFO";
import DashboardITS from "../components/app/Dashboard/DashboardITS";
export default {
  components: {
    DashboardCustodian,
    DashboardITS,
    DashboardAdmin,
    DashboardPPFO,
  },
  computed: mapGetters(["loggedInUser"]),
};
</script>
