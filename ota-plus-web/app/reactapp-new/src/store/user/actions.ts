import { createAction } from '../../utils/makeAction';
import { ActionType, IUserProfile } from './types';
import { ActionsUnion } from '../../utils/types';

export const Actions = {
  setUserProfileRequest: () => createAction(ActionType.SET_USER_PROFILE_REQUEST),
  setUserProfileDone: (newUserProfile: IUserProfile) => createAction(ActionType.SET_USER_PROFILE_DONE, newUserProfile),
  setUserProfileFailed: () => createAction(ActionType.SET_USER_PROFILE_FAILED)
};

export type Actions = ActionsUnion<typeof Actions>;
