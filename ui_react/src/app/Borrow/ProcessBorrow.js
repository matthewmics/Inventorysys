import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Button,
  Dimmer,
  Grid,
  Icon,
  Label,
  List,
  Loader,
  Segment,
  Select,
} from "semantic-ui-react";
import { history } from "../..";
import agent from "../../agent";
import moment from "moment";
import DataTable from "react-data-table-component";
import { PopupButton } from "../Commons/PopupButton";
import { LabelBorrowedItems } from "../Borrow/BorrowHelper";
import { toast } from "react-toastify";

export const ProcessBorrow = () => {
  const {
    user: { role },
  } = useSelector((state) => state.auth);

  const columnAvailableItems = [
    {
      name: "Item",
      selector: (row) => row.serial_number,
      format: (row) => (
        <>
          {row.inventory_parent_item.name}
          <div className="label-secondary">{row.serial_number}</div>
        </>
      ),
    },
    {
      name: "Room",
      selector: (row) => row.serial_number,
      format: (row) => (
        <>
          {row.room.name}
          <div className="label-secondary">{row.room.building.name}</div>
        </>
      ),
    },
    {
      name: "Type",
      selector: (row) => <Label> {row.inventory_parent_item.item_type}</Label>,
    },
    {
      name: "Actions",
      selector: (row) => "actions",
      format: (row) => (
        <>
          <PopupButton
            content="Add"
            iconName="add"
            color="green"
            onClick={() => {
              addToCart(row.id);
            }}
          />
        </>
      ),
      right: true,
    },
  ];

  const columnCart = [
    {
      name: "Item",
      selector: (row) => row.serial_number,
      format: (row) => (
        <>
          {row.inventory_parent_item.name}
          <div className="label-secondary">{row.serial_number}</div>
        </>
      ),
    },
    {
      name: "Room",
      selector: (row) => row.serial_number,
      format: (row) => (
        <>
          {row.room.name}
          <div className="label-secondary">{row.room.building.name}</div>
        </>
      ),
    },
    {
      name: "Type",
      selector: (row) => <Label> {row.inventory_parent_item.item_type}</Label>,
    },
    {
      name: "Actions",
      selector: (row) => "actions",
      format: (row) => (
        <>
          <PopupButton
            content="Remove"
            iconName="minus"
            color="red"
            onClick={() => {
              removeFromCart(row.id);
            }}
          />
        </>
      ),
      right: true,
    },
  ];

  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingProcessRequest, setLoadingProcessRequest] = useState(false);

  const [data, setData] = useState({
    borrow_details: "---",
    borrower: "---",
    destination: { name: "---" },
    from: moment(),
    to: moment(),
    purpose: "---",
  });

  const [roomOptions, setRoomOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);

  const [dtAvailableItems, setDtAvailableItems] = useState([]);
  const [dtCart, setDtCart] = useState([]);

  useEffect(() => {
    loadRequest();
  }, []);

  const addToCart = (id) => {
    const item = dtAvailableItems.find((a) => a.id === id);
    setDtAvailableItems(dtAvailableItems.filter((a) => a.id !== id));
    setDtCart([item, ...dtCart]);
  };

  const removeFromCart = (id) => {
    const item = dtCart.find((a) => a.id === id);
    setDtCart(dtCart.filter((a) => a.id !== id));
    setDtAvailableItems([item, ...dtAvailableItems]);
  };

  const clearCart = () => {
    setDtAvailableItems([...dtCart, ...dtAvailableItems]);
    setDtCart([]);
  };

  const loadOptions = async (roomId) => {
    let firstItem = 0;
    let firstRoom = 0;

    // items
    let response = await agent.Inventory.parentList();

    response = response
      .map((a) => {
        return {
          text: a.name,
          value: a.id,
          item_type: a.item_type,
        };
      })
      .filter((a) => {
        if (role === "its") {
          return a.item_type === "PC";
        } else if (role === "ppfo") {
          return a.item_type !== "PC";
        }
        return true;
      });
    setItemOptions(response);

    if (response.length > 0) {
      firstItem = response[0].value;
      setSelectedItem(firstItem);
    }

    // room
    response = await agent.Room.list();

    response = response.filter((a) => a.id !== roomId);

    response = response.map((a) => {
      return {
        text: a.name + " | " + a.building.name,
        value: a.id,
      };
    });

    setRoomOptions(response);
    if (response.length > 0) {
      firstRoom = response[0].value;
      setSelectedRoom(firstRoom);
    }

    loadItems(firstItem, firstRoom);
  };

  const loadItems = async (item, room) => {
    setLoadingItems(true);

    let response;

    if (selectedItem !== 0 && selectedRoom !== 0) {
      response = await agent.Inventory.forBorrows(selectedItem, selectedRoom);
    } else {
      response = await agent.Inventory.forBorrows(item, room);
    }

    response = response.filter((a) => {
      return dtCart.find((b) => b.id === a.id) === undefined;
    });

    setDtAvailableItems(response);

    setLoadingItems(false);
  };

  const loadRequest = async () => {
    setLoading(true);
    const response = await agent.Borrow.show(id);
    setData(response);
    setLoading(false);

    loadOptions(response.destination_room);
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          <Icon
            style={{ cursor: "pointer" }}
            name="arrow left"
            color="blue"
            onClick={() => {
              history.goBack();
            }}
          />
          <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>

      <Segment.Group>
        <Segment className="bg-gradient-1">BORROW DETAILS</Segment>
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column computer={8} mobile={16}>
                <List divided relaxed>
                  <List.Item>
                    <List.Content>
                      <List.Header>BORROWER</List.Header>
                      {data.borrower}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>FROM</List.Header>
                      {moment(data.from).format("ll")}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>TO</List.Header>
                      {moment(data.to).format("ll")}
                    </List.Content>
                  </List.Item>
                </List>
              </Grid.Column>{" "}
              <Grid.Column computer={8} mobile={16}>
                <List divided relaxed>
                  <List.Item>
                    <List.Content>
                      <List.Header>BORROW FOR</List.Header>
                      {data.destination.name}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>THINGS TO BORROW</List.Header>
                      {data.borrow_details}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>PURPOSE</List.Header>
                      {data.purpose}
                    </List.Content>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Segment.Group>

      <div style={{ height: "1em" }}></div>
      {/* DATATABLES  */}
      <Grid>
        <Grid.Row>
          <Grid.Column computer={8} mobile={16}>
            <Segment.Group>
              <Segment style={{ backgroundColor: "#a7ffeb" }}>
                AVAILABLE ITEMS
              </Segment>
              <Segment>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                  }}
                >
                  <Select
                    style={{ margin: "3px" }}
                    fluid
                    search
                    placeholder="Item"
                    options={itemOptions}
                    value={selectedItem}
                    onChange={(e, data) => {
                      setSelectedItem(data.value);
                    }}
                  />
                  <Select
                    style={{ margin: "3px" }}
                    fluid
                    search
                    placeholder="Room"
                    value={selectedRoom}
                    options={roomOptions}
                    onChange={(e, data) => {
                      setSelectedRoom(data.value);
                    }}
                  />
                </div>
                <Button
                  size="tiny"
                  icon
                  labelPosition="left"
                  style={{ marginLeft: "3px" }}
                  disabled={
                    selectedRoom === 0 || selectedItem === 0 || loadingItems
                  }
                  onClick={loadItems}
                  loading={loadingItems}
                >
                  <Icon name="search" /> Search
                </Button>
              </Segment>
              <Segment style={{ height: "305px", overflowX: "auto" }}>
                <DataTable
                  noTableHead
                  columns={columnAvailableItems}
                  data={dtAvailableItems}
                />
              </Segment>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column computer={8} mobile={16}>
            <Segment.Group>
              <Segment style={{ backgroundColor: "#fafafa" }}>
                TO BORROW
              </Segment>
              <Segment style={{ height: "353px", overflowX: "auto" }}>
                {dtCart.length > 0 && (
                  <Segment>
                    <LabelBorrowedItems items={dtCart} />
                  </Segment>
                )}
                <DataTable columns={columnCart} data={dtCart} noTableHead />
              </Segment>
              <Segment style={{ overflow: "auto" }}>
                <Button
                  loading={loadingProcessRequest}
                  floated="right"
                  positive
                  disabled={dtCart.length === 0 || loadingProcessRequest}
                  onClick={async () => {
                    const req = {
                      items: dtCart.map((a) => a.id),
                    };

                    setLoadingProcessRequest(true);

                    await agent.Borrow.borrow(id, req);

                    setLoadingProcessRequest(false);

                    toast.success("Borrowed Succesfully");
                    history.goBack();
                  }}
                >
                  Submit
                </Button>
                <Button
                  floated="right"
                  onClick={() => {
                    clearCart();
                  }}
                >
                  Clear
                </Button>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};
