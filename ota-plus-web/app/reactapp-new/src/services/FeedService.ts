import axios from 'axios';
import { FeedData } from '../store/feed/types';
import buildUrl from '../helpers/UrlBuilder';
import ApiEndpoints from '../constants/endpoints';

export interface FeedServiceInterface {
  getFeedData(types: string[]): Promise<FeedData[]>;
}

export class FeedService implements FeedServiceInterface {
  public async getFeedData(types: string[]): Promise<FeedData[]> {
    const url = buildUrl(ApiEndpoints.FEED.ALL, types.length ? { types: types.join(',') } : {});
    const response = await axios.get(url);
    const { data } = response;
    return data;
  }
}

export const feedService: FeedServiceInterface = new FeedService();
