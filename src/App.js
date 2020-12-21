import React, { Fragment, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';

//Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import AuthPage from './components/authPage/AuthPage';

const App = () => {
  useEffect(() => {
    async function testingFunc() {
      const testing = await axios.get('/api/items/getAll');
      console.log(testing);
    }
    testingFunc();
  }, []);
  return (
    <Provider store={store}>
      <Fragment>
        <Container fluid="md">
          <AuthPage />
        </Container>
      </Fragment>
    </Provider>
  );
};

export default App;
