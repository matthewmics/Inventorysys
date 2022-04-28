import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Icon, Label, Loader, Menu } from "semantic-ui-react";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";
import { DelayedSearchInput } from "../../Commons/DelayedSearchInput";
import { PopupButton } from "../../Commons/PopupButton";
import { BorrowRequest } from "./BorrowRequest";

import moment from "moment";
import { LabelBorrowStatus } from "../../Commons/LabelBorrowStatus";
import { DetailsModal } from "../../Commons/DetailsModal";

import { ConfirmationModal } from "../../Commons/ConfirmationModal";
import { RejectBorrow } from "../RejectBorrow";
import { history } from "../../..";
import { BorrowDetailsObject, LabelBorrowedItems } from "../BorrowHelper";

export const BorrowContent = () => {
  const {
    user: { role: userRole },
  } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const columns = [
    {
      name: "Borrower",
      selector: (row) => row.borrower,
      sortable: true,
    },
    {
      name: "To Borrow",
      selector: (row) => row.borrow_details,
      format: (row) => (
        <div style={{ padding: "1em 0em" }}>{row.borrow_details}</div>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "For",
      selector: (row) => row.destination.name,
      sortable: true,
    },
    {
      name: "From",
      selector: (row) => moment(row.from).format("ll"),
      sortable: true,
    },
    {
      name: "To",
      selector: (row) => moment(row.to).format("ll"),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => <LabelBorrowStatus status={row.status} />,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => <>-</>,
      format: (row) => (
        <>
          <PopupButton
            content="Details"
            iconName="book"
            color="blue"
            onClick={() => {
              modalActions.openModal(
                dispatch,
                "Borrow Details",
                <DetailsModal data={BorrowDetailsObject(row)} />
              );
            }}
          />

          {userRole === "department" && row.status === "borrowed" && (
            <>
              <PopupButton
                content="Return"
                iconName="refresh"
                color="green"
                onClick={() => {
                  modalActions.openModal(
                    dispatch,
                    "Return Borrowed Items",
                    <ConfirmationModal
                      onSubmit={() => {
                        modalActions.closeModal(dispatch);
                      }}
                      content={<LabelBorrowedItems items={row.items} />}
                    />
                  );
                }}
              />
            </>
          )}

          {userRole !== "department" && (
            <>
              <PopupButton
                content="Process request"
                iconName="hourglass half"
                color="orange"
                onClick={() => {
                  history.push("/borrows/" + row.id);
                }}
              />
              <PopupButton
                content="Reject"
                iconName="cancel"
                color="red"
                onClick={() => {
                  modalActions.openModal(
                    dispatch,
                    "Reject Borrow",
                    <RejectBorrow id={row.id} onSave={loadRequests} />
                  );
                }}
              />
            </>
          )}
        </>
      ),
      right: true,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [dt, setDt] = useState([]);
  const [dtTemp, setDtTemp] = useState([]);

  const [rooms, setRooms] = useState([]);
  const [selectedRoomID, setSelectedRoomID] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    if (userRole === "department") {
      const responseDeptCurrent = await agent.Department.current();
      setRooms(responseDeptCurrent.rooms);
    }

    loadRequests();
  };

  const loadRequests = async () => {
    setLoading(true);

    const response = await agent.Borrow.processable();

    setDtTemp(response);
    // setDt(response);

    if (userRole !== "department") {
      var rooms = [];

      response.forEach((a) => {
        const exists = rooms.find((b) => b.id === a.destination_room);
        if (!exists) rooms.push(a.destination);
      });

      setRooms(rooms);
    }

    if (userRole !== "department") {
      setSelectedRoomID(0);
      loadBorrows(response, 0);
    } else {
      loadBorrows(response, selectedRoomID);
    }

    setLoading(false);
  };

  const loadBorrows = (data, id) => {
    if (id === 0) {
      setDt(data);
      return;
    }

    setDt(
      data.filter((a) => {
        return a.destination_room === id;
      })
    );
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          BORROWS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>
      <div className="mb-10 clearfix">
        {userRole === "department" && (
          <div className="float-r disp-ib">
            <Button
              size="small"
              color="green"
              onClick={() => {
                modalActions.openModal(
                  dispatch,
                  "Borrow Request",
                  <BorrowRequest
                    onSave={() => {
                      loadRequests();
                    }}
                  />
                );
              }}
            >
              <Icon name="add" /> Borrow Request
            </Button>
          </div>
        )}
      </div>

      <Menu style={{ overflowX: "auto" }}>
        <Menu.Item
          disabled={loading}
          onClick={() => {
            setSelectedRoomID(0);
            loadBorrows(dtTemp, 0);
          }}
          className={0 === selectedRoomID ? "text-bold" : ""}
          active={0 === selectedRoomID}
        >
          <Icon name="cubes" />
          All Borrows
        </Menu.Item>
        {rooms.map((room, index) => {
          return (
            <Menu.Item
              key={index}
              active={room.id === selectedRoomID}
              className={room.id === selectedRoomID ? "text-bold" : ""}
              onClick={() => {
                setSelectedRoomID(room.id);
                loadBorrows(dtTemp, room.id);
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

      <DataTable columns={columns} data={dt} pagination striped />
    </>
  );
};
