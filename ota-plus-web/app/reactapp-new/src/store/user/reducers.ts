import {
    UserState,
    actionTypes,
} from './types';
import { Actions } from './actions';

export const initialState: UserState = {
  profile: {
    fullName: '',
    email: '',
  },
};

export const userReducer = (state = initialState, action: Actions): UserState => {
  switch(action.type) {
    case actionTypes.SET_USER_PROFILE_DONE: {
      return {
        profile: { ...state.profile, ...action.payload}
      }
    }
    default:
      return state;
  }
}
