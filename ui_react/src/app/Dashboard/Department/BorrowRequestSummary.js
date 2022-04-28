import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";
import moment from "moment";
import { LabelBorrowStatus } from "../../Commons/LabelBorrowStatus";
import { BorrowDetailsObject } from "../../Borrow/BorrowHelper";
import { PopupButton } from "../../Commons/PopupButton";
import { DetailsModal } from "../../Commons/DetailsModal";
import { MessageModal } from "../../Commons/MessageModal";
import { dateStringToLocal } from "../../../helpers";
import { NotesList } from "../../Notes/NotesList";

export const BorrowRequestSummary = () => {
  const dispatch = useDispatch();
  const columns = [
    {
      name: "Borrower",
      selector: (row) => row.borrower,
    },
    {
      name: "For",
      selector: (row) => row.destination.name,
    },
    {
      name: "Requested Date",
      selector: (row) => (
        <>
          <b className="label-secondary">{moment(row.from).format("ll")}</b> TO{" "}
          <b className="label-secondary">{moment(row.to).format("ll")}</b>
        </>
      ),
    },
    {
      name: "Date Returned",
      selector: (row) =>
        row.date_returned ? dateStringToLocal(row.date_returned) : "-",
      center: true,
    },
    {
      name: "Status",
      selector: (row) => <LabelBorrowStatus status={row.status} />,
      center: true,
    },
    {
      name: "Actions",
      selector: (row) => <>-</>,
      format: (row) => (
        <>
          {row.rejection_details && (
            <PopupButton
              content="Rejection details"
              iconName="warning"
              color="red"
              onClick={() => {
                modalActions.openModal(
                  dispatch,
                  "Rejection Details",
                  <MessageModal message={row.rejection_details} />
                );
              }}
            />
          )}
          <PopupButton
            content="Notes"
            iconName="sticky note"
            color="green"
            onClick={() => {
              modalActions.openModal(
                dispatch,
                "Note(s)",
                <NotesList id={row.id} name={"borrow"} />
              );
            }}
          />
          <PopupButton
            content="Details"
            iconName="book"
            color="blue"
            onClick={() => {
              modalActions.openModal(
                dispatch,
                "Borrow Details",
                <DetailsModal
                  data={
                    !row.borrow_data
                      ? BorrowDetailsObject(row)
                      : BorrowDetailsObject(JSON.parse(row.borrow_data))
                  }
                />
              );
            }}
          />
        </>
      ),
      right: true,
    },
  ];

  const [dt, setDt] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await agent.Borrow.list();
    setDt(response);
    setLoading(false);
  };

  return (
    <div className="dashboard-segment">
      <DataTable
        columns={columns}
        data={dt}
        pagination
        striped
        progressPending={loading}
      />
    </div>
  );
};
