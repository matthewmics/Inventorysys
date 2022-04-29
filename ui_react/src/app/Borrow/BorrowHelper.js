import { Label } from "semantic-ui-react";
import moment from "moment";
import { LabelBorrowStatus } from "../Commons/LabelBorrowStatus";
import { dateStringToLocal } from "../../helpers";

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
    "Created At": dateStringToLocal(row.created_at),
    "Requested Date": (
      <>
        <b className="label-secondary">{moment(row.from).format("ll")}</b> TO{" "}
        <b className="label-secondary">{moment(row.to).format("ll")}</b>
      </>
    ),
    Status: <LabelBorrowStatus status={row.status} />,
    "Worked On By": row.worker ? row.worker.name : "-",
    "Action Date": row.date_processed
      ? dateStringToLocal(row.date_processed)
      : "-",
    "Borrowed Items":
      row.items.length === 0 ? (
        "NONE"
      ) : (
        <LabelBorrowedItems items={row.items} />
      ),
  };
};
