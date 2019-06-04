/** @format */

import { observable } from 'mobx';
import axios from 'axios';
import _ from 'lodash';
import { API_FEATURES_FETCH } from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';

export default class FeaturesStore {
  @observable featuresFetchAsync = {};
  @observable features = [];
  @observable clientId = null;
  @observable alphaPlusEnabled = false;
  @observable alphaTestEnabled = false;

  constructor() {
    resetAsync(this.featuresFetchAsync);
  }

  fetchFeatures() {
    resetAsync(this.featuresFetchAsync, true);
    return axios
      .get(API_FEATURES_FETCH)
      .then(response => {
        this.features = response.data;
        if (_.includes(response.data, 'alphaplus')) {
          this.alphaPlusEnabled = true;
        }
        if (_.includes(response.data, 'alphatest')) {
          this.alphaTestEnabled = true;
        }

        this.featuresFetchAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.featuresFetchAsync = handleAsyncError(error);
      });
  }

  _reset() {
    resetAsync(this.featuresFetchAsync);
  }
}
