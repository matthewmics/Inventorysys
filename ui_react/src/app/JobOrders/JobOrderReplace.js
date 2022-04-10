import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Modal, Select } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";

export const JobOrderReplace = ({ onSave, parentId, jobOrderId }) => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const [availableItems, setAvailableItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(0);

  useEffect(() => {
    loadAvailableItems();
  }, []);

  const loadAvailableItems = async () => {
    modalActions.setLoading(dispatch, true);
    const response = await agent.Inventory.parentAvailableItems(parentId);
    setAvailableItems(
      response.map((a) => {
        return {
          text: a.serial_number,
          value: a.id,
        };
      })
    );
    modalActions.setLoading(dispatch, false);
  };

  return (
    <>
      <Modal.Content>
        {!modal.loading && availableItems.length === 0 && (
          <p>No Available Items Found From Inventory</p>
        )}
        <Form>
          <Form.Field>
            <label>Available Item From Inventory</label>
            <Select
              value={selectedItem}
              placeholder="Select Item"
              options={availableItems}
              search
              onChange={(e, data) => {
                setSelectedItem(data.value);
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
          disabled={modal.loading || selectedItem === 0}
          onClick={async () => {
            modalActions.setLoading(dispatch, true);
            try {
              await agent.JobOrders.replace(jobOrderId, {
                replacement_item_id: selectedItem,
              });
              if (onSave) onSave();
              modalActions.closeModal(dispatch);
            } catch (err) {
              console.log(err);
              toast.error(
                "An error has occured. Check your internet connection"
              );
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
