import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { Loader } from "semantic-ui-react";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";
import { downloadBase64File } from "../../libs/download";
import { PopupButton } from "../Commons/PopupButton";
import modalActions from "../../actions/modalActions";

import { ConfirmationModal } from "../Commons/ConfirmationModal";
import { toast } from "react-toastify";

export const PurchaseOrderComponent = () => {
  const dispatch = useDispatch();

  const columns = [
    {
      name: "Item To Purchase",
      selector: (row) => row.item_name,
      sortable: true,
    },
    {
      name: "For Room",
      selector: (row) => row.room_name,
      sortable: true,
    },
    {
      name: "Is Completed",
      selector: (row) => row.is_completed,
      format: (row) => (row.is_completed === 1 ? "YES" : "NO"),
      sortable: true,
    },
    {
      name: "Date Created",
      selector: (row) => dateStringToLocal(row.created_at),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <>
          {" "}
          <PopupButton
            disabled={row.is_completed}
            content="Complete"
            iconName="check"
            color="green"
            onClick={() => {
              // const response = await agent.FileStorage.get(row.file_storage_id);
              // downloadBase64File(response.base64, response.name);

              modalActions.openModal(
                dispatch,
                "Purchase Order",
                <ConfirmationModal
                  content="Set this PO to complete and notify requestor"
                  onSubmit={async () => {
                    modalActions.setLoading(dispatch, true);
                    await agent.PurchaseOrders.complete(row.id);

                    toast.success("Completed");
                    modalActions.closeModal(dispatch);
                    loadData();
                  }}
                />
              );
            }}
          />
          <PopupButton
            content="Download PO"
            iconName="download"
            onClick={async () => {
              const response = await agent.FileStorage.get(row.file_storage_id);
              downloadBase64File(response.base64, response.name);
            }}
          />
        </>
      ),
      right: true,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [dt, setDt] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const response = await agent.PurchaseOrders.list();
    setDt(response);

    setLoading(false);
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          PURCHASE ORDERS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>
      <DataTable columns={columns} data={dt} pagination striped />
    </>
  );
};
