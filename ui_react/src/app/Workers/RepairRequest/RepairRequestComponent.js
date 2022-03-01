import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Loader } from "semantic-ui-react";
import agent from "../../../agent";
import { dateStringToLocal } from "../../../helpers";
import { LabelRepairStatus } from "../../Commons/LabelRepairStatus";

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
          actions: <>
            
          </>
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
      );
    </>
  );
};
