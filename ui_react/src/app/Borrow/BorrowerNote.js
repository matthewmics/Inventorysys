import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Loader, Modal, Segment } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";
import { downloadBase64File } from "../../libs/download";
import { PopupButton } from "../Commons/PopupButton";

export const BorrowerNote = ({ note, fileId }) => {
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  return (
    <>
      <Modal.Content>
        <Segment.Group>
          <Segment style={{ overflow: "auto" }}>
            <span className="label-secondary">Borrower Notes</span>
            {fileId && (
              <div style={{ float: "right" }}>
                <PopupButton
                  content="Download Attached"
                  iconName="cloud download"
                  onClick={async () => {
                    const response = await agent.FileStorage.get(fileId);
                    downloadBase64File(response.base64, response.name);
                  }}
                />
              </div>
            )}
          </Segment>
          <Segment>
            <span
              dangerouslySetInnerHTML={{ __html: note ? note : "-" }}
            ></span>
          </Segment>
        </Segment.Group>
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
