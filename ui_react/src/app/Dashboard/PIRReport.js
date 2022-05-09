import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Form, Modal } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";
import { saveAs } from "file-saver";
import moment from "moment";
import reportActions from "../../actions/reportActions";
import { history } from "../..";

export const PIRReport = () => {
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const statuses = [
    {
      key: "completed",
      value: "Completed",
      text: "Completed",
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
          onClick={() => {
            reportActions.setSelectedItems(dispatch, [...selectedStatuses]);
            modalActions.closeModal(dispatch);
            history.push(`/pirs/reports?type=pirs`);
            // modalActions.setLoading(dispatch, true);

            // const req = {
            //   date: moment().format("LLL"),
            //   status_to_generate: [...selectedStatuses],
            // };
            // const response = await agent.Reports.transferReport(req);

            // saveAs(response, "transfers" + "-" + moment().format("L") + ".csv");

            // modalActions.closeModal(dispatch);
          }}
        >
          Generate Report
        </Button>
      </Modal.Actions>
    </>
  );
};
