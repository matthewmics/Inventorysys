import React, { Fragment } from "react";

import { Dropdown, Icon, Menu, Label } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { history } from "../..";

export const DashboardLayout = () => {
  return (
    <Fragment>
      <Menu inverted style={{}}>
        <Menu.Menu position="right">
          <Dropdown item text="Admin User">
            <Dropdown.Menu>
              <Dropdown.Item>
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
        style={{ height: "100vh", position: "absolute", margin: "0", top: "0" }}
      >
        <Menu.Item>
          <h4>Inventory System</h4>
          <Label style={{ float: "initial", margin: "0" }} size="small">
            Admin
          </Label>
        </Menu.Item>

        <NavLink to="/dashboard" activeClassName="link-active">
          <Menu.Item>
            <Icon name="grid layout" />
            <span style={{ color: "rgba(255,255,255, .65)" }}>
              DashboardLayout
            </span>
          </Menu.Item>
        </NavLink>

        <Menu.Item>
          <Menu.Menu>
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

            <Menu.Item>
              <NavLink to="/inventory" activeClassName="link-active">
                <Icon name="box" />
                Inventory
              </NavLink>
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>

      <div style={{ marginLeft: "16rem" }}>Content goes here.</div>
    </Fragment>
  );
};
