import { saveAs } from "file-saver";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Form, Modal, Select } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";

export const BuildingGenerateReportComponent = ({
  buildingID,
  buildingName,
}) => {
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    modalActions.setLoading(dispatch, true);

    const response = await agent.Inventory.parentList();

    setItems(
      response.map((a) => {
        return {
          text: a.name,
          value: a.id,
          key: a.id,
        };
      })
    );

    modalActions.setLoading(dispatch, false);
  };

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
          onClick={async () => {
            modalActions.setLoading(dispatch, true);

            const req = {
              date: moment().format("LLL"),
              building_id: buildingID,
              items_to_generate: [...selectedItems],
            };
            const response = await agent.Reports.buildingReport(req);

            saveAs(
              response,
              buildingName + "-" + moment().format("L") + ".csv"
            );

            modalActions.closeModal(dispatch);
          }}
        >
          Generate Report
        </Button>
      </Modal.Actions>
    </>
  );
};
