import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Icon, Loader, Menu, Segment } from "semantic-ui-react";
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

                const tempDtAvailableItems = [...dtAvailableItemsTemp];
                setDtAvailableItems(
                  [...tempDtAvailableItems, response].filter(
                    availableItesmFilterBySearch
                  )
                );
                setDtAvailableItemsTemp([...tempDtAvailableItems, response]);

                const tempDtRoomItems = [...dtRoomItemsTemp];
                setDtRoomItems(
                  tempDtRoomItems
                    .filter((a) => a.id !== row.id)
                    .filter(roomsFilterBySearch)
                );
                setDtRoomItemsTemp(
                  tempDtRoomItems.filter((a) => a.id !== row.id)
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
                const isItemExists = items.find(
                  (i) => i.id === row.inventory_parent_item.id
                );

                if (!isItemExists)
                  setItems([...items, row.inventory_parent_item]);

                setLoadingUpdate(true);
                const response = await agent.Inventory.setRoom(row.id, {
                  room_id: id,
                });

                const tempDtRoomItems = [...dtRoomItemsTemp];
                setDtRoomItems(
                  [...tempDtRoomItems, response].filter(roomsFilterBySearch)
                );
                setDtRoomItemsTemp([...tempDtRoomItems, response]);

                const tempDtAvailableItems = [...dtAvailableItemsTemp];
                setDtAvailableItems(
                  tempDtAvailableItems
                    .filter((a) => a.id !== row.id)
                    .filter(availableItesmFilterBySearch)
                );
                setDtAvailableItemsTemp(
                  tempDtAvailableItems.filter((a) => a.id !== row.id)
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

  const [roomSearchTerm, setRoomSearchTerm] = useState("");
  const [dtRoomItemsTemp, setDtRoomItemsTemp] = useState([]);
  const [dtRoomItems, setDtRoomItems] = useState([]);

  const [availableItemsSearchTerm, setAvailableItemsSearchTerm] = useState("");
  const [dtAvailableItemsTemp, setDtAvailableItemsTemp] = useState([]);
  const [dtAvailableItems, setDtAvailableItems] = useState([]);

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // room items
    let response = await agent.Room.allItems(id);
    setRoom({ name: response.name });
    setDtRoomItems(response.inventory_items);
    setDtRoomItemsTemp(response.inventory_items);

    var _items = [];
    response.inventory_items.forEach((i) => {
      const parentItem = i.inventory_parent_item;

      const exists = _items.find((j) => j.id === parentItem.id);

      if (!exists) {
        _items.push(parentItem);
      }
    });

    setItems(_items);

    // available items
    response = await agent.Inventory.availableItems();
    setDtAvailableItems(response);
    setDtAvailableItemsTemp(response);
    setLoading(false);
  };

  const onItemSelect = (_id) => {
    if (_id === 0) {
      setDtRoomItems(dtRoomItemsTemp);
      return;
    }

    setDtRoomItems(
      dtRoomItemsTemp.filter((i) => {
        return i.inventory_parent_item.id === _id;
      })
    );
  };

  const onSearchRoomItems = (term) => {
    setRoomSearchTerm(term);
    setDtRoomItems(
      dtRoomItemsTemp.filter((a) => {
        return (
          (a.serial_number.toLowerCase().includes(term.toLowerCase()) ||
            a.inventory_parent_item.name
              .toLowerCase()
              .includes(term.toLowerCase())) &&
          (a.inventory_parent_item.id === selectedItem || selectedItem === 0)
        );
      })
    );
  };

  const roomsFilterBySearch = (a) => {
    const term = roomSearchTerm;
    return (
      (a.serial_number.toLowerCase().includes(term.toLowerCase()) ||
        a.inventory_parent_item.name
          .toLowerCase()
          .includes(term.toLowerCase())) &&
      (a.inventory_parent_item.id === selectedItem || selectedItem === 0)
    );
  };

  const onSearchAvailableItems = (term) => {
    setAvailableItemsSearchTerm(term);
    setDtAvailableItems(
      dtAvailableItemsTemp.filter((a) => {
        return (
          a.serial_number.toLowerCase().includes(term.toLowerCase()) ||
          a.inventory_parent_item.name
            .toLowerCase()
            .includes(term.toLowerCase())
        );
      })
    );
  };

  const availableItesmFilterBySearch = (a) => {
    const term = availableItemsSearchTerm;
    return (
      a.serial_number.toLowerCase().includes(term.toLowerCase()) ||
      a.inventory_parent_item.name.toLowerCase().includes(term.toLowerCase())
    );
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
                onSearchRoomItems(term);
              }}
            />
          </div>
        </Segment>
        <Segment>
          {" "}
          <Menu style={{ overflowX: "auto" }}>
            <Menu.Item
              disabled={loading}
              onClick={() => {
                setSelectedItem(0);
                onItemSelect(0);
                // loadBorrows(dtTemp, 0);
              }}
              className={0 === selectedItem ? "text-bold" : ""}
              active={0 === selectedItem}
            >
              <Icon name="cubes" />
              All Items
            </Menu.Item>
            {items.map((room, index) => {
              return (
                <Menu.Item
                  key={index}
                  active={room.id === selectedItem}
                  className={room.id === selectedItem ? "text-bold" : ""}
                  onClick={() => {
                    setSelectedItem(room.id);
                    onItemSelect(room.id);
                    // loadBorrows(dtTemp, room.id);
                  }}
                  disabled={loading}
                >
                  <Icon name="cube" />
                  {room.name}
                </Menu.Item>
              );
            })}

            <Menu.Menu position="right"></Menu.Menu>
          </Menu>
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
                onSearchAvailableItems(term);
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
