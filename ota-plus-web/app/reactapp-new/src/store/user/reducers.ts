import {
  IUserState,
  ActionType,
} from './types';
import { Actions } from './actions';

export const initialState: IUserState = {
  profile: {
    fullName: '',
    email: '',
  },
};

export const userReducer = (state = initialState, action: Actions): IUserState => {
  switch (action.type) {
    case ActionType.SET_USER_PROFILE_DONE: {
      return {
        profile: { ...state.profile, ...action.payload }
      };
    }
    default:
      return state;
  }
};
