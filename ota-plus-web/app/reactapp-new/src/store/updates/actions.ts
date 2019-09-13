import { createAction } from '../../utils/makeAction';
import { ActionType, IUpdatesState } from './types';
import { ActionsUnion } from '../../utils/types';

export const Actions = {
  setAllUpdatesRequest: () => createAction(ActionType.SET_ALL_UPDATES_REQUEST),
  setAllUpdatesDone: (updates: IUpdatesState) => createAction(ActionType.SET_ALL_UPDATES_DONE, updates),
  setAllUpdatesFailed: () => createAction(ActionType.SET_ALL_UPDATES_FAILED)
};

export type Actions = ActionsUnion<typeof Actions>;
