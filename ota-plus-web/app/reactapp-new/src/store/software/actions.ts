import { createAction } from '../../utils/makeAction';
import { ActionType, ISoftwareState } from './types';
import { ActionsUnion } from '../../utils/types';

export const Actions = {
  setAllSoftwareRequest: () => createAction(ActionType.SET_ALL_SOFTWARE_REQUEST),
  setAllSoftwareDone: (software: ISoftwareState) => createAction(ActionType.SET_ALL_SOFTWARE_DONE, software),
  setAllSoftwareFailed: () => createAction(ActionType.SET_ALL_SOFTWARE_FAILED)
};

export type Actions = ActionsUnion<typeof Actions>;
