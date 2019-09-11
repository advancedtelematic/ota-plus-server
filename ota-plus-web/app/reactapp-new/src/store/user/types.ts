export interface UserProfile {
  fullName: string;
  email: string;
  picture?: string;
}

export interface UserState {
  profile: UserProfile;
}

export enum actionTypes {
  SET_USER_PROFILE_REQUEST = 'SET_USER_PROFILE_REQUEST',
  SET_USER_PROFILE_DONE = 'SET_USER_PROFILE_DONE',
  SET_USER_PROFILE_FAILED = 'SET_USER_PROFILE_FAILED'
}



