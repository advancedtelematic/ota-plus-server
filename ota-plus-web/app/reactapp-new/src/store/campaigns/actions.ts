import { createAction } from '../../utils/makeAction';
import { ActionType, ICampaignsState } from './types';
import { ActionsUnion } from '../../utils/types';

export const Actions = {
  setAllCampaignsRequest: () => createAction(ActionType.SET_ALL_CAMPAIGNS_REQUEST),
  setAllCampaignsDone: (devices: ICampaignsState) => createAction(ActionType.SET_ALL_CAMPAIGNS_DONE, devices),
  setAllCampaignsFailed: () => createAction(ActionType.SET_ALL_CAMPAIGNS_FAILED)
} as const;

export type Actions = ActionsUnion<typeof Actions>;
