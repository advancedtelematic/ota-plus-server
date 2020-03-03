/** @format */

import { observable } from 'mobx';
import axios from 'axios';
import { API_FEATURES_FETCH } from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';

export default class FeaturesStore {
  @observable featuresFetchAsync = {};

  @observable features = [];

  @observable clientId = null;

  constructor() {
    resetAsync(this.featuresFetchAsync);
  }

  async fetchFeatures() {
    resetAsync(this.featuresFetchAsync, true);
    try {
      const { data, ...rest } = await axios.get(API_FEATURES_FETCH);
      data.map(feature => this.features.push(feature.id));


      this.featuresFetchAsync = handleAsyncSuccess({ data, ...rest });
    } catch (error) {
      this.featuresFetchAsync = handleAsyncError(error);
    }
  }

  reset() {
    resetAsync(this.featuresFetchAsync);
  }
}
