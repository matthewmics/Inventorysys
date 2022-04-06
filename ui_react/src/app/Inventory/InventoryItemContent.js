import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  Icon,
  Input,
  Label,
  Loader,
  Modal,
  Popup,
  Segment,
  Select,
} from "semantic-ui-react";
import { history } from "../..";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";
import { DelayedSearchInput } from "../Commons/DelayedSearchInput";
import {
  itemTypeOptions,
  roleOptions,
  roomTypeOptions,
} from "../Commons/Enumerations";
import { ErrorMessage } from "../Commons/ErrorMessage";
import {
  checkIfItemInTransaction,
  getItemLabelStatus,
} from "./InventoryHelpers";
import { ItemStatusCurrentStatusLabel } from "./ItemStatusCurrentStatusLabel";

export const InventoryItemContent = () => {
  const { id: parentId } = useParams();

  const [roomOptions, setRoomOptions] = useState([]);

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
      name: "Status",
      selector: (row) => <ItemStatusCurrentStatusLabel item={row} />,
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

  const handleTextInputChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const formDefaultValue = {
    serial_number: "",
    brand: "",
    room_id: 0,
    id: 0,
  };

  const [archive, setArchive] = useState({
    loading: false,
    data: null,
    open: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState(null);
  const [formValue, setFormValue] = useState(formDefaultValue);

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [dataTemp, setDataTemp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadData = async () => {
    setLoading(true);

    let roomResponse = await agent.Room.list();

    setRoomOptions([
      {
        value: 0,
        text: "---",
      },
      ...roomResponse.map((a) => {
        return {
          value: a.id,
          text: a.name,
        };
      }),
    ]);

    const itemParentResponse = await agent.Inventory.parentInstance(parentId);
    setItemParent(itemParentResponse);

    let response = await agent.Inventory.parentItemItems(parentId);

    response = response.map((a) => {
      return {
        ...a,
        room: a.room ? a.room.name : "---",
        created_at: dateStringToLocal(a.created_at),
        actions: (
          <>
            {/* {itemParentResponse.item_type === "PC" && (
              <Popup
                content="Components"
                trigger={
                  <Button
                    icon="computer"
                    circular
                    size="tiny"
                    onClick={() => {
                      history.push(`/inventory/items/${a.id}/components`);
                    }}
                  />
                }
              />
            )} */}

            <Popup
              content="Edit Item"
              trigger={
                <Button
                  disabled={checkIfItemInTransaction(a)}
                  icon="pencil"
                  circular
                  size="tiny"
                  onClick={() => {
                    setFormValue({
                      id: a.id,
                      serial_number: a.serial_number,
                      brand: a.brand,
                      room_id: a.room ? a.room.id : 0,
                    });
                    setModalFormOpen(true);
                  }}
                />
              }
            />
            <Popup
              content="Delete Item"
              trigger={
                <Button
                  disabled={checkIfItemInTransaction(a)}
                  icon="archive"
                  circular
                  size="tiny"
                  onClick={() => {
                    setArchive({ ...archive, open: true, data: a });
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

  const onFormSubmit = async () => {
    setFormErrors(null);
    setFormLoading(true);
    try {
      let { id, room_id, ...req } = formValue;
      req = {
        ...req,
        room_id: formValue.room_id === 0 ? null : formValue.room_id,
      };
      if (formValue.id === 0) {
        await agent.Inventory.itemCreate({
          ...req,
          inventory_parent_item_id: parentId,
        });
        toast.success("Item created successfully");
        loadData();
        setModalFormOpen(false);
      } else {
        await agent.Inventory.itemUpdate(req, formValue.id);
        toast.success("Item updated successfully");
        loadData();
        setModalFormOpen(false);
      }
    } catch (err) {
      setFormErrors(err.data.errors);
    } finally {
      setFormLoading(false);
    }
  };

  const onArchive = async () => {
    setArchive({ ...archive, loading: true });
    await agent.Inventory.itemDelete(archive.data.id);
    toast.success("Item deleted successfully");
    setArchive({ ...archive, loading: false, open: false });
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {/* MODAL ARCHIVE */}
      <Modal size="tiny" open={archive.open} closeOnDimmerClick={false}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Content>
          Are you sure you want to archive {archive.data?.name} ?
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            loading={archive.loading}
            disabled={archive.loading}
            onClick={() => setArchive({ ...archive, open: false })}
          >
            Cancel
          </Button>
          <Button
            loading={archive.loading}
            disabled={archive.loading}
            positive
            onClick={() => onArchive()}
          >
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
      {/* MODAL ARCHIVE */}
      <Modal size="tiny" open={archive.open} closeOnDimmerClick={false}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Content>
          Are you sure you want to archive {archive.data?.name} ?
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            loading={archive.loading}
            disabled={archive.loading}
            onClick={() => setArchive({ ...archive, open: false })}
          >
            Cancel
          </Button>
          <Button
            loading={archive.loading}
            disabled={archive.loading}
            positive
            onClick={() => onArchive()}
          >
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
      {/* MODAL FORM */}
      <Modal size="tiny" open={modalFormOpen} closeOnDimmerClick={false}>
        <Modal.Header>
          {formValue.id === 0 ? "Create new item" : `Edit item`}
        </Modal.Header>
        <Modal.Content>
          {formErrors && <ErrorMessage errors={formErrors} />}
          <Form>
            <Form.Field>
              <label>Serial / Asset Number</label>
              <input
                name="serial_number"
                value={formValue.serial_number}
                placeholder="Serial / Asset No."
                onChange={handleTextInputChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Brand</label>
              <input
                name="brand"
                value={formValue.brand}
                placeholder="Brand"
                onChange={handleTextInputChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Room</label>
              <Select
                search
                options={roomOptions}
                value={formValue.room_id}
                onChange={(e, data) => {
                  setFormValue({
                    ...formValue,
                    room_id: data.value,
                  });
                }}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            loading={formLoading}
            disabled={formLoading}
            onClick={() => setModalFormOpen(false)}
          >
            Cancel
          </Button>
          <Button
            loading={formLoading}
            disabled={formLoading}
            positive
            onClick={() => onFormSubmit()}
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
        <div className="float-r disp-ib">
          <Button
            size="small"
            color="green"
            onClick={() => {
              setFormValue(formDefaultValue);
              setModalFormOpen(true);
            }}
          >
            <Icon name="add" /> Create Item
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} pagination striped />
    </>
  );
};
