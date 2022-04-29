import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Form, Modal } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";
import { saveAs } from "file-saver";
import moment from "moment";

export const BorrowReport = () => {
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const statuses = [
    {
      key: "returned",
      value: "Returned",
      text: "Returned",
    },
    {
      key: "rejected",
      value: "Rejected",
      text: "Rejected",
    },
  ];

  const [selectedStatuses, setSelectedStatuses] = useState([]);
  return (
    <>
      {" "}
      <Modal.Content>
        <Form>
          <Form.Field>
            <label style={{ color: "grey" }}>
              Status (Leave this blank to generate report for all status)
            </label>
            <Dropdown
              search
              multiple={true}
              selection
              placeholder="Select Status"
              options={statuses}
              value={selectedStatuses}
              onChange={(e, data) => {
                setSelectedStatuses(data.value);
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
            modalActions.setLoading(dispatch, true);

            const req = {
              date: moment().format("LLL"),
              status_to_generate: [...selectedStatuses],
            };
            const response = await agent.Reports.borrowReport(req);

            saveAs(response, "borrows" + "-" + moment().format("L") + ".csv");

            modalActions.closeModal(dispatch);
          }}
        >
          Generate Report
        </Button>
      </Modal.Actions>
    </>
  );
};
