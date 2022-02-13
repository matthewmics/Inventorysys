import React from "react";
import { useSelector } from "react-redux";
import { DepartmentInventoryItemContent } from "./Department/DepartmentInventoryItemContent";
import { InventoryItemContent } from "./InventoryItemContent";

export const InventoryItemComponent = () => {
  const { user } = useSelector((state) => state.auth);

  if (user.role === "admin") return <InventoryItemContent />;
  // if (user.role === "department") return <DepartmentInventoryItemContent />;

  return <div></div>;
};
