import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Modal } from "semantic-ui-react";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";

export const DepartmentRequestRepair = ({ onConfirm, item }) => {
  // comp specific
  const inputFile = useRef(null);
  // ....

  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const [formValues, setFormValues] = useState({
    details: "",
  });

  const handleFormTextInput = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Item</label>
            <Form.Input value={item.parentName} readOnly></Form.Input>
          </Form.Field>

          <Form.Field>
            <label>Details</label>
            <Form.TextArea
              value={formValues.details}
              name="details"
              onChange={handleFormTextInput}
              placeholder="Details of the issue"
            ></Form.TextArea>
          </Form.Field>

          <Form.Field>
            <label>File attachment</label>
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
          disabled={modal.loading}
          onClick={async () => {
            modalActions.setErrors(dispatch, null);
            modalActions.setLoading(dispatch, true);

            try {
              const file =
                inputFile.current.files.length > 0
                  ? inputFile.current.files[0]
                  : "";

              // request here
              const req = {
                item_id: item.id,
                details: formValues.details,
              };

              await agent.RepairRequest.request(req, file);

              onConfirm();
              toast.success("Repair request has been submitted");
              modalActions.closeModal(dispatch);
            } catch (err) {
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
