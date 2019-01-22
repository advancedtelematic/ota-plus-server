/** @format */

import { observable } from 'mobx';
import axios from 'axios';
import _ from 'lodash';
import Cookies from 'js-cookie';
import { API_FEATURES_FETCH } from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import { whatsNew } from './data/newFeatures';

export default class FeaturesStore {
  @observable featuresFetchAsync = {};
  @observable features = [];
  @observable clientId = null;
  @observable alphaPlusEnabled = true;
  @observable alphaTestEnabled = false;
  @observable whatsNew = whatsNew;

  @observable whatsNewPopOver = false;
  @observable whatsNewPostponed = false;
  @observable whatsNewShowPage = false;

  constructor() {
    resetAsync(this.featuresFetchAsync);
  }

  resetFeaturesFetchAsync(isFetching = false) {
    this.featuresFetchAsync = {
      isFetching,
      status: null,
    };
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

  checkWhatsNewStatus() {
    const currentVersion = _.last(Object.keys(this.whatsNew));
    const WHATS_NEW_DELAY = Cookies.get('WHATS_NEW_DELAY');
    const WHATS_NEW_HIDE = Cookies.get('WHATS_NEW_HIDE');
    const WHATS_NEW_HIDE_VERSION = Cookies.get('WHATS_NEW_HIDE_VERSION');

    if (currentVersion === WHATS_NEW_HIDE_VERSION) {
      this.whatsNewShowPage = true;
    } else if (WHATS_NEW_HIDE) {
      Cookies.set('WHATS_NEW_HIDE', 'false');
      Cookies.remove('WHATS_NEW_HIDE_VERSION');
      this.whatsNewPopOver = true;
    }

    if (WHATS_NEW_DELAY && !WHATS_NEW_HIDE) {
      this.whatsNewPostponed = true;
    }

    if (!WHATS_NEW_DELAY && !WHATS_NEW_HIDE) {
      this.whatsNewPopOver = true;
    }
  }

  setWhatsNewDelay() {
    Cookies.set('WHATS_NEW_DELAY', true, { expires: 1 });
    this.whatsNewPopOver = false;
    this.whatsNewPostponed = true;
  }

  setWhatsNewHide() {
    const currentVersion = _.last(Object.keys(this.whatsNew));
    Cookies.set('WHATS_NEW_HIDE', 'true');
    Cookies.set('WHATS_NEW_HIDE_VERSION', currentVersion);
    Cookies.remove('WHATS_NEW_DELAY');
    this.whatsNewPopOver = false;
    this.whatsNewPostponed = false;
    this.whatsNewShowPage = true;
  }

  _reset() {
    resetAsync(this.featuresFetchAsync);
  }
}
