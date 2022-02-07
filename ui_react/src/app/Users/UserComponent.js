import React from "react";
import DataTable from "react-data-table-component";
import { Button, Icon, Input } from "semantic-ui-react";

export const UserComponent = () => {
  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Year",
      selector: (row) => row.year,
      sortable: true,
    },
  ];

  const data = [
    {
      id: 1,
      title: "Beetlejuice",
      year: "1988",
    },
    {
      id: 2,
      title: "Ghostbusters",
      year: "1984",
    },
  ];

  return (
    <>
      <div>
        <div class="page-header-title">USERS</div>
        <hr></hr>
      </div>

      <div className="mb-10 clearfix">
        <div className="disp-ib">
          <Input
            placeholder="Search"
            icon={<Icon name="search" inverted circular />}
          />
        </div>
        <div className="float-r disp-ib">
          <Button size="small" color="green">
            <Icon name="add" /> Create User
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={data} pagination />
    </>
  );
};
