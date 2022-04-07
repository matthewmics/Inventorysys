import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { Loader } from "semantic-ui-react";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";

export const DisposedItemsComponent = () => {
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
    },
    {
      name: "Date Disposed",
      selector: (row) => dateStringToLocal(row.created_at),
      right: true,
      sortable: true,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [dt, setDt] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await agent.Inventory.diposedItemList();
    console.log(response);
    setDt(response);
    setLoading(false);
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          DISPOSED ITEMS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>
      <DataTable columns={columns} data={dt} pagination striped />
    </>
  );
};
