import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Modal, Select } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";
import { itemTypeOptions } from "../Commons/Enumerations";

export const PurchaseItemRequestForm = ({ onSave }) => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const inputFile = useRef(null);

  const [formData, setFormData] = useState({
    requestor: "",
    to_purchase: "",
    purpose: "",
    department: "",
  });

  const [selectedItemType, setSelectedItemType] = useState("PC");
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    modalActions.setLoading(dispatch, true);

    let response = await agent.Department.rooms();

    response = response.map((a) => {
      return {
        text: a.name + " | " + a.building.name,
        value: a.id,
      };
    });

    setRooms(response);

    modalActions.setLoading(dispatch, false);
  };

  const onFormDataInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Purchase For</label>
            <Select
              search
              options={rooms}
              placeholder="Select Room"
              value={selectedRoom}
              onChange={(e, data) => {
                setSelectedRoom(data.value);
              }}
            ></Select>
          </Form.Field>

          <Form.Field>
            <label>Requestor Name</label>
            <Form.Input
              onChange={onFormDataInput}
              placeholder="Requestor Name"
              name="requestor"
              value={formData.requestor}
            ></Form.Input>
          </Form.Field>

          <Form.Field>
            <label>Department</label>
            <Form.Input
              onChange={onFormDataInput}
              placeholder="Department"
              name="department"
              value={formData.department}
            ></Form.Input>
          </Form.Field>

          <Form.Field>
            <label>Item To Purchase</label>
            <Form.Input
              onChange={onFormDataInput}
              placeholder="To Purchase"
              name="to_purchase"
              value={formData.to_purchase}
            ></Form.Input>
          </Form.Field>

          <Form.Field>
            <label>Item Type</label>
            <Form.Select
              options={itemTypeOptions}
              value={selectedItemType}
              onChange={(e, data) => {
                setSelectedItemType(data.value);
              }}
            ></Form.Select>
          </Form.Field>

          <Form.Field>
            <label>Purpose</label>
            <Form.TextArea
              onChange={onFormDataInput}
              placeholder="Purpose"
              name="purpose"
              value={formData.purpose}
            ></Form.TextArea>
          </Form.Field>

          <Form.Field>
            <label>File Attachment</label>
            <input type="file" ref={inputFile} />
          </Form.Field>
        </Form>
      </Modal.Content>

      <Modal.Actions>
        <Button
          negative
          loading={modal.loading}
          disabled={modal.loading}
          onClick={() => {
            modalActions.closeModal(dispatch);
          }}
        >
          Cancel
        </Button>

        <Button
          positive
          loading={modal.loading}
          disabled={modal.loading || selectedRoom === 0}
          onClick={async () => {
            modalActions.setLoading(dispatch, true);
            try {
              // request here
              //   var req = {
              //     ...formData,
              //     destination_room: selectedRoom,
              //     from: dateInput.from,
              //     to: dateInput.to,
              //   };

              //   await agent.Borrow.borrowRequest(req);
              const file =
                inputFile.current.files.length > 0
                  ? inputFile.current.files[0]
                  : "";

              const req = {
                ...formData,
                destination_room: selectedRoom,
                item_type: selectedItemType,
              };

              await agent.PurchaseItemRequests.create(req, file);

              toast.success("Request submitted");
              if (onSave) onSave();
              modalActions.closeModal(dispatch);
            } catch (err) {
              // console.log(err);
              modalActions.setErrors(dispatch, err.data.errors);
              modalActions.setLoading(dispatch, false);
            }
          }}
        >
          OK
        </Button>
      </Modal.Actions>
    </>
  );
};
