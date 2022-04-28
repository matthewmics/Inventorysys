import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Modal } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";

export const NotesForm = ({ name, id, onSave }) => {
  const dispatch = useDispatch();

  const modal = useSelector((state) => state.modal);
  const inputFile = useRef(null);

  const [note, setNote] = useState("");

  return (
    <>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Note</label>
            <Form.TextArea
              placeholder="Note"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Purchase Order (Optional)</label>
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

              const req = {
                [name]: id,
                message: note,
              };

              await agent.Notes.create(req, file);

              if (onSave) onSave();
              toast.success("Note Created");
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
