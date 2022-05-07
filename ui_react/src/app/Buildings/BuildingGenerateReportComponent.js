import { saveAs } from "file-saver";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Form, Modal, Select } from "semantic-ui-react";
import { history } from "../..";
import modalActions from "../../actions/modalActions";
import reportActions from "../../actions/reportActions";
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

    // const response = await agent.Inventory.parentList();
    const response = await agent.Building.items(buildingID);

    var _items = [];
    response.forEach((i) => {
      const parentItem = i.inventory_parent_item;

      const exists = _items.find((j) => j.id === parentItem.id);

      if (!exists) {
        _items.push(parentItem);
      }
    });

    setItems(
      _items.map((a) => {
        return {
          text: a.name,
          value: a.id,
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
          onClick={() => {
            reportActions.setSelectedItems(dispatch, [...selectedItems]);
            modalActions.closeModal(dispatch);
            history.push(
              `/buildings/${buildingID}/reports?name=${buildingName}&type=building`
            );
            // modalActions.setLoading(dispatch, true);

            // const req = {
            //   date: moment().format("LLL"),
            //   building_id: buildingID,
            //   items_to_generate: [...selectedItems],
            // };
            // const response = await agent.Reports.buildingReport(req);

            // saveAs(
            //   response,
            //   buildingName + "-" + moment().format("L") + ".csv"
            // );

            // modalActions.closeModal(dispatch);
          }}
        >
          Generate Report
        </Button>
      </Modal.Actions>
    </>
  );
};
