import { RequireAtLeastOne } from '../../utils/types';

export interface FeedNetworkingData {
  createdAt: string;
  _type: string;
  resource: Record<string, any>;
}

interface BaseFeedData {
  id?: string;
  uuid?: string;
  createdAt: string;
  name?: string;
  groupName?: string;
  _type: string;
}

export type FeedData = RequireAtLeastOne<BaseFeedData, 'id' | 'uuid'>;

export interface IFeedState {
  data: FeedData[];
}

export enum actionTypes {
  GET_FEED_REQUEST = 'GET_FEED_REQUEST',
  SET_FEED_DATA_DONE = 'SET_FEED_DATA_DONE',
  SET_FEED_DATA_FAILED = 'SET_FEED_DATA_FAILED',
}
