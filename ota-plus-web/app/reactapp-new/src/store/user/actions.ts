import { createAction } from "../../utils/makeAction";
import { actionTypes, UserProfile } from "./types";
import { ActionsUnion } from "../../utils/types";

export const Actions = {
  setUserProfileRequest: () => createAction(actionTypes.SET_USER_PROFILE_REQUEST),
  setUserProfileDone: (newUserProfile: UserProfile) => createAction(actionTypes.SET_USER_PROFILE_DONE, newUserProfile),
  setUserProfileFailed: () => createAction(actionTypes.SET_USER_PROFILE_FAILED)
}

export type Actions = ActionsUnion<typeof Actions>