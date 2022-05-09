import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";
import { downloadBase64File } from "../../libs/download";
import { DetailsModal } from "../Commons/DetailsModal";
import { LabelBorrowStatus } from "../Commons/LabelBorrowStatus";
import { LabelRepairStatus } from "../Commons/LabelRepairStatus";
import { MessageModal } from "../Commons/MessageModal";
import { PopupButton } from "../Commons/PopupButton";
import { NotesList } from "../Notes/NotesList";
import { ProcessPIRDetails } from "./PIRHelper";

export const PIRSummary = () => {
  const dispatch = useDispatch();

  const [dt, setDt] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      name: "To Purchase",
      selector: (row) => row.to_purchase,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row) => <LabelRepairStatus status={row.status} />,
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      selector: (row) => "row.actions",
      format: (row) => (
        <>
          {" "}
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
                <NotesList id={row.id} name={"purchase"} />
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
                <DetailsModal data={ProcessPIRDetails(row)} />
              );
            }}
          />
          <PopupButton
            content="Download PO"
            iconName="download"
            onClick={async () => {
              const response = await agent.FileStorage.get(
                row.attached_file_id
              );
              downloadBase64File(response.base64, response.name);
            }}
          />
        </>
      ),
      right: true,
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await agent.PurchaseItemRequests.list();
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
