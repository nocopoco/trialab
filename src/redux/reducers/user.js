import { LOGIN } from '../actions/types';
import produce from 'immer';

const initialState = {
  email: '',
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      console.log('from reduxer');
      return produce(state, (draftState) => {
        draftState.email = 'HI';
        console.log('Dr leng ' + draftState.email);
      });
    default:
      return state;
  }
};

export default user;
