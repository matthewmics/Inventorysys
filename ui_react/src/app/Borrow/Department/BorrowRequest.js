import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Modal, Select } from "semantic-ui-react";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";
import moment from "moment";

export const BorrowRequest = ({ onSave }) => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);
  const [selectedRoom, setSelectedRoom] = useState(0);

  const [formData, setFormData] = useState({
    borrower: "",
    borrow_details: "",
    purpose: "",
    department: "",
  });

  const [dateInput, setDateInput] = useState({
    from: moment().format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),
    min: moment().format("YYYY-MM-DD"),
    max: moment().format("YYYY-MM-DD"),
  });

  const onFormDataInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    modalActions.setLoading(dispatch, true);

    let response = await agent.Department.rooms();

    // response = response.filter((a) => {
    //   return a.id !== itemToBorrow.room_id;
    // });

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
            <label>Borrower Name</label>
            <Form.Input
              onChange={onFormDataInput}
              placeholder="Borrower Name"
              name="borrower"
              value={formData.borrower}
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
            <label>Things to borrow</label>
            <Form.TextArea
              onChange={onFormDataInput}
              placeholder="Write here the things you want to borrow and how many"
              name="borrow_details"
              value={formData.borrow_details}
            ></Form.TextArea>
          </Form.Field>

          <Form.Field>
            <label>Purpose of borrow</label>
            <Form.TextArea
              onChange={onFormDataInput}
              placeholder="Write here the purpose of borrow"
              name="purpose"
              value={formData.purpose}
            ></Form.TextArea>
          </Form.Field>

          <Form.Group widths="equal">
            <Form.Field>
              <label>From</label>
              <Form.Input
                type="date"
                min={dateInput.max}
                value={dateInput.from}
                onChange={(e) => {
                  if (moment(e.target.value).isAfter(dateInput.to)) {
                    setDateInput({
                      ...dateInput,
                      from: e.target.value,
                      to: e.target.value,
                      min: e.target.value,
                    });
                    return;
                  }

                  setDateInput({
                    ...dateInput,
                    from: e.target.value,
                    min: e.target.value,
                  });
                }}
              ></Form.Input>
            </Form.Field>
            <Form.Field>
              <label>To</label>
              <Form.Input
                type="date"
                value={dateInput.to}
                min={dateInput.min}
                onChange={(e) => {
                  setDateInput({
                    ...dateInput,
                    to: e.target.value,
                  });
                }}
              ></Form.Input>
            </Form.Field>
          </Form.Group>
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
              var req = {
                ...formData,
                destination_room: selectedRoom,
                from: dateInput.from,
                to: dateInput.to,
              };

              await agent.Borrow.borrowRequest(req);

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
