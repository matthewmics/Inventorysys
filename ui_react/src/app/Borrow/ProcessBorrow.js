import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Button,
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
      name: "Type",
      selector: (row) => <Label> {row.inventory_parent_item.item_type}</Label>,
    },
    {
      name: "Actions",
      selector: (row) => "actions",
      format: (row) => <>-</>,
      right: true,
    },
  ];

  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

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

  useEffect(() => {
    loadRequest();
    loadOptions();
  }, []);

  const loadOptions = async () => {
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
      setSelectedItem(response[0].value);
    }

    // room
    response = await agent.Room.list();

    response = response.map((a) => {
      return {
        text: a.name + " | " + a.building.name,
        value: a.id,
      };
    });
    setRoomOptions(response);
    if (response.length > 0) {
      setSelectedRoom(response[0].value);
    }

    loadItems();
  };

  const loadItems = async () => {
    setLoadingItems(true);

    const response = await agent.Inventory.forBorrows(
      selectedItem,
      selectedRoom
    );

    setDtAvailableItems(response);

    setLoadingItems(false);
  };

  const loadRequest = async () => {
    setLoading(true);
    const response = await agent.Borrow.show(id);
    setData(response);
    setLoading(false);
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
                <DataTable />
              </Segment>
              <Segment style={{ overflow: "auto" }}>
                <Button floated="right" positive>
                  Submit
                </Button>
                <Button floated="right">Clear</Button>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};
