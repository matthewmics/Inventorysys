import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Form, Grid, Icon, Message } from "semantic-ui-react";
import { history } from "..";
import { authLogin } from "../actions";
import { getToken } from "../helpers";

export const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    invalidLogin: false,
  });

  const dispatch = useDispatch();
  const { loadingLogin } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = getToken();
    if (token) {
      history.push("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setState({ ...state, invalidLogin: false });
    authLogin(
      {
        email: state.email,
        password: state.password,
      },
      dispatch
    ).catch((err) => {
      setState({ ...state, invalidLogin: true });
    });
  };

  return (
    <Grid container centered columns={2} style={{ marginTop: "2em" }}>
      <Grid.Column>
        <Card style={{ width: "100%" }}>
          <Card.Content header="Login" />
          <Card.Content>
            <Form id="form-login" onSubmit={handleSubmit}>
              <Form.Field>
                <label>Email</label>
                <input
                  placeholder="Email"
                  name="email"
                  value={state.email}
                  onChange={handleChange}
                ></input>
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={state.password}
                  onChange={handleChange}
                ></input>
              </Form.Field>
              {state.invalidLogin && (
                <Message negative>
                  <p>Invalid email / password</p>
                </Message>
              )}
            </Form>
          </Card.Content>
          <Card.Content extra>
            <Button
              form="form-login"
              type="submit"
              disabled={loadingLogin}
              loading={loadingLogin}
              primary
              size="small"
              content="Log in"
            />
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  );
};
