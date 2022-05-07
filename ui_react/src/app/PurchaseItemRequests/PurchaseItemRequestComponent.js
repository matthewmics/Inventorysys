import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Loader } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import { PurchaseItemRequestForm } from "./PurchaseItemRequestForm";

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
  ];

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
                  <PurchaseItemRequestForm onSave={()=>{
                    
                  }}/>
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
