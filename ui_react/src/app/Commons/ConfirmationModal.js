import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";

export const ConfirmationModal = ({ content, onSubmit }) => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  return (
    <>
      <Modal.Content>{content}</Modal.Content>
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
          onClick={onSubmit}
        >
          OK
        </Button>
      </Modal.Actions>
    </>
  );
};
