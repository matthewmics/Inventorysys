import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Checkbox, Form, Modal, Select } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";

export const PIRCreatePO = ({ onSave, id, itemType }) => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const inputFile = useRef(null);

  const [isExisting, setIsExisting] = useState(true);

  const [existingItems, setExistingItems] = useState([]);
  const [selectedExistingItem, setSelectedExistingItem] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(async () => {
    setLoaded(true);
    if (!loaded) {
      modalActions.setLoading(dispatch, true);

      let response = await agent.Inventory.parentList();

      response = response
        .filter((a) => {
          return a.item_type === itemType;
        })
        .map((a) => {
          return {
            text: a.name,
            value: a.id,
          };
        });

      setExistingItems(response);
      modalActions.setLoading(dispatch, false);
    }

    if (existingItems.length !== 0)
      setSelectedExistingItem(existingItems[0].value);
  }, [existingItems]);

  return (
    <>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Checkbox
              toggle
              checked={isExisting}
              label="Existing Item"
              onChange={(e, data) => {
                setIsExisting(data.checked);
              }}
            />
          </Form.Field>
          {isExisting && (
            <Form.Field>
              <label>Existing Item</label>
              <Select
                search
                value={selectedExistingItem}
                options={existingItems}
                onChange={(e, data) => {
                  setSelectedExistingItem(data.value);
                }}
              />
            </Form.Field>
          )}
          <Form.Field>
            <label>Purchase Order</label>
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
          disabled={modal.loading || (isExisting && existingItems.length === 0)}
          onClick={async () => {
            modalActions.setErrors(dispatch, null);
            modalActions.setLoading(dispatch, true);

            try {
              const file =
                inputFile.current.files.length > 0
                  ? inputFile.current.files[0]
                  : "";

              let req = {};

              if (isExisting) {
                req = { existing_parent_item_id: selectedExistingItem };
              }

              await agent.PurchaseItemRequests.createPo(id, file, req);

              if (onSave) onSave();
              toast.success("Created");
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
