<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <md-dialog-confirm
      :md-active.sync="logoutDialogActive"
      md-title="Logout"
      md-content="Are you sure you want to end your session?"
      md-confirm-text="Yes"
      md-cancel-text="Cancel"
      @md-cancel="onCancel"
      @md-confirm="onConfirm"
    />

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>

      <sidebar-link to="/buildings">
        <md-icon>business</md-icon>
        <p>Buildings</p>
      </sidebar-link>

      <sidebar-link to="/rooms">
        <md-icon>meeting_room</md-icon>
        <p>Labs &amp; Rooms</p>
      </sidebar-link>
      <!-- <sidebar-link to="/user">
        <md-icon>person</md-icon>
        <p>User Profile</p>
      </sidebar-link> -->

      <!-- <sidebar-link to="/table">
        <md-icon>content_paste</md-icon>
        <p>Table list</p>
      </sidebar-link> -->

      <!-- <sidebar-link to="/typography">
        <md-icon>library_books</md-icon>
        <p>Typography</p>
      </sidebar-link>

      <sidebar-link to="/icons">
        <md-icon>bubble_chart</md-icon>
        <p>Icons</p>
      </sidebar-link> -->

      <!-- <sidebar-link to="/maps">
        <md-icon>location_on</md-icon>
        <p>Maps</p>
      </sidebar-link> -->

      <!-- <sidebar-link to="/notifications">
        <md-icon>notifications</md-icon>
        <p>Notifications</p>
      </sidebar-link> -->
      <li class="md-list-item" to="/logout">
        <a
          @click="onLogout"
          class="md-list-item-router md-list-item-container md-button-clean"
        >
          <div class="md-list-item-content md-ripple">
            <i class="md-icon md-icon-font md-theme-default">logout</i>
            <p>logout</p>
          </div>
        </a>
      </li>
    </side-bar>

    <div class="main-panel">
      <top-navbar :user="loggedInUser"></top-navbar>
      <!-- 
      <fixed-plugin
        :color.sync="sidebarBackground"
        :image.sync="sidebarBackgroundImage"
      >
      </fixed-plugin> -->

      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";
import FixedPlugin from "./Extra/FixedPlugin.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu,
    FixedPlugin,
  },
  data() {
    return {
      sidebarBackground: "green",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg"),
      logoutDialogActive: false,
    };
  },
  methods: {
    ...mapActions(["logout"]),
    onConfirm() {
      this.logout();
    },
    onCancel() {
      console.log("Cancelled logout");
    },
    onLogout() {
      this.logoutDialogActive = true;
    },
  },
  computed: mapGetters(["loggedInUser"]),
};
</script>
