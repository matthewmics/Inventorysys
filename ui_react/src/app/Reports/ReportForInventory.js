import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Form, Modal, Select } from "semantic-ui-react";
import { saveAs } from "file-saver";
import moment from "moment";
import { history } from "../..";
import modalActions from "../../actions/modalActions";
import reportActions from "../../actions/reportActions";

export const ReportForInventory = ({ items }) => {
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

//   const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  return (
    <>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label style={{ color: "grey" }}>
              Items (Leave this blank to generate report for all items)
            </label>
            <Dropdown
              search
              multiple={true}
              selection
              placeholder="Select Items"
              options={items}
              value={selectedItems}
              onChange={(e, data) => {
                setSelectedItems(data.value);
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
            reportActions.setSelectedItems(dispatch, [...selectedItems]);
            modalActions.closeModal(dispatch);
            history.push(`/inventory/reports?type=inventory`);
            // modalActions.setLoading(dispatch, true);

            // const req = {
            //   date: moment().format("LLL"),
            //   room_id: roomId,
            //   items_to_generate: [...selectedItems],
            // };
            // const response = await agent.Reports.roomReport(req);

            // saveAs(response, roomName + "-" + moment().format("L") + ".csv");

            // modalActions.closeModal(dispatch);
          }}
        >
          Generate Report
        </Button>
      </Modal.Actions>
    </>
  );
};
