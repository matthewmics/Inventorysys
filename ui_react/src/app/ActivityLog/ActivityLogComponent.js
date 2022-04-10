import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Loader } from "semantic-ui-react";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";

export const ActivityLogComponent = () => {
  const columns = [
    {
      name: "Activity",
      selector: (row) => row.activity,
      format: (row) => (
        <span dangerouslySetInnerHTML={{ __html: row.activity }}></span>
      ),
    },
    {
      name: "Date",
      selector: (row) => dateStringToLocal(row.created_at),
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
    const response = await agent.ActivityLogs.list();

    setDt(response);
    setLoading(false);
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          ACTIVITY LOGS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>
      <DataTable columns={columns} data={dt} pagination striped />
    </>
  );
};
