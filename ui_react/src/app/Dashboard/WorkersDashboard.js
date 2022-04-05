import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Grid,
  Icon,
  Label,
  Loader,
  Popup,
  Segment,
  Table,
} from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";
import { downloadBase64File } from "../../libs/download";
import { LabelTransferStatus } from "../Commons/LabelTransferStatus";
import { PopupButton } from "../Commons/PopupButton";
import { MessageModal } from "../Commons/MessageModal";
import { DetailsModal } from "../Commons/DetailsModal";
import { LabelRepairStatus } from "../Commons/LabelRepairStatus";
import { DisposedItemsComponent } from "../IventoryItem/DisposedItemsComponent";
import { PurchaseOrderComponent } from "../PurchaseOrders/PurchaseOrderComponent";
import { BorrowRequestSummary } from "./Department/BorrowRequestSummary";

export const WorkersDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // constants
  const columns = [
    {
      name: "Item",
      selector: (row) => row.item_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      selector: (row) => row.actions,
      right: true,
    },
  ];

  // states
  const [loading, setLoading] = useState(false);
  const [transfersDt, setTransfersDt] = useState([]);
  const [repairsDt, setRepairsDt] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  // methods
  const loadData = async () => {
    setLoading(true);

    const r_transfers = await agent.TransferRequest.list();
    setTransfersDt(
      r_transfers.map((a) => {
        return {
          item_name: (
            <>
              <div style={{ fontWeight: "bold" }}>
                {a.item.inventory_parent_item.name}
              </div>
              <div style={{ color: "grey" }}>{a.item.serial_number}</div>
            </>
          ),
          status: <LabelTransferStatus status={a.status} />,
          actions: (
            <>
              {a.rejection_details && (
                <PopupButton
                  content="Rejection details"
                  iconName="warning"
                  color="red"
                  onClick={() => {
                    modalActions.openModal(
                      dispatch,
                      "Rejection Details",
                      <MessageModal message={a.rejection_details} />
                    );
                  }}
                />
              )}
              <PopupButton
                content="Details"
                iconName="book"
                color="blue"
                onClick={() => {
                  modalActions.openModal(
                    dispatch,
                    "Transfer Details",
                    <DetailsModal
                      data={{
                        "Requested By": a.requestor.name,
                        Details: a.details,
                        Item: a.item.inventory_parent_item.name,
                        "Serial Number": a.item.serial_number,
                        From: a.current_room
                          ? a.current_room.name
                          : "Inventory",
                        To: a.destination_room.name,
                        Status: a.status.toUpperCase(),
                        Date: dateStringToLocal(a.created_at),
                      }}
                    />
                  );
                }}
              />

              <PopupButton
                content="Download Attached"
                iconName="cloud download"
                onClick={async () => {
                  const response = await agent.FileStorage.get(
                    a.file_storage_id
                  );
                  downloadBase64File(response.base64, response.name);
                }}
              />
            </>
          ),
        };
      })
    );

    const r_repairs = await agent.RepairRequest.list();

    setRepairsDt(
      r_repairs.map((a) => {
        return {
          item_name: (
            <>
              <div style={{ fontWeight: "bold" }}>
                {a.item.inventory_parent_item.name}
              </div>
              <div style={{ color: "grey" }}>{a.item.serial_number}</div>
            </>
          ),
          status: <LabelRepairStatus status={a.status} />,
          actions: (
            <>
              {a.rejection_details && (
                <PopupButton
                  content="Rejection details"
                  iconName="warning"
                  color="red"
                  onClick={() => {
                    modalActions.openModal(
                      dispatch,
                      "Rejection Details",
                      <MessageModal message={a.rejection_details} />
                    );
                  }}
                />
              )}
              <PopupButton
                content="Details"
                iconName="book"
                color="blue"
                onClick={() => {
                  modalActions.openModal(
                    dispatch,
                    "Request Details",
                    <DetailsModal
                      data={{
                        Item: a.item.inventory_parent_item.name,
                        "Serial Number": a.item.serial_number,
                        Details: a.details,
                        Status: a.status.toUpperCase(),
                        Date: dateStringToLocal(a.created_at),
                        "Processed By": a.handler ? a.handler.name : "-",
                      }}
                    />
                  );
                }}
              />

              <PopupButton
                content="Download Attached"
                iconName="cloud download"
                onClick={async () => {
                  const response = await agent.FileStorage.get(
                    a.file_storage_id
                  );
                  downloadBase64File(response.base64, response.name);
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
          DASHBOARD
          <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>

      <Grid padded>
        <Grid.Row>
          <Grid.Column mobile={16} computer={8}>
            <Segment.Group>
              <Segment className="bg-gradient-1">
                <Icon name="dolly" />
                Transfer Requests
              </Segment>
              <Segment>
                <div className="dashboard-segment">
                  <DataTable
                    columns={columns}
                    data={transfersDt}
                    pagination
                    noTableHead
                    striped
                    progressPending={loading}
                  />
                </div>
              </Segment>
            </Segment.Group>
          </Grid.Column>

          <Grid.Column mobile={16} computer={8}>
            <Segment.Group>
              <Segment className="bg-gradient-1">
                <Icon name="wrench" />
                Repair Requests
              </Segment>
              <Segment>
                <div className="dashboard-segment">
                  <DataTable
                    columns={columns}
                    data={repairsDt}
                    pagination
                    noTableHead
                    striped
                    progressPending={loading}
                  />
                </div>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column computer={8} mobile={16}>
            <Segment.Group>
              <Segment className="bg-gradient-1">
                <Icon name="pallet" />
                Borrows
              </Segment>
              <Segment>
                <BorrowRequestSummary />
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>

        {["admin"].includes(user.role) && (
          <Grid.Row>
            <Grid.Column mobile={16} computer={8}>
              <Segment.Group>
                <Segment className="bg-gradient-1">
                  <Icon name="cart arrow down" />
                  Purchase Orders
                </Segment>
                <Segment>
                  <div className="dashboard-segment">
                    <PurchaseOrderComponent />
                  </div>
                </Segment>
              </Segment.Group>
            </Grid.Column>

            <Grid.Column mobile={16} computer={8}>
              <Segment.Group>
                <Segment className="bg-gradient-2">
                  <Icon name="trash" />
                  Disposed Items
                </Segment>
                <Segment>
                  <div className="dashboard-segment">
                    <DisposedItemsComponent />
                  </div>
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </>
  );
};
