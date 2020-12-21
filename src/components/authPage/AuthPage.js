import React, { useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { loginUser } from '../../redux/actions/user';
import PropTypes from 'prop-types';

const AuthPage = ({ loginUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    loginUser(formData);
    console.log(formData);
  };
  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Log-in to your account
        </Header>
        <Form size="large" onSubmit={onSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              name="email"
              value={formData.email}
              onChange={onChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
            />

            <Button color="teal" fluid size="large" type="submit">
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us? <a href="#">Sign Up</a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

AuthPage.propTypes = {
  loginUser: PropTypes.func.isRequired,
};

export default connect(null, { loginUser })(AuthPage);
