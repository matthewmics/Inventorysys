import { Label } from "semantic-ui-react";
import moment from 'moment'
import { LabelBorrowStatus } from "../Commons/LabelBorrowStatus";

export const LabelBorrowedItems = ({ items }) => {
  const itemObj = {};

  items.forEach((element) => {
    let key = element.inventory_parent_item.name;

    if (!itemObj.hasOwnProperty(key)) {
      itemObj[key] = 1;
    } else {
      itemObj[key] = itemObj[key] + 1;
    }
  });

  return Object.entries(itemObj).map(([k, v], index) => {
    return (
      <Label key={index}>
        {k}
        <Label.Detail>{v}</Label.Detail>
      </Label>
    );
  });
};

export const BorrowDetailsObject = (row) => {
  return {
    Borrower: (
      <>
        <b>{row.borrower}</b>
      </>
    ),
    "To Borrow": row.borrow_details,
    Purpose: row.purpose,
    For: <Label>{row.destination.name}</Label>,
    From: moment(row.from).format("ll"),
    To: moment(row.to).format("ll"),
    Status: <LabelBorrowStatus status={row.status} />,
    "Processed by": row.worker ? row.worker.name : "-",
    Items:
      row.items.length === 0 ? "-" : <LabelBorrowedItems items={row.items} />,
  };
};
