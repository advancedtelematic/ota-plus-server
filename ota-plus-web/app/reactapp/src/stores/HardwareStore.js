/* eslint-disable no-param-reassign */
/** @format */

import { observable } from 'mobx';
import axios from 'axios';
import _ from 'lodash';
import { API_ECUS_FETCH, API_ECUS_PUBLIC_KEY_FETCH, API_HARDWARE_IDS_FETCH } from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';

export default class HardwareStore {
  @observable hardwareFetchAsync = {};

  @observable hardwareFetchWsAsync = {};

  @observable hardwarePublicKeyFetchAsync = {};

  @observable hardwareIdsFetchAsync = {};

  @observable hardware = [];

  @observable filteredHardware = [];

  @observable publicKey = {};

  @observable hardwareIds = [];

  @observable hardwareIdsLimit = 1000;

  @observable hardwareIdsCurrentPage = 0;

  @observable hardwareFilter = '';

  @observable activeEcu = {
    hardwareId: null,
    serial: null,
    type: null,
  };

  constructor() {
    resetAsync(this.hardwareFetchAsync);
    resetAsync(this.hardwarePublicKeyFetchAsync);
  }

  fetchHardware(deviceId) {
    resetAsync(this.hardwareFetchAsync, true);
    return axios
      .get(`${API_ECUS_FETCH}/${deviceId}/system_info`)
      .then(
        (response) => {
          const hardware = response.data;
          if (!_.isEmpty(hardware)) {
            this.prepareHardware(hardware);
          }
          this.hardwareFetchAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.hardwareFetchAsync = handleAsyncError(error);
        },
      );
  }

  filterHardware(filter) {
    this.hardwareFilter = filter;
    let searchResults = [];
    _.each(this.hardware, (objects, index) => {
      _.each(objects, (value, property) => {
        property += ':';
        if (
          value
            .toString()
            .toLowerCase()
            .indexOf(filter.toLowerCase()) >= 0
          || property
            .toString()
            .toLowerCase()
            .indexOf(filter.toLowerCase()) >= 0
        ) {
          searchResults.push({
            [property]: value,
            id: this.hardware[index].id,
            showId:
              this.hardware[index].id
                .toString()
                .toLowerCase()
                .indexOf(filter.toLowerCase()) >= 0,
            name: this.hardware[index].name,
          });
        }
      });
    });
    searchResults = _.groupBy(searchResults, prop => prop.id);
    this.prepareFilteredHardware(searchResults);
  }

  prepareFilteredHardware(searchResults) {
    let pairs = [];
    _.each(searchResults, (properties,) => {
      _.each(properties, (value,) => {
        pairs.push(value);
      });
    });
    pairs = _.groupBy(pairs, prop => prop.id);
    const final = [];
    _.each(pairs, (pair,) => {
      const convert = {};
      _.each(pair, (obj,) => {
        _.each(obj, (o, i) => {
          convert[i] = o;
        });
      });
      final.push(convert);
    });
    this.filteredHardware = final;
  }

  capitalize = string => string.toUpperCase();

  prepareHardware(data) {
    const that = this;
    const pairs = {};
    if (_.isArray(data)) {
      _.each(data, (obj,) => {
        const name = obj.description ? this.capitalize(obj.description) : this.capitalize(obj.class);
        obj.name = name;
        if (obj.capabilities) {
          _.each(obj.capabilities, (value, property) => {
            obj[property] = value;
          });
        }
        if (obj.configuration) {
          _.each(obj.configuration, (value, property) => {
            obj[property] = value;
          });
        }
        that.hardware.push(obj);
        that.filteredHardware.push(obj);
        if (obj.children) {
          that.prepareHardware(obj.children);
        }
      });
    } else {
      _.each(data, (value, property) => {
        pairs[property] = value;
        pairs.name = data.description ? this.capitalize(data.description) : this.capitalize(data.class);
        if (property === 'children') {
          that.prepareHardware(data.children);
        }
      });
      that.hardware.push(pairs);
      that.filteredHardware.push(pairs);
    }
    that.hardware = _.sortBy(that.hardware, 'name');
    that.filteredHardware = _.sortBy(that.filteredHardware, 'name');
  }

  fetchPublicKey(deviceId, ecuId) {
    resetAsync(this.hardwarePublicKeyFetchAsync, true);
    return axios
      .get(`${API_ECUS_PUBLIC_KEY_FETCH}/${deviceId}/ecus/public_key?ecu_serial=${ecuId}`)
      .then(
        (response) => {
          this.publicKey = response.data;
          this.hardwarePublicKeyFetchAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.hardwarePublicKeyFetchAsync = handleAsyncError(error);
        },
      );
  }

  fetchHardwareIds() {
    resetAsync(this.hardwareIdsFetchAsync, true);
    return axios
      .get(`${API_HARDWARE_IDS_FETCH}?limit=${this.hardwareIdsLimit}&offset=${this.hardwareIdsCurrentPage * this.hardwareIdsLimit}`)
      .then(
        (response) => {
          this.hardwareIds = response.data.values;
          this.hardwareIdsFetchAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.hardwareIdsFetchAsync = handleAsyncError(error);
        },
      );
  }

  reset() {
    resetAsync(this.hardwareFetchAsync);
    resetAsync(this.hardwareFetchWsAsync);
    resetAsync(this.hardwarePublicKeyFetchAsync);
    resetAsync(this.hardwareIdsFetchAsync);
    this.hardware = [];
    this.filteredHardware = [];
    this.publicKey = {};
    this.hardwareIdsCurrentPage = 0;
  }

  resetPublicKey() {
    resetAsync(this.hardwarePublicKeyFetchAsync);
    this.publicKey = {};
  }
}
