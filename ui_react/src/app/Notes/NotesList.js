import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Loader, Modal, Segment } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";
import { downloadBase64File } from "../../libs/download";
import { PopupButton } from "../Commons/PopupButton";

export const NotesList = ({ id, name }) => {
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    const response = await agent.Notes.show(id, name);
    setNotes(response);
    setLoading(false);
  };

  return (
    <>
      <Modal.Content>
        {loading && (
          <div style={{ margin: "auto", width: "fit-content" }}>
            <Icon name="spinner" loading size="big" color="green" />
          </div>
        )}

        {!loading && notes.length === 0 && (
          <p>There are no notes to display.</p>
        )}

        {notes.map((note) => {
          return (
            <Fragment id={note.id}>
              <Segment.Group>
                <Segment>
                  <label className="label-secondary">
                    {dateStringToLocal(note.created_at)}
                  </label>
                  {note.file_storage_id && (
                    <div style={{ float: "right" }}>
                      <PopupButton
                        content="Download Attached"
                        iconName="cloud download"
                        onClick={async () => {
                          const response = await agent.FileStorage.get(
                            note.file_storage_id
                          );
                          downloadBase64File(response.base64, response.name);
                        }}
                      />
                    </div>
                  )}
                </Segment>
                <Segment>{note.message}</Segment>
              </Segment.Group>
            </Fragment>
          );
        })}
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
          Close
        </Button>
      </Modal.Actions>
    </>
  );
};
