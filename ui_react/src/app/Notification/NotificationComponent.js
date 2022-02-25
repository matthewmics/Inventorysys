import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import notificationActions from "../../actions/notificationActions";

export const NotificationComponent = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    notificationActions.loadNotifications(dispatch);
    console.log("notifications loaded.");
  }, []);

  return <></>;
};
