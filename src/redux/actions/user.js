import axios from 'axios';
import { LOGIN } from './types';

//Login user
export const loginUser = (formData) => async (dispatch) => {
  try {
    console.log('FormData: ' + formData);
    dispatch({
      type: LOGIN,
      payload: formData,
    });
    //const res = await axios.get('/api/auth/login', formData);
  } catch (err) {
    console.log(err);
  }
};
