import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Modal } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";

export const PIRCreatePO = ({ onSave, id }) => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const inputFile = useRef(null);

  return (
    <>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Purchase Order</label>
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

              await agent.PurchaseItemRequests.createPo(id, file);

              if (onSave) onSave();
              toast.success("Rejected");
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
