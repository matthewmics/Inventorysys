import React from "react";
import { Label } from "semantic-ui-react";

export const LabelTransferStatus = ({ status }) => {

  if (status === "rejected") return <Label color="red">{status}</Label>;
  if (status === "in progress") return <Label color="yellow">{status}</Label>;
  if (status === "completed") return <Label color="green">{status}</Label>;

  return <Label color='blue'>{status}</Label>;
};
