import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import {
  Button,
  Form,
  Icon,
  Input,
  Loader,
  Modal,
  Popup,
  Select,
} from "semantic-ui-react";
import { history } from "../../..";
import { DelayedSearchInput } from "../../Commons/DelayedSearchInput";
import agent from "../../../agent";
import { dateStringToLocal } from "../../../helpers";
import { ErrorMessage } from "../../Commons/ErrorMessage";
import { toast } from "react-toastify";

export const DepartmentInventoryItemContent = () => {
  const { id: parentId, roomID } = useParams();

  const [rooms, setRooms] = useState([]);

  const [transferRequestErrors, setTransferRequestErrors] = useState(null);

  const [transferRequestModal, setTransferRequestModal] = useState({
    loading: false,
    open: false,
    errors: null,
  });

  const [transferRequestValue, setTransferRequestValue] = useState({
    item: null,
    details: "",
    destination_room_id: 0,
  });

  const onTransferRequestSubmit = async () => {
    setTransferRequestModal({
      ...transferRequestModal,
      loading: true,
    });

    setTransferRequestErrors(null);

    const req = {
      destination_room_id:
        transferRequestValue.destination_room_id === 0
          ? null
          : transferRequestValue.destination_room_id,
      item_id: transferRequestValue.item.id,
      details: transferRequestValue.details,
    };

    try {
      await agent.TransferRequest.itemTransfer(req);
      toast.success("Transfer request successfully submitted");
      setTransferRequestModal({
        ...transferRequestModal,
        loading: false,
        open: false,
      });
    } catch (err) {
      setTransferRequestErrors(err.data.errors);
      setTransferRequestModal({
        ...transferRequestModal,
        loading: false,
      });
    }
  };

  const columns = [
    {
      name: "Serial / Asset No.",
      selector: (row) => row.serial_number,
      sortable: true,
    },
    {
      name: "Room",
      selector: (row) => row.room,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.brand,
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

  const [itemParent, setItemParent] = useState({
    data: null,
    loading: false,
  });

  const [dataTemp, setDataTemp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadData = async () => {
    setLoading(true);

    const responseDeptCurrent = await agent.Department.current();

    setRooms([
      { value: 0, text: "---" },
      ...responseDeptCurrent.rooms
        .map((room) => {
          return {
            value: room.id,
            text: room.name,
          };
        })
        .filter((room) => {
          return room.value != roomID;
        }),
    ]);

    setItemParent(await agent.Inventory.parentInstance(parentId));

    let response =
      roomID != 0
        ? await agent.Room.items(roomID, parentId)
        : await agent.Inventory.parentAvailableItems(parentId);

    response = response.map((a) => {
      return {
        ...a,
        room: a.room ? a.room.name : "---",
        created_at: dateStringToLocal(a.created_at),
        actions: (
          <>
            <Popup
              content="Request Transfer"
              trigger={
                <Button
                  icon="dolly"
                  circular
                  size="tiny"
                  onClick={() => {
                    setTransferRequestErrors(null);
                    setTransferRequestValue({
                      item: a,
                      details: "",
                      destination_room_id: 0,
                    });
                    setTransferRequestModal({
                      ...transferRequestModal,
                      open: true,
                    });
                  }}
                />
              }
            />
          </>
        ),
      };
    });

    setData(response);
    setDataTemp(response);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {/* MODAL REQUEST TRANSFER */}
      <Modal
        size="tiny"
        open={transferRequestModal.open}
        closeOnDimmerClick={false}
      >
        <Modal.Header>
          Transfer Request | {transferRequestValue.item?.serial_number}
        </Modal.Header>
        <Modal.Content>
          {transferRequestErrors && (
            <ErrorMessage errors={transferRequestErrors} />
          )}
          <Form>
            <Form.Field>
              <label>From</label>
              <Input
                readOnly
                value={
                  transferRequestValue.item && transferRequestValue.item.room
                    ? transferRequestValue.item.room.name
                    : "Inventory"
                }
              />
            </Form.Field>
            <Form.Field>
              <label>To</label>
              <Select
                options={rooms}
                search
                value={transferRequestValue.destination_room_id}
                onChange={(e, data) => {
                  setTransferRequestValue({
                    ...transferRequestValue,
                    destination_room_id: data.value,
                  });
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Details</label>
              <textarea
                value={transferRequestValue.details}
                onChange={(e) => {
                  setTransferRequestValue({
                    ...transferRequestValue,
                    details: e.target.value,
                  });
                }}
              ></textarea>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            loading={transferRequestModal.loading}
            disabled={transferRequestModal.loading}
            onClick={() =>
              setTransferRequestModal({ ...transferRequestModal, open: false })
            }
          >
            Cancel
          </Button>
          <Button
            loading={transferRequestModal.loading}
            disabled={transferRequestModal.loading}
            positive
            onClick={() => onTransferRequestSubmit()}
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>

      <div>
        <div className="page-header-title">
          <span
            className="link"
            onClick={() => {
              history.push("/inventory");
            }}
          >
            INVENTORY{" "}
          </span>
          <Icon name="arrow right" />
          {!loading && <>{itemParent ? itemParent.name : "..."}</>}
          <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>
      <div className="mb-10 clearfix">
        <div className="disp-ib">
          <DelayedSearchInput
            onSearch={(val) => {
              setData(
                dataTemp.filter(
                  (a) =>
                    a.serial_number.toLowerCase().includes(val) ||
                    a.brand.toLowerCase().includes(val)
                )
              );
            }}
          />
        </div>
        <div className="float-r disp-ib"></div>
      </div>
      <DataTable columns={columns} data={data} pagination />
    </>
  );
};
