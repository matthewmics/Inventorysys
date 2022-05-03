import React from "react";
import { Label } from "semantic-ui-react";

export const ItemStatusCurrentStatusLabel = ({ item }) => {
  if (item.transfer_status === "pending") {
    return <Label color="orange">Pending for transfer</Label>;
  }

  if (item.transfer_status === "in progress") {
    return <Label color="violet">Transferring</Label>;
  }

  if (item.repair_status === "pending") {
    return <Label color="orange">Pending for repair</Label>;
  }

  if (item.repair_status === "job order created") {
    return <Label color="violet">Repairing</Label>;
  }

  if (item.borrow_status === "pending") {
    return <Label color="orange">Pending for borrow</Label>;
  }

  if (item.borrow_status === "in progress") {
    return <Label color="violet">Transferring for borrow</Label>;
  }
  if (item.borrow_status === "borrowed") {
    return <Label color="brown">Borrowed</Label>;
  }

  return <Label>Working</Label>;
};

export const ItemStatusCurrentStatusText = (item) => {
  if (item.transfer_status === "pending") {
    return "Pending for transfer";
  }

  if (item.transfer_status === "in progress") {
    return "Transferring";
  }

  if (item.repair_status === "pending") {
    return "Pending for repair";
  }

  if (item.repair_status === "job order created") {
    return "Repairing";
  }

  if (item.borrow_status === "pending") {
    return "Pending for borrow";
  }

  if (item.borrow_status === "in progress") {
    return "Transferring for borrow";
  }
  if (item.borrow_status === "borrowed") {
    return "Borrowed";
  }

  return "Working";
};


