import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Loader } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";
import { PurchaseItemRequestForm } from "./PurchaseItemRequestForm";
import { LabelRepairStatus } from "../Commons/LabelRepairStatus";
import { PopupButton } from "../Commons/PopupButton";
import { DetailsModal } from "../Commons/DetailsModal";
import { dateStringToLocal } from "../../helpers";
import { downloadBase64File } from "../../libs/download";
import { ProcessPIRDetails } from "./PIRHelper";
import { PIRReject } from "./PIRReject";
import { PIRCreatePO } from "./PIRCreatePO";
import { NotesForm } from "../Notes/NotesForm";

export const PurchaseItemRequestComponent = () => {
  const {
    user: { role: userRole },
  } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [dt, setDt] = useState([]);

  const columns = [
    {
      name: "Requested By",
      selector: (row) => row.requestor,
      sortable: true,
    },
    {
      name: "To Purchase",
      selector: (row) => row.to_purchase,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.item_type,
      sortable: true,
    },
    {
      name: "For",
      selector: (row) => row.destination.name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      format: (row) => <LabelRepairStatus status={row.status} />,
      sortable: true,
    },
    {
      name: "Actions",
      wrap: true,
      selector: (row) => "NA",
      format: (row) => (
        <>
          {userRole !== "department" && (
            <>
              <PopupButton
                content="Create Note"
                iconName="sticky note"
                color="green"
                onClick={() => {
                  modalActions.openModal(
                    dispatch,
                    "Note",
                    <NotesForm name="pir_id" id={row.id} />
                  );
                }}
              />
              <PopupButton
                disabled={row.status === "PO created"}
                content="Create Purchase Order"
                color="yellow"
                iconName="file excel"
                onClick={() => {
                  modalActions.openModal(
                    dispatch,
                    "Create PO",
                    <PIRCreatePO
                      id={row.id}
                      onSave={() => {
                        loadData();
                      }}
                    />
                  );
                }}
              />
            </>
          )}

          <PopupButton
            color="blue"
            iconName="book"
            content="Details"
            onClick={() => {
              modalActions.openModal(
                dispatch,
                "Details",
                <DetailsModal data={ProcessPIRDetails(row)} />
              );
            }}
          />
          <PopupButton
            content="Download Attached"
            iconName="cloud download"
            onClick={async () => {
              const response = await agent.FileStorage.get(
                row.attached_file_id
              );
              downloadBase64File(response.base64, response.name);
            }}
          />

          {userRole !== "department" && (
            <PopupButton
              disabled={row.status === "PO created"}
              content="Reject"
              color="red"
              iconName="close"
              onClick={() => {
                modalActions.openModal(
                  dispatch,
                  "Reject",
                  <PIRReject
                    id={row.id}
                    onSave={() => {
                      loadData();
                    }}
                  />
                );
              }}
            />
          )}
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

    const response = await agent.PurchaseItemRequests.processAbles();
    setDt(response);

    setLoading(false);
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          PURCHASE ITEM REQUESTS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>
      <div className="mb-10 clearfix">
        {userRole === "department" && (
          <div className="float-r disp-ib">
            <Button
              size="small"
              color="green"
              onClick={() => {
                modalActions.openModal(
                  dispatch,
                  "Purchase Item Request",
                  <PurchaseItemRequestForm
                    onSave={() => {
                      loadData();
                    }}
                  />
                );
              }}
            >
              <Icon name="add" /> New Request
            </Button>
          </div>
        )}
      </div>

      <DataTable columns={columns} data={dt} pagination striped />
    </>
  );
};
