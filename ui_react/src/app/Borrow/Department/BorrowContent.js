import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button, Icon, Loader } from "semantic-ui-react";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";
import { DelayedSearchInput } from "../../Commons/DelayedSearchInput";
import { PopupButton } from "../../Commons/PopupButton";
import { BorrowRequest } from "./BorrowRequest";

export const BorrowContent = () => {
  const dispatch = useDispatch();

  const columns = [
    {
      name: "Item",
      selector: (row) => row.inventory_parent_item.name,
      format: (row) => (
        <>
          {row.inventory_parent_item.name}
          <div className="label-secondary">{row.serial_number}</div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Building",
      selector: (row) => row.room.building.name,
      sortable: true,
    },
    {
      name: "Room",
      selector: (row) => row.room.name,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <>
          <PopupButton
            content="Borrow"
            iconName="hand point up outline"
            onClick={() => {
              modalActions.openModal(
                dispatch,
                "Borrow " +
                  row.inventory_parent_item.name +
                  " | Room: " +
                  row.room.name,
                <BorrowRequest
                  itemToBorrow={row}
                  onSave={() => {
                    toast.success("Request submitted");
                    loadData();
                  }}
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
  const [dtTemp, setDtTemp] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const response = await agent.Inventory.unavailableItems();
    setDtTemp(response);
    setDt(response);
    console.log(response);
    setLoading(false);
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          BORROW <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>
      <div className="mb-10 clearfix">
        <div className="disp-ib">
          <DelayedSearchInput
            onSearch={(val) => {
              setDt(
                dtTemp.filter(
                  (a) =>
                    a.serial_number.toLowerCase().includes(val) ||
                    a.inventory_parent_item.name.toLowerCase().includes(val) ||
                    a.room.name.toLowerCase().includes(val) ||
                    a.room.building.name.toLowerCase().includes(val)
                )
              );
            }}
          />
        </div>
      </div>

      <DataTable columns={columns} data={dt} pagination striped />
    </>
  );
};
