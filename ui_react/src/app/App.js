import "../semantic-ui-css/semantic.min.css";

import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../actions";
import { DashboardLayout } from "./Dashboard.js/DashboardLayout";
import { Dimmer, Loader, Segment } from "semantic-ui-react";

export const App = () => {
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  return (
    <Fragment>
      {loading ? (
        <Loader
          active
          inline="centered"
          content="Loading"
          style={{ marginTop: "2.5em" }}
        />
      ) : (
        <DashboardLayout></DashboardLayout>
      )}
    </Fragment>
  );
};
