import React from "react";
import { useSelector } from "react-redux";
import { DepartmentInventoryContent } from "./Department/DepartmentInventoryContent";
import { InventoryContent } from "./InventoryContent";

export const InventoryComponent = () => {
  const { user } = useSelector((state) => state.auth);

  if (user.role === "admin") return <InventoryContent />;
  if (user.role === "department") return <DepartmentInventoryContent />;

  return <div></div>;
};
