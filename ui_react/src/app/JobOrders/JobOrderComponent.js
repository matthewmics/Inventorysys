import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Loader } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";
import { ConfirmationModal } from "../Commons/ConfirmationModal";
import { PopupButton } from "../Commons/PopupButton";
import { JobOrderPurchaseOrder } from "./JobOrderPurchaseOrder";
import { JobOrderReplace } from "./JobOrderReplace";

export const JobOrderComponent = () => {
  const dispatch = useDispatch();
  const columns = [
    {
      name: "Created By",
      selector: (row) => row.handler.name,
      sortable: true,
    },
    {
      name: "Item",
      selector: (row) => (
        <>
          {row.repair_request.item.inventory_parent_item.name}
          <div className="label-secondary">
            {row.repair_request.item.serial_number}
          </div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => dateStringToLocal(row.created_at),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <>
          <PopupButton
            content="Mark as repaired"
            iconName="check"
            color="green"
            onClick={() => {
              modalActions.openModal(
                dispatch,
                "Item Repaired",
                <ConfirmationModal
                  content={`Mark ${row.repair_request.item.inventory_parent_item.name} as repaired?`}
                  onSubmit={async () => {
                    modalActions.setLoading(dispatch, true);
                    await agent.JobOrders.repair(row.id);
                    modalActions.closeModal(dispatch);
                    toast.success("Item Repaired");
                    loadData();
                  }}
                />
              );
            }}
          />
          <PopupButton
            content="Replace With Available Items From Inventory"
            iconName="redo"
            color="teal"
            onClick={() => {
              modalActions.openModal(
                dispatch,
                "Replace Item - " +
                  row.repair_request.item.inventory_parent_item.name,
                <JobOrderReplace
                  onSave={async () => {
                    toast.success("Item Replaced");
                    loadData();
                  }}
                  parentId={row.repair_request.item.inventory_parent_item.id}
                  jobOrderId={row.id}
                />
              );
            }}
          />
          <PopupButton
            content="Create Purchase Order"
            iconName="file"
            color="teal"
            onClick={() => {
              modalActions.openModal(
                dispatch,
                "Purchase Order - " +
                  row.repair_request.item.inventory_parent_item.name,
                <JobOrderPurchaseOrder
                  onSave={async () => {
                    toast.success("PO Created");
                    loadData();
                  }}
                  itemName={row.repair_request.item.inventory_parent_item.name}
                  jobOrderId={row.id}
                />
              );
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
    const response = await agent.JobOrders.listPending();
    setDt(response);
    setLoading(false);
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          JOB ORDERS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>
      <DataTable columns={columns} data={dt} pagination striped />
    </>
  );
};
