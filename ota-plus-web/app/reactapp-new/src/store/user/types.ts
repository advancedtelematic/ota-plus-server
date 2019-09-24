export interface IUserProfile {
  fullName: string;
  email: string;
  picture?: string;
}

export interface IUserState {
  profile: IUserProfile;
}

export enum ActionType {
  SET_USER_PROFILE_REQUEST = 'SET_USER_PROFILE_REQUEST',
  SET_USER_PROFILE_DONE = 'SET_USER_PROFILE_DONE',
  SET_USER_PROFILE_FAILED = 'SET_USER_PROFILE_FAILED'
}
