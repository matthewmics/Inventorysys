import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Form, Loader } from "semantic-ui-react";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";
import { dateStringToLocal } from "../../../helpers";
import { downloadBase64File } from "../../../libs/download";
import { ConfirmationModal } from "../../Commons/ConfirmationModal";
import { ErrorMessage } from "../../Commons/ErrorMessage";
import { LabelTransferStatus } from "../../Commons/LabelTransferStatus";
import { PopupButton } from "../../Commons/PopupButton";
import { TransferRequestRejectForm } from "./TransferRequestRejectForm";

export const TransferRequestComponent = () => {
  // COMPONENT SPECIFIC
  //...

  // COMMON DECLARACTIONS
  const dispatch = useDispatch();
  const { errorMessages } = useSelector((state) => state.modal);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dtData, setDtData] = useState([]);
  // ...

  const columns = [
    {
      name: "Requested By",
      selector: (row) => row.requestor_name,
      sortable: true,
    },
    {
      name: "Item",
      selector: (row) => row.item_name,
      sortable: true,
    },
    {
      name: "From",
      selector: (row) => row.from,
      sortable: true,
    },
    {
      name: "To",
      selector: (row) => row.to,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.created_at,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.actions,
      right: true,
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const response = await agent.Workers.listTransferRequests();

    setData(response);
    setDtData(organizeDt(response));

    setLoading(false);
  };

  const organizeDt = (data) => {
    return data.map((a) => {
      return {
        ...a,
        requestor_name: a.requestor.name,
        created_at: dateStringToLocal(a.created_at),
        item_name: (
          <>
            <div>{a.item.inventory_parent_item.name}</div>
            <div style={{ color: "grey" }}>{a.item.serial_number}</div>
          </>
        ),
        status: <LabelTransferStatus status={a.status} />,
        from: a.current_room ? a.current_room.name : "Inventory",
        to: a.destination_room.name,
        actions: (
          <div style={{ textOverflow: "clip", overflow: "auto" }}>
            {a.status !== "in progress" ? (
              <PopupButton
                content="Work on request"
                iconName="dolly"
                color="yellow"
                onClick={() => {
                  modalActions.openModal(
                    dispatch,
                    "Transfer Request",
                    <ConfirmationModal
                      content="Work on this request?"
                      onSubmit={async () => {
                        modalActions.setLoading(dispatch, true);
                        await agent.Workers.workOnTransferRequest({
                          transfer_request_id: a.id,
                        });
                        loadData();
                        toast.success("Transfer request now in progress");
                        modalActions.closeModal(dispatch);
                      }}
                    />
                  );
                }}
              />
            ) : (
              <PopupButton
                content="Complete request"
                iconName="check"
                color="green"
                onClick={() => {
                  modalActions.openModal(
                    dispatch,
                    "Complete Request",
                    <ConfirmationModal
                      content="Is this request completed?"
                      onSubmit={async () => {
                        modalActions.setLoading(dispatch, true);
                        await agent.Workers.completeTransferRequest({
                          transfer_request_id: a.id,
                        });
                        loadData();
                        toast.success("Transfer request completed");
                        modalActions.closeModal(dispatch);
                      }}
                    />
                  );
                }}
              />
            )}
            <PopupButton
              content="Download attached"
              iconName="download"
              color="blue"
              onClick={async () => {
                const response = await agent.FileStorage.get(a.file_storage_id);
                downloadBase64File(response.base64, response.name);
              }}
            />
            <PopupButton
              content="Reject Transfer"
              iconName="cancel"
              color="red"
              onClick={() => {
                modalActions.openModal(
                  dispatch,
                  "Reject Transfer",
                  <TransferRequestRejectForm
                    onConfirm={() => loadData()}
                    transferRequestId={a.id}
                  />
                );
              }}
            />
          </div>
        ),
      };
    });
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          TRANSFER REQUESTS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>

      <DataTable columns={columns} data={dtData} pagination />
    </>
  );
};
