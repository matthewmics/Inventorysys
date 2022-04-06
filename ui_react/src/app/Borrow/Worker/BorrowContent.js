import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { Loader } from "semantic-ui-react";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";
import { PopupButton } from "../../Commons/PopupButton";
import { ConfirmationModal } from "../../Commons/ConfirmationModal";
import { toast } from "react-toastify";

export const BorrowContent = () => {
  const dispatch = useDispatch();

  const columns = [
    {
      name: "Item",
      selector: (row) => row.item.inventory_parent_item.name,
      format: (row) => (
        <>
          {row.item.inventory_parent_item.name}
          <div className="label-secondary">{row.item.serial_number}</div>
        </>
      ),
      sortable: true,
    },
    {
      name: "From",
      selector: (row) => row.current_room.building.name,
      format: (row) => (
        <>
          {row.current_room.building.name}
          <div className="label-secondary">{row.current_room.name}</div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Borrow For",
      selector: (row) => row.destination_room.building.name,
      format: (row) => (
        <>
          {row.destination_room.building.name}
          <div className="label-secondary">{row.destination_room.name}</div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Requested By",
      selector: (row) => row.requestor.name,
      format: (row) => <>{row.requestor.name}</>,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <>
          {row.status === "borrowed" ? (
            <PopupButton
              content="Item Returned"
              iconName="refresh"
              color="yellow"
              onClick={() => {
                modalActions.openModal(
                  dispatch,
                  "Item Returned",
                  <ConfirmationModal
                    content="Confirm returned?"
                    onSubmit={async () => {
                      modalActions.setLoading(dispatch, true);

                      await agent.Borrow.return(row.id);

                      toast.success("Item returned");
                      loadData();
                      modalActions.closeModal(dispatch);
                    }}
                  />
                );
              }}
            />
          ) : (
            <>
              {" "}
              {row.status === "in progress" ? (
                <PopupButton
                  iconName="check"
                  color="orange"
                  content="Finished transferring for borrow"
                  onClick={() => {
                    modalActions.openModal(
                      dispatch,
                      "Transferred for borrow",
                      <ConfirmationModal
                        content="Confirm transferred for borrow?"
                        onSubmit={async () => {
                          modalActions.setLoading(dispatch, true);

                          await agent.Borrow.borrow(row.id);

                          toast.success("Transferred for borrow");
                          loadData();
                          modalActions.closeModal(dispatch);
                        }}
                      />
                    );
                  }}
                />
              ) : (
                <>
                  {" "}
                  <PopupButton
                    content="Set to In Progress"
                    iconName="hourglass start"
                    color="green"
                    onClick={() => {
                      modalActions.openModal(
                        dispatch,
                        "Set to In Progress",
                        <ConfirmationModal
                          content="Set this request to in progress?"
                          onSubmit={async () => {
                            modalActions.setLoading(dispatch, true);

                            await agent.Borrow.inprogress(row.id);

                            toast.success("Borrow In Progress");
                            loadData();
                            modalActions.closeModal(dispatch);
                          }}
                        />
                      );
                    }}
                  />
                  <PopupButton
                    content="Reject"
                    iconName="close"
                    color="red"
                    onClick={() => {
                      modalActions.openModal(
                        dispatch,
                        "Reject Borrow",
                        <ConfirmationModal
                          content="Are you sure you want to reject this request?"
                          onSubmit={async () => {
                            modalActions.setLoading(dispatch, true);

                            await agent.Borrow.reject(row.id);

                            toast.success("Borrow Rejected");
                            loadData();
                            modalActions.closeModal(dispatch);
                          }}
                        />
                      );
                    }}
                  />
                </>
              )}
            </>
          )}
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

    const response = await agent.Borrow.processable();

    setDt(response);

    setLoading(false);
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          BORROW REQUESTS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>

      <DataTable columns={columns} data={dt} pagination striped />
    </>
  );
};
