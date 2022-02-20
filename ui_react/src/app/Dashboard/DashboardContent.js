import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Icon, Label, Loader, Table } from "semantic-ui-react";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";
import { DepartmentDashboard } from "./DepartmentDashboard";

export const DashboardContent = () => {
  const { user } = useSelector((state) => state.auth);

  if (["department"].includes(user.role)) return <DepartmentDashboard />;

  return <div>No content to display.</div>;
};
