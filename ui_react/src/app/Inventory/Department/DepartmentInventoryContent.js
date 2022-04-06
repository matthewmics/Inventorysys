import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Icon, Loader, Menu, Popup, Segment } from "semantic-ui-react";
import { history } from "../../..";
import agent from "../../../agent";
import { dateStringToLocal } from "../../../helpers";
import { DelayedSearchInput } from "../../Commons/DelayedSearchInput";
import { itemTypeOptions } from "../../Commons/Enumerations";

export const DepartmentInventoryContent = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomID, setSelectedRoomID] = useState(0);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Item type",
      selector: (row) => row.item_type,
      sortable: true,
    },
    {
      name: "Qty",
      selector: (row) => row.qty,
      sortable: true,
    },
    {
      name: "Date Created",
      selector: (row) => row.created_at,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.actions,
      right: true,
    },
  ];

  const handleTextInputChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const formDefaultValue = {
    id: 0,
  };

  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState(null);
  const [formValue, setFormValue] = useState(formDefaultValue);

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [dataTemp, setDataTemp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadData = async () => {
    setLoading(true);

    const responseDeptCurrent = await agent.Department.current();

    setRooms(responseDeptCurrent.rooms);

    setLoading(false);

    loadInventory(selectedRoomID);
  };

  const loadInventory = async (roomID) => {
    setLoading(true);
    let itemParentsReponse =
      roomID !== 0
        ? await agent.Room.itemParents(roomID)
        : await agent.Inventory.parentListAvailable();

    itemParentsReponse = itemParentsReponse.map((a) => {
      return {
        ...a,
        qty: a.inventory_items.length,
        created_at: dateStringToLocal(a.created_at),
        actions: (
          <>
            <Popup
              content="View items"
              trigger={
                <Button
                  icon="eye"
                  circular
                  size="tiny"
                  onClick={() => {
                    history.push("/inventory/" + a.id + "/rooms/" + roomID);
                  }}
                />
              }
            />
          </>
        ),
      };
    });

    if (roomID !== 0) {
      itemParentsReponse = itemParentsReponse.filter((a) => a.qty > 0);
    }

    setDataTemp(itemParentsReponse);
    setData(itemParentsReponse);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div>
        <div className="page-header-title">
          INVENTORY <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>

      <Menu style={{ overflowX: "auto" }}>
        <Menu.Item
          disabled={loading}
          onClick={() => {
            setSelectedRoomID(0);
            loadInventory(0);
          }}
          className={0 === selectedRoomID ? "text-bold" : ""}
          active={0 === selectedRoomID}
        >
          <Icon name="box" />
          Available Items
        </Menu.Item>
        {rooms.map((room) => {
          return (
            <Menu.Item
              active={room.id === selectedRoomID}
              className={room.id === selectedRoomID ? "text-bold" : ""}
              onClick={() => {
                setSelectedRoomID(room.id);
                loadInventory(room.id);
              }}
              key={room.id}
              disabled={loading}
            >
              <Icon name="cube" />
              {room.name}
            </Menu.Item>
          );
        })}

        <Menu.Menu position="right"></Menu.Menu>
      </Menu>
      <div className="mb-10 clearfix">
        <div className="disp-ib">
          <DelayedSearchInput
            onSearch={(val) => {
              setData(
                dataTemp.filter((a) => a.name.toLowerCase().includes(val))
              );
            }}
          />
        </div>
        <div className="float-r disp-ib"></div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
      />
    </>
  );
};
