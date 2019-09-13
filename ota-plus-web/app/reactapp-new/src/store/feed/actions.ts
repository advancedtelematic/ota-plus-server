import { createAction } from '../../utils/makeAction';
import { actionTypes, FeedData } from './types';
import { ActionsUnion } from '../../utils/types';

export const Actions = {
  getFeedData: (types: string[]) => createAction(actionTypes.GET_FEED_REQUEST, types),
  setFeedData: (newFeedData: FeedData[]) => createAction(actionTypes.SET_FEED_DATA_DONE, newFeedData),
  setFeedDataFailed: () => createAction(actionTypes.SET_FEED_DATA_FAILED),
};

export type Actions = ActionsUnion<typeof Actions>;
