import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";
import { dateStringToLocal } from "../../../helpers";
import { DetailsModal } from "../../Commons/DetailsModal";
import { LabelBorrowStatus } from "../../Commons/LabelBorrowStatus";
import { PopupButton } from "../../Commons/PopupButton";

export const BorrowRequestSummary = () => {
    const dispatch = useDispatch();
  const columns = [
    {
      name: "Item",
      selector: (row) => (
        <>
          <b>{row.item.inventory_parent_item.name}</b>
          <div className="label-secondary">{row.item.serial_number}</div>
        </>
      ),
    },
    {
      name: "Status",
      selector: (row) => <LabelBorrowStatus status={row.status} />,
      center: true,
    },
    {
      name: "Actions",
      selector: (a) => (
        <>
          {" "}
          <PopupButton
            content="Details"
            iconName="book"
            color="blue"
            onClick={() => {
              modalActions.openModal(
                dispatch,
                "Borrow Details",
                <DetailsModal
                  data={{
                    Item: a.item.inventory_parent_item.name,
                    "Serial Number": a.item.serial_number,
                    From: a.current_room ? a.current_room.name : "Inventory",
                    "Borrowed for": a.destination_room.name,
                    Status: a.status.toUpperCase(),
                    Date: dateStringToLocal(a.created_at),
                    "Processed By": a.handler ? a.handler.name : "-",
                  }}
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
        noTableHead
        striped
        progressPending={loading}
      />
    </div>
  );
};
