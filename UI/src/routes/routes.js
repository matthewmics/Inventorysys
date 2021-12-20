import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Notifications from "@/pages/Notifications.vue";
import Login from "../components/app/Login";
import Buildings from "../components/app/Buildings/Buildings.vue";
import LabsAndRooms from "../components/app/LabsAndRooms/LabsAndRooms.vue";
import RoomAllocations from "../components/app/Buildings/RoomAllocations";

import Inventories from "../components/app/Inventories/Inventories";
import CustodianInventory from "../components/app/CustodianInventory/CustodianInventory";
import Accounts from "../components/app/Accounts/Accounts";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "accounts",
        name: "Accounts",
        component: Accounts,
      },
      {
        path: "buildings",
        name: "Buildings",
        component: Buildings,
      },
      {
        path: "buildings/:id/rooms",
        name: "Room Allocation",
        component: RoomAllocations,
      },
      {
        path: "rooms",
        name: "Labs and Rooms",
        component: LabsAndRooms,
      },
      {
        path: "inventories",
        name: "Inventory",
        component: Inventories,
      },
      {
        path: "inventory",
        name: "Inventory",
        component: CustodianInventory,
      },
      {
        path: "table",
        name: "Table List",
        component: TableList,
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications,
      },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
];

export default routes;
