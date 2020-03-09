/** @format */

import { observable } from 'mobx';
import { notification } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import {
  API_PROVISIONING_STATUS,
  API_PROVISIONING_DOWNLOAD,
  API_PROVISIONING_DETAILS,
  API_PROVISIONING_KEYS_FETCH,
  API_PROVISIONING_KEY_CREATE,
  API_NAMESPACE_SETUP_STEPS,
  NAMESPACE_SETUP_TIMEOUT_MS,
  NOTIFICATION_DURATION_SEC,
} from '../config';
import { SORT_DIR_ASC, SORT_DIR_DESC } from '../constants';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import { HTTP_CODE_200_OK } from '../constants/httpCodes';

export default class ProvisioningStore {
  @observable provisioningStatusFetchAsync = {};

  @observable provisioningActivateAsync = {};

  @observable namespaceSetupFetchAsync = {};

  @observable provisioningDetailsFetchAsync = {};

  @observable provisioningKeysFetchAsync = {};

  @observable provisioningKeyCreateAsync = {};

  @observable provisioningStatus = {};

  @observable provisioningDetails = {};

  @observable initialProvisioningKeys = [];

  @observable provisioningKeys = [];

  @observable provisioningKeysSort = SORT_DIR_ASC;

  @observable preparedProvisioningKeys = [];

  @observable provisioningFilter = '';

  @observable sanityCheckCompleted = false;

  constructor() {
    resetAsync(this.provisioningStatusFetchAsync);
    resetAsync(this.namespaceSetupFetchAsync);
    resetAsync(this.provisioningActivateAsync);
    resetAsync(this.provisioningDetailsFetchAsync);
    resetAsync(this.provisioningKeysFetchAsync);
    resetAsync(this.provisioningKeyCreateAsync);
  }

  filterProvisioningKeys(filter) {
    this.provisioningFilter = filter;
    const searchResults = [];
    _.each(this.initialProvisioningKeys, key => (
      key.description.indexOf(filter) >= 0 ? searchResults.push(key) : null
    ));
    this.provisioningKeys = searchResults;
    this.prepareProvisioningKeys();
  }

  prepareProvisioningKeys(sort = this.provisioningKeysSort) {
    this.provisioningKeysSort = sort;
    const keys = this.provisioningKeys;

    this.preparedProvisioningKeys = keys.slice().sort((a, b) => {
      const aName = a.description;
      const bName = b.description;
      if (sort !== 'undefined' && sort === SORT_DIR_DESC) return bName.localeCompare(aName);
      return aName.localeCompare(bName);
    });
  }

  fetchProvisioningStatus() {
    resetAsync(this.provisioningStatusFetchAsync, true);
    return axios
      .get(API_PROVISIONING_STATUS)
      .then(
        (response) => {
          this.provisioningStatus = response.data;
          if (response.data.active) {
            this.fetchProvisioningDetails();
            this.fetchProvisioningKeys();
          }
          this.provisioningStatusFetchAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.provisioningStatusFetchAsync = handleAsyncError(error);
        },
      );
  }

  namespaceSetup() {
    resetAsync(this.namespaceSetupFetchAsync, true);
    return axios
      .get(API_NAMESPACE_SETUP_STEPS)
      .then(
        (response) => {
          this.sanityCheckCompleted = true;
          this.namespaceSetupFetchAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          const that = this;
          setTimeout(() => {
            that.namespaceSetup();
          }, NAMESPACE_SETUP_TIMEOUT_MS);
          this.namespaceSetupFetchAsync = handleAsyncError(error);
        },
      );
  }

  fetchProvisioningDetails() {
    resetAsync(this.provisioningDetailsFetchAsync, true);
    return axios
      .get(API_PROVISIONING_DETAILS)
      .then(
        (response) => {
          this.provisioningDetails = response.data;
          this.provisioningDetailsFetchAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.provisioningDetailsFetchAsync = handleAsyncError(error);
        },
      );
  }

  fetchProvisioningKeys() {
    resetAsync(this.provisioningKeysFetchAsync, true);
    return axios
      .get(API_PROVISIONING_KEYS_FETCH)
      .then(
        (response) => {
          this.initialProvisioningKeys = response.data;
          this.provisioningKeys = response.data;
          this.prepareProvisioningKeys();
          this.provisioningKeysFetchAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.provisioningKeysFetchAsync = handleAsyncError(error);
        },
      );
  }

  createProvisioningKey(data) {
    resetAsync(this.provisioningKeyCreateAsync, true);
    return axios
      .post(API_PROVISIONING_KEY_CREATE, data)
      .then(
        (response) => {
          this.fetchProvisioningKeys();
          this.provisioningKeyCreateAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.provisioningKeyCreateAsync = handleAsyncError(error);
        },
      );
  }

  downloadProvisioningKey = async (id) => {
    const downloadUrl = `${API_PROVISIONING_DOWNLOAD}/${id}`;
    try {
      const { status } = await axios.get(downloadUrl);
      if (status === HTTP_CODE_200_OK) {
        // eslint-disable-next-line no-restricted-globals
        location.href = downloadUrl;
      } else {
        throw new Error();
      }
    } catch (error) {
      notification.error({
        message: 'Please try again later.',
        // eslint-disable-next-line max-len
        description: 'If this is a new account, it may take some time to generate the keys for your repository. If the error persists, please try logging in again.',
        duration: NOTIFICATION_DURATION_SEC
      });
    }
  }

  reset() {
    resetAsync(this.provisioningStatusFetchAsync);
    resetAsync(this.namespaceSetupFetchAsync);
    resetAsync(this.provisioningActivateAsync);
    resetAsync(this.provisioningDetailsFetchAsync);
    resetAsync(this.provisioningKeysFetchAsync);
    resetAsync(this.provisioningKeyCreateAsync);
    this.provisioningStatus = {};
    this.provisioningDetails = {};
    this.initialProvisioningKeys = [];
    this.provisioningKeys = [];
    this.provisioningKeysSort = SORT_DIR_ASC;
    this.preparedProvisioningKeys = [];
    this.provisioningFilter = '';
    this.sanityCheckCompleted = false;
  }
}
