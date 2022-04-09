import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form, Modal } from "semantic-ui-react";
import modalActions from "../../actions/modalActions";
import agent from "../../agent";

export const UserChangePassword = ({ user }) => {
  const dispatch = useDispatch();

  const modal = useSelector((a) => a.modal);

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Password</label>
            <Form.Input
              type="password"
              onChange={handleInput}
              placeholder="Password"
              name="password"
              value={formData.password}
            />
          </Form.Field>
          <Form.Field>
            <label>Password Confirmation</label>
            <Form.Input
              type="password"
              onChange={handleInput}
              placeholder="Password"
              name="password_confirmation"
              value={formData.password_confirmation}
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
            try {
              await agent.User.changePassword(user.id, { ...formData });
              toast.success("Password Changed");
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
