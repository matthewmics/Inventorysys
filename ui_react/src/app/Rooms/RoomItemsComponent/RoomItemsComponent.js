import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Icon, Loader, Segment } from "semantic-ui-react";
import { history } from "../../..";
import agent from "../../../agent";
import { DelayedSearchInput } from "../../Commons/DelayedSearchInput";
import { PopupButton } from "../../Commons/PopupButton";

export const RoomItemsComponent = () => {
  const RoomItemsColumn = [
    {
      name: "Item",
      selector: (row) => row.inventory_parent_item_id,
      format: (row) => (
        <>
          {row.inventory_parent_item.name}
          <div className="label-secondary">{row.serial_number}</div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.inventory_parent_item.item_type,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <>
          {loadingUpdate ? (
            <Icon name="spinner" color="green" loading />
          ) : (
            <PopupButton
              content="Remove"
              iconName="minus"
              color="orange"
              onClick={async () => {
                setLoadingUpdate(true);
                const response = await agent.Inventory.setRoom(row.id, {
                  room_id: null,
                });

                setDtAvailableItems([...dtAvailableItems, response]);

                setDtRoomItems(dtRoomItems.filter((a) => a.id !== row.id));

                setLoadingUpdate(false);
              }}
            />
          )}
        </>
      ),
      right: true,
    },
  ];

  const RoomAvailableItemsColumn = [
    {
      name: "Item",
      selector: (row) => row.inventory_parent_item_id,
      format: (row) => (
        <>
          {row.inventory_parent_item.name}
          <div className="label-secondary">{row.serial_number}</div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.inventory_parent_item.item_type,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <>
          {loadingUpdate ? (
            <Icon name="spinner" color="green" loading />
          ) : (
            <PopupButton
              content="Add"
              iconName="plus"
              color="yellow"
              onClick={async () => {
                setLoadingUpdate(true);
                const response = await agent.Inventory.setRoom(row.id, {
                  room_id: id,
                });
                setDtRoomItems([...dtRoomItems, response]);

                setDtAvailableItems(
                  dtAvailableItems.filter((a) => a.id !== row.id)
                );
                setLoadingUpdate(false);
              }}
            />
          )}
        </>
      ),
      right: true,
    },
  ];

  const { id } = useParams();

  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [room, setRoom] = useState({});

  const [dtRoomItemsTemp, setDtRoomItemsTemp] = useState([]);
  const [dtRoomItems, setDtRoomItems] = useState([]);

  const [dtAvailableItemsTemp, setDtAvailableItemsTemp] = useState([]);
  const [dtAvailableItems, setDtAvailableItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    let response = await agent.Room.allItems(id);
    setRoom({ name: response.name });
    setDtRoomItems(response.inventory_items);
    setDtRoomItemsTemp(response.inventory_items);
    response = await agent.Inventory.availableItems();
    setDtAvailableItems(response);
    setDtAvailableItemsTemp(response);
    setLoading(false);
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          <span
            className="link"
            onClick={() => {
              history.goBack();
            }}
          >
            ROOM ITEMS{" "}
          </span>
          <Icon name="arrow right" />
          {room && <>{room.name}</>}
          <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>
      <Segment.Group>
        <Segment style={{ overflow: "auto" }}>
          <Icon name="boxes" />
          <b>ITEMS</b>
          <div style={{ float: "right" }}>
            <DelayedSearchInput
              onSearch={(term) => {
                setDtRoomItems(
                  dtRoomItemsTemp.filter((a) => {
                    return (
                      a.serial_number.toLowerCase().includes(term) ||
                      a.inventory_parent_item.name.toLowerCase().includes(term)
                    );
                  })
                );
              }}
            />
          </div>
        </Segment>
        <Segment>
          <DataTable
            columns={RoomItemsColumn}
            data={dtRoomItems}
            pagination
            striped
            progressPending={loading}
          />
        </Segment>
      </Segment.Group>

      <Segment.Group>
        <Segment style={{ overflow: "auto" }}>
          <Icon name="boxes" />
          <b>AVAILABLE ITEMS</b>
          <div style={{ float: "right" }}>
            <DelayedSearchInput
              onSearch={(term) => {
                setDtAvailableItems(
                  dtAvailableItemsTemp.filter((a) => {
                    return (
                      a.serial_number.toLowerCase().includes(term) ||
                      a.inventory_parent_item.name.toLowerCase().includes(term)
                    );
                  })
                );
              }}
            />
          </div>
        </Segment>
        <Segment>
          <DataTable
            columns={RoomAvailableItemsColumn}
            data={dtAvailableItems}
            pagination
            striped
            progressPending={loading}
          />
        </Segment>
      </Segment.Group>
    </>
  );
};
