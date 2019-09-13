import { AppState } from '../index';

export const getFeeds = (state: AppState) => state.feed.data;
