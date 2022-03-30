import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Modal, Select } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";

export const JobOrderPurchaseOrder = ({ onSave, itemName, jobOrderId }) => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const inputFile = useRef(null);

  return (
    <>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Item</label>
            <Form.Input readOnly value={itemName} />
          </Form.Field>
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
            modalActions.setLoading(dispatch, true);
            try {
              // request here
              const file =
                inputFile.current.files.length > 0
                  ? inputFile.current.files[0]
                  : "";

              await agent.JobOrders.createPO(jobOrderId, file);

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
