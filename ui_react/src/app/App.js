import "../semantic-ui-css/semantic.min.css";
import "../index.css";

import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../actions";
import { DashboardLayout } from "./Dashboard/DashboardLayout";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";
import { NotificationComponent } from "./Notification/NotificationComponent";

export const App = () => {
  const { loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  return (
    <Fragment>
      <ToastContainer position="bottom-right" pauseOnFocusLoss={false} />
      {!user.name || loading ? (
        <Loader
          active
          inline="centered"
          content="Loading"
          style={{ marginTop: "2.5em" }}
        />
      ) : (
        <>
          <DashboardLayout></DashboardLayout>
          <NotificationComponent />
        </>
      )}
    </Fragment>
  );
};
