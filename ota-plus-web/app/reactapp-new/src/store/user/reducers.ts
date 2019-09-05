import {
    UserState,
    UserActionTypes,
  SET_USER_PROFILE_DONE,
} from './types';

export const initialState: UserState = {
  profile: {
    fullName: '',
    email: '',
  },
};

export function userReducer(
    state = initialState,
    action: UserActionTypes,
): UserState {
  switch (action.type) {
    case SET_USER_PROFILE_DONE:
      return {
        profile: { ...state.profile, ...action.payload },
      };
    default:
      return state;
  }
}
