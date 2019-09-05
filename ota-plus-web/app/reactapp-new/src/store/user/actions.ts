import {
  SET_USER_PROFILE_REQUEST,
  SET_USER_PROFILE_DONE,
  SET_USER_PROFILE_FAILED,
  UserProfile,
  UserActionTypes
} from './types';

export function setUserProfileRequest() {
  return {
    type: SET_USER_PROFILE_REQUEST
  };
}

export function setUserProfileDone(newUserProfile: UserProfile): UserActionTypes {
  return {
    type: SET_USER_PROFILE_DONE,
    payload: newUserProfile,
  };
}

export function setUserProfileFailed() {
  return {
    type: SET_USER_PROFILE_FAILED
  };
}
