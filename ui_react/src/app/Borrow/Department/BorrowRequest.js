import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Modal, Select } from "semantic-ui-react";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";

export const BorrowRequest = ({ onSave, itemToBorrow }) => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);
  const [selectedRoom, setSelectedRoom] = useState(0);

  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    modalActions.setLoading(dispatch, true);

    let response = await agent.Department.rooms();

    response = response.filter((a) => {
      return a.id !== itemToBorrow.room_id;
    });

    response = response.map((a) => {
      return {
        text: a.name + " | " + a.building.name,
        value: a.id,
      };
    });

    setRooms(response);

    modalActions.setLoading(dispatch, false);
  };

  return (
    <>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Borrow For</label>
            <Select
              options={rooms}
              placeholder="Select Room"
              value={selectedRoom}
              onChange={(e, data) => {
                setSelectedRoom(data.value);
              }}
            ></Select>
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

              const req = {
                destination_room_id: selectedRoom,
                item_id: itemToBorrow.id,
                details: "N/A",
              };

              await agent.Borrow.borrow(req);

              if (onSave) onSave();
              modalActions.closeModal(dispatch);
            } catch (err) {
              console.log(err);
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
