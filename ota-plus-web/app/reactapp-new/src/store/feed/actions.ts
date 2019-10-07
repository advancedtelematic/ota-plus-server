import { createAction } from '../../utils/makeAction';
import { ActionTypes, FeedData } from './types';
import { ActionsUnion } from '../../utils/types';

export const Actions = {
  getFeedData: (types: string[]) => createAction(ActionTypes.GET_FEED_REQUEST, types),
  setFeedData: (newFeedData: FeedData[]) => createAction(ActionTypes.SET_FEED_DATA_DONE, newFeedData),
  setFeedDataFailed: () => createAction(ActionTypes.SET_FEED_DATA_FAILED),
};

export type Actions = ActionsUnion<typeof Actions>;
