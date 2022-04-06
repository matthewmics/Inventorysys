import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  Icon,
  Input,
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
import { roleOptions, roomTypeOptions } from "../Commons/Enumerations";
import { ErrorMessage } from "../Commons/ErrorMessage";
import { PopupButton } from "../Commons/PopupButton";

export const RoomComponent = () => {
  const [buildingList, setBuildingList] = useState([
    {
      value: 0,
      text: "---",
    },
  ]);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Room type",
      selector: (row) => row.room_type,
      sortable: true,
    },
    {
      name: "Building",
      selector: (row) => row.building,
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
    name: "",
    room_type: "room",
    building_id: 0,
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

  const loadRooms = async () => {
    setLoading(true);

    if (buildingList.length === 1) {
      let response = await agent.Building.list();
      response = response.map((a) => {
        return {
          value: a.id,
          text: a.name,
        };
      });

      setBuildingList([...buildingList, ...response]);
    }

    let response = await agent.Room.list();

    response = response.map((a) => {
      return {
        ...a,
        building: a.building ? a.building.name : "---",
        created_at: dateStringToLocal(a.created_at),
        actions: (
          <>
            <PopupButton
              content="Items"
              iconName="boxes"
              color="teal"
              onClick={() => {
                history.push(`/rooms/${a.id}/items`);
              }}
            />
            <Popup
              content="Edit Room"
              trigger={
                <Button
                  icon="pencil"
                  circular
                  size="tiny"
                  onClick={() => {
                    setFormValue({
                      id: a.id,
                      name: a.name,
                      room_type: a.room_type,
                      building_id: a.building_id ? a.building_id : 0,
                    });
                    setModalFormOpen(true);
                  }}
                />
              }
            />
            <Popup
              content="Delete Room"
              trigger={
                <Button
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

    setDataTemp(response);
    setData(response);
    setLoading(false);
  };

  const onFormSubmit = async () => {
    setFormErrors(null);
    setFormLoading(true);
    try {
      let { id, building_id, ...req } = formValue;
      req = {
        ...req,
        building_id: formValue.building_id === 0 ? null : formValue.building_id,
      };
      if (formValue.id === 0) {
        await agent.Room.create(req);
        toast.success("Room created successfully");
        loadRooms();
        setModalFormOpen(false);
      } else {
        await agent.Room.update(req, formValue.id);
        toast.success("Room updated successfully");
        loadRooms();
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
    await agent.Room.delete(archive.data.id);
    toast.success("Room deleted successfully");
    setArchive({ ...archive, loading: false, open: false });
    loadRooms();
  };

  useEffect(() => {
    loadRooms();
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
      {/* MODAL FORM */}
      <Modal size="tiny" open={modalFormOpen} closeOnDimmerClick={false}>
        <Modal.Header>
          {formValue.id === 0 ? "Create new room" : `Edit room`}
        </Modal.Header>
        <Modal.Content>
          {formErrors && <ErrorMessage errors={formErrors} />}
          <Form>
            <Form.Field>
              <label>Name</label>
              <input
                name="name"
                value={formValue.name}
                placeholder="Room name"
                onChange={handleTextInputChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Type</label>
              <Select
                options={roomTypeOptions}
                value={formValue.room_type}
                onChange={(undefined, data) => {
                  setFormValue({
                    ...formValue,
                    room_type: data.value,
                  });
                }}
              />
            </Form.Field>

            <Form.Field>
              <label>Building</label>
              <Select
                options={buildingList}
                value={formValue.building_id}
                onChange={(undefined, data) => {
                  setFormValue({
                    ...formValue,
                    building_id: data.value,
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
          ROOMS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>

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
        <div className="float-r disp-ib">
          <Button
            size="small"
            color="green"
            onClick={() => {
              setFormValue(formDefaultValue);
              setModalFormOpen(true);
            }}
          >
            <Icon name="add" /> Create Room
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={data} pagination striped />
    </>
  );
};
