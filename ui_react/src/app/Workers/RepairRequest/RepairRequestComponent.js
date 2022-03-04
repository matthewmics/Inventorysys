import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { Loader } from "semantic-ui-react";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";
import { dateStringToLocal } from "../../../helpers";
import { downloadBase64File } from "../../../libs/download";
import { LabelRepairStatus } from "../../Commons/LabelRepairStatus";
import { PopupButton } from "../../Commons/PopupButton";
import { RepairRequestRejectForm } from "./RepairRequestRejectForm";
import { ConfirmationModal } from "../../Commons/ConfirmationModal";
import { toast } from "react-toastify";

export const RepairRequestComponent = () => {
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

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [dtData, setDtData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const response = await agent.Workers.listRepairRequests();

    setDtData(
      response.map((a) => {
        return {
          ...a,
          requestor_name: a.requestor.name,
          item_name: (
            <>
              <div>{a.item.inventory_parent_item.name}</div>
              <div style={{ color: "grey" }}>{a.item.serial_number}</div>
            </>
          ),
          created_at: dateStringToLocal(a.created_at),
          status: <LabelRepairStatus status={a.status} />,
          actions: (
            <>
              <PopupButton
                content="Create Job Order"
                iconName="briefcase"
                color="green"
                onClick={async () => {
                  modalActions.openModal(
                    dispatch,
                    "Create Job Order",
                    <ConfirmationModal
                      content="Are you sure you want to create a job order for this request? Click OK to proceed."
                      onSubmit={async () => {

                        modalActions.setLoading(dispatch, true);

                        await agent.Workers.createJobOrder({
                          repair_request_id: a.id,
                        });

                        modalActions.closeModal(dispatch);
                        loadData();
                        toast.success("Job Order created");
                      }}
                    />
                  );
                }}
              />

              <PopupButton
                content="Download attached"
                iconName="download"
                color="blue"
                onClick={async () => {
                  const response = await agent.FileStorage.get(
                    a.file_storage_id
                  );
                  downloadBase64File(response.base64, response.name);
                }}
              />

              <PopupButton
                content="Reject Repair"
                iconName="cancel"
                color="red"
                onClick={() => {
                  modalActions.openModal(
                    dispatch,
                    "Reject Repair",
                    <RepairRequestRejectForm
                      onConfirm={() => loadData()}
                      repairRequestId={a.id}
                    />
                  );
                }}
              />

              <PopupButton
                content="Dispose"
                iconName="trash alternate"
                color="red"
                onClick={() => {
                  modalActions.openModal(
                    dispatch,
                    "Dispose Unfixable Item",
                    <ConfirmationModal
                      content="Dispose this item because it can no longer be fixed. Click OK to proceed."
                      onSubmit={async () => {
                        modalActions.setLoading(dispatch, true);

                        await agent.Workers.disposeRepairRequest({
                          item_id: a.item.id,
                          repair_request_id: a.id,
                        });

                        modalActions.closeModal(dispatch);
                        loadData();
                        toast.success("Item has been disposed");
                      }}
                    />
                  );
                }}
              />
            </>
          ),
        };
      })
    );

    setLoading(false);
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          REPAIR REQUESTS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>
      <DataTable columns={columns} data={dtData} pagination />
    </>
  );
};
