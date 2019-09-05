
export interface UserProfile {
  fullName: string;
  email: string;
  picture?: string;
}

export interface UserState {
  profile: UserProfile;
}

export const SET_USER_PROFILE_REQUEST = 'SET_USER_PROFILE_REQUEST';
export const SET_USER_PROFILE_DONE = 'SET_USER_PROFILE_DONE';
export const SET_USER_PROFILE_FAILED = 'SET_USER_PROFILE_FAILED';

interface SetUserProfileAction {
  type: typeof SET_USER_PROFILE_DONE;
  payload: UserProfile;
}

export type UserActionTypes = SetUserProfileAction;
