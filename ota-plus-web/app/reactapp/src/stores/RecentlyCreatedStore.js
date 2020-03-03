/** @format */

import { observable } from 'mobx';
import axios from 'axios';
import { API_RECENTLY_CREATED } from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import { ACTIVITIES_TYPE_PARAMS } from '../constants';
import { prepareRecentlyCreatedItems } from '../helpers/recentActivityHelper';

export default class RecentlyCreatedStore {
  @observable recentlyCreatedFetchAsync = {};

  @observable recentlyCreatedData = [];

  @observable recentlyCreatedItems = [];

  constructor() {
    resetAsync(this.recentlyCreatedFetchAsync);
  }

  updateRecentlyCreatedItems() {
    this.recentlyCreatedItems = prepareRecentlyCreatedItems(this.recentlyCreatedData);
  }

  async fetchRecentlyCreated(types = ACTIVITIES_TYPE_PARAMS) {
    resetAsync(this.recentlyCreatedFetchAsync, true);
    try {
      const url = API_RECENTLY_CREATED.replace('$types', types.join(','));
      const { data } = await axios.get(url);
      this.recentlyCreatedData = data;
      this.recentlyCreatedItems = prepareRecentlyCreatedItems(data);
      this.recentlyCreatedFetchAsync = handleAsyncSuccess({ data });
    } catch (error) {
      this.recentlyCreatedFetchAsync = handleAsyncError(error);
    }
  }

  reset() {
    resetAsync(this.featuresFetchAsync);
  }
}
