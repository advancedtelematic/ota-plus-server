import { RequireAtLeastOne } from '../../utils/types';

export type FeedDataEntryType = 'campaign' | 'device' | 'device_group' | 'software' | 'update';

export interface FeedNetworkingData {
  createdAt: string;
  _type: FeedDataEntryType;
  resource: Record<string, any>;
}

interface BaseFeedData {
  id?: string;
  uuid?: string;
  createdAt: string;
  type: FeedDataEntryType;
  name: string;
  supplementaryText: string;
}

export type FeedData = RequireAtLeastOne<BaseFeedData, 'id' | 'uuid'>;

export interface IFeedState {
  data: FeedData[];
}

export enum ActionTypes {
  GET_FEED_REQUEST = 'GET_FEED_REQUEST',
  SET_FEED_DATA_DONE = 'SET_FEED_DATA_DONE',
  SET_FEED_DATA_FAILED = 'SET_FEED_DATA_FAILED',
}
