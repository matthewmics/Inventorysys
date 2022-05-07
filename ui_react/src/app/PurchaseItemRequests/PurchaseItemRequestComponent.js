import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Loader } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";
import { PurchaseItemRequestForm } from "./PurchaseItemRequestForm";
import { LabelRepairStatus } from "../Commons/LabelRepairStatus";

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
      selector: (row) => "NA",
      format: (row) => <>test</>,
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
