import React from "react";
import { useSelector } from "react-redux";
import { BorrowContent as WorkerBorrowContent } from "./Worker/BorrowContent";
import { BorrowContent as DepartmentBorrowContent } from "./Department/BorrowContent";

export const BorrowComponent = () => {
  const { user } = useSelector((state) => state.auth);
  return <DepartmentBorrowContent />;
  // if (user.role === "department") return <DepartmentBorrowContent />;
  // else return <WorkerBorrowContent />;
};
