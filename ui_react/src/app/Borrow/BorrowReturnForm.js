import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Modal } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";

export const BorrowReturnForm = ({ onSave, id, itemList }) => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);
  const [noteText, setNoteText] = useState("");

  const inputFile = useRef(null);

  return (
    <>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Note</label>
            <Form.TextArea
              value={noteText}
              placeholder="Note"
              onChange={(e) => {
                setNoteText(e.target.value);
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>File Attachment (Optional)</label>
            <input type="file" ref={inputFile} />
          </Form.Field>
        </Form>
        <br></br>
        <label className="label-secondary">To Return</label>
        <div> {itemList}</div>
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
                  
              await agent.Borrow.return(id, { borrower_note: noteText }, file);

              if (onSave) onSave();
              toast.success("Returned");
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
