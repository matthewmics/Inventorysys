import React, { Fragment } from "react";

import { Dropdown, Icon, Menu, Label } from "semantic-ui-react";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import { history } from "../..";
import { DashboardContent } from "./DashboardContent";
import { UserComponent } from "../Users/UserComponent";
import { BuildingComponent } from "../Buildings/BuildingComponent";
import { RoomComponent } from "../Rooms/RoomComponent";
import { InventoryContent } from "../Inventory/InventoryContent";
import { useDispatch, useSelector } from "react-redux";
import { authSignOut } from "../../actions";
import { InventoryItemContent } from "../Inventory/InventoryItemContent";
import { InventoryItemComponent } from "../Inventory/InventoryItemComponent";
import { InventoryComponent } from "../Inventory/InventoryComponent";
import { DepartmentInventoryItemContent } from "../Inventory/Department/DepartmentInventoryItemContent";

export const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  return (
    <Fragment>
      <Menu inverted style={{ marginTop: "0px" }}>
        <Menu.Menu position="right">
          <Dropdown item text={user.name}>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  authSignOut(dispatch);
                }}
              >
                {" "}
                <Icon name="sign-out" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>

      <Menu
        inverted
        vertical
        style={{
          height: "100vh",
          position: "fixed",
          margin: "0",
          top: "0",
          overflowY: "auto",
        }}
      >
        <Menu.Item>
          <h4>Inventory System</h4>
          <Label
            style={{
              float: "initial",
              margin: "0",
              textTransform: "capitalize",
            }}
            size="small"
          >
            {user.role}
          </Label>
        </Menu.Item>

        <NavLink to="/dashboard" activeClassName="link-active">
          <Menu.Item>
            <Icon name="grid layout" />
            <span style={{ color: "rgba(255,255,255, .65)" }}>Dashboard</span>
          </Menu.Item>
        </NavLink>

        <Menu.Item>
          <Menu.Menu>
            {["admin"].includes(user.role) && (
              <>
                <Menu.Item>
                  <NavLink to="/users" activeClassName="link-active">
                    <Icon name="users" />
                    Users
                  </NavLink>
                </Menu.Item>

                <Menu.Item>
                  <NavLink to="/buildings" activeClassName="link-active">
                    <Icon name="building" />
                    Buildings
                  </NavLink>
                </Menu.Item>

                <Menu.Item>
                  <NavLink to="/rooms" activeClassName="link-active">
                    <Icon name="home" />
                    Rooms
                  </NavLink>
                </Menu.Item>
              </>
            )}

            {["admin", "department"].includes(user.role) && (
              <Menu.Item>
                <NavLink to="/inventory" activeClassName="link-active">
                  <Icon name="box" />
                  Inventory
                </NavLink>
              </Menu.Item>
            )}
          </Menu.Menu>
        </Menu.Item>
      </Menu>

      <div style={{ marginLeft: "16rem", paddingRight: "1em" }}>
        <Switch>
          <Route path="/dashboard" component={DashboardContent} />
          <Route path="/users" component={UserComponent} />
          <Route path="/buildings" component={BuildingComponent} />
          <Route path="/rooms" component={RoomComponent} />
          <Route
            path="/inventory/:id/rooms/:roomID"
            component={DepartmentInventoryItemContent}
          />
          <Route path="/inventory/:id" component={InventoryItemComponent} />
          <Route path="/inventory" component={InventoryComponent} />
          <Route path="/">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </div>
    </Fragment>
  );
};
