import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Modal } from "semantic-ui-react";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";

export const RepairRequestRejectForm = ({ repairRequestId, onConfirm }) => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const [textAreaDetails, setTextAreaDetails] = useState("");

  return (
    <>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Details</label>
            <Form.TextArea
              value={textAreaDetails}
              placeholder="Rejection details"
              onChange={(e) => {
                setTextAreaDetails(e.target.value);
              }}
            />
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
              await agent.Workers.rejectRepairRequest({
                repair_request_id: repairRequestId,
                rejection_details: textAreaDetails,
              });

              onConfirm();
              toast.success("Repair request has been rejected");
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
