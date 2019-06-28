/** @format */

import Cookies from 'js-cookie';
import { observable } from 'mobx';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import {
  API_USER_DETAILS,
  API_USER_UPDATE,
  API_USER_CHANGE_PASSWORD,
  API_USER_ACTIVE_DEVICE_COUNT,
  API_USER_DEVICES_SEEN,
  API_USER_CONTRACTS,
  API_USER_ORGANIZATIONS,
  API_USER_ORGANIZATIONS_ADD_USER,
  API_USER_ORGANIZATIONS_GET_USERS,
  API_USER_ORGANIZATION_EDIT,
  ORGANIZATION_NAMESPACE_COOKIE,
} from '../config';

import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import * as contracts from '../../../assets/contracts';
import { HTTP_CODE_200_OK } from '../constants/httpCodes';

export default class UserStore {
  @observable userFetchAsync = {};

  @observable contractsFetchAsync = {};

  @observable contractsAcceptAsync = {};

  @observable userUpdateAsync = {};

  @observable userChangePasswordAsync = {};

  @observable userActiveDeviceCountFetch = {};

  @observable user = {};

  @observable userOrganizationName = '';

  @observable userOrganizationNamespace = '';

  @observable userOrganizations = [];

  @observable userOrganizationUsers = [];

  @observable contracts = undefined;

  @observable ifLogout = false;

  constructor() {
    this.activatedDevices = observable.map();
    this.activeDevices = observable.map();
    this.connectedDevices = observable.map();
    this.activatedDevicesFetchAsync = observable.map();
    this.activeDevicesFetchAsync = observable.map();
    this.connectedDevicesFetchAsync = observable.map();
    this.editOrganizationNameAsync = observable.map();
    this.getOrganizationsAsync = observable.map();
    this.getOrganizationUsersAsync = observable.map();
    this.addUserToOrganizationAsync = observable.map();
    resetAsync(this.userFetchAsync);
    resetAsync(this.userUpdateAsync);
    resetAsync(this.userChangePasswordAsync);
    resetAsync(this.contractsFetchAsync);
    resetAsync(this.contractsAcceptAsync);
    resetAsync(this.editOrganizationNameAsync);
    resetAsync(this.getOrganizationsAsync);
    resetAsync(this.getOrganizationUsersAsync);
    resetAsync(this.addUserToOrganizationAsync);
  }

  editOrganizationName = async (name) => {
    resetAsync(this.editOrganizationNameAsync, true);
    try {
      const url = API_USER_ORGANIZATION_EDIT;
      const response = await axios.patch(url, { name });
      this.editOrganizationNameAsync = handleAsyncSuccess(response);
      this.getOrganizations();
    } catch (error) {
      this.editOrganizationNameAsync = handleAsyncError(error);
    }
  };

  getOrganizations = async () => {
    resetAsync(this.getOrganizationsAsync, true);
    try {
      const response = await axios.get(API_USER_ORGANIZATIONS);
      const { data } = response;
      this.userOrganizations = data;
      const namespaceCookie = Cookies.get(ORGANIZATION_NAMESPACE_COOKIE);
      let userOrganization;
      // we have to get organization based on cookie (if it exists) or default one by isCreator flag
      if (namespaceCookie) {
        userOrganization = data.find(organization => organization.namespace === namespaceCookie);
      } else {
        userOrganization = data.find(organization => organization.isCreator);
        Cookies.set(ORGANIZATION_NAMESPACE_COOKIE, userOrganization.namespace);
      }
      this.userOrganizationName = userOrganization.name;
      this.userOrganizationNamespace = userOrganization.namespace;
      this.getOrganizationsAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.getOrganizationsAsync = handleAsyncError(error);
    }
  };

  getOrganizationUsers = async () => {
    resetAsync(this.getOrganizationUsersAsync, true);
    try {
      const response = await axios.get(API_USER_ORGANIZATIONS_GET_USERS);
      const { data } = response;
      this.userOrganizationUsers = data;
      this.getOrganizationUsersAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.getOrganizationUsersAsync = handleAsyncError(error);
    }
  };

  addUserToOrganization = async (email) => {
    resetAsync(this.addUserToOrganizationAsync, true);
    try {
      const response = await axios.post(API_USER_ORGANIZATIONS_ADD_USER, { email });
      if (response.status === HTTP_CODE_200_OK) {
        this.getOrganizationUsers();
      }
      this.addUserToOrganizationAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.addUserToOrganizationAsync = handleAsyncError(error);
    }
  };

  fetchUser() {
    resetAsync(this.userFetchAsync, true);
    return axios
      .get(API_USER_DETAILS)
      .then(
        (response) => {
          this.user = response.data;
          this.userFetchAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.userFetchAsync = handleAsyncError(error);
        },
      );
  }

  fetchContracts() {
    resetAsync(this.contractsFetchAsync, true);
    return axios
      .get(API_USER_CONTRACTS)
      .then(
        (response) => {
          this.contracts = response.data;
          this.contractsFetchAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.contracts = {};
          this.contractsFetchAsync = handleAsyncError(error);
        },
      );
  }

  contractsCheckCompleted() {
    return this.contracts || false;
  }

  isTermsAccepted() {
    const terms = _.find(this.contracts, obj => contracts.default[obj.contract]);
    return !!(terms && terms.accepted);
  }

  acceptContract(path) {
    const encodedPath = encodeURIComponent(path);
    resetAsync(this.contractsAcceptAsync, true);
    return axios
      .put(`${API_USER_CONTRACTS}/${encodedPath}`)
      .then((response) => {
        this.fetchContracts();
        this.contractsAcceptAsync = handleAsyncSuccess(response);
        return true;
      })
      .catch((error) => {
        this.contractsAcceptAsync = handleAsyncError(error);
        return false;
      });
  }

  updateUser(data) {
    resetAsync(this.userChangePasswordAsync);
    resetAsync(this.userUpdateAsync, true);
    return axios
      .put(API_USER_UPDATE, data)
      .then(
        (response) => {
          this.fetchUser();
          this.userUpdateAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.userUpdateAsync = handleAsyncError(error);
        },
      );
  }

  changePassword() {
    resetAsync(this.userUpdateAsync);
    resetAsync(this.userChangePasswordAsync, true);
    return axios
      .post(API_USER_CHANGE_PASSWORD)
      .then(
        (response) => {
          this.userChangePasswordAsync = handleAsyncSuccess(response);
        },
      )
      .catch(
        (error) => {
          this.userChangePasswordAsync = handleAsyncError(error);
        },
      );
  }

  fetchActivatedDeviceCount(startTime, endTime) {
    const objKey = startTime.format('YYYYMM');
    resetAsync(this.activatedDevicesFetchAsync.get(objKey), true);
    return axios
      .get(`${API_USER_ACTIVE_DEVICE_COUNT}?start=${encodeURIComponent(startTime.toISOString())}&end=${encodeURIComponent(endTime.toISOString())}`)
      .then(
        (response) => {
          this.activatedDevices.set(objKey, response.data);
          this.activatedDevicesFetchAsync.set(objKey, handleAsyncSuccess(response));
        },
      )
      .catch(
        (error) => {
          this.activatedDevicesFetchAsync.set(objKey, handleAsyncError(error));
        },
      );
  }

  fetchActiveDeviceCount(startTime, endTime) {
    const objKey = startTime.format('YYYYMM');
    resetAsync(this.activeDevicesFetchAsync.get(objKey), true);
    return axios
      .get(`${API_USER_ACTIVE_DEVICE_COUNT}?start=${encodeURIComponent(new Date(0).toISOString())}&end=${encodeURIComponent(endTime.toISOString())}`)
      .then(
        (response) => {
          this.activeDevices.set(objKey, response.data);
          this.activeDevicesFetchAsync.set(objKey, handleAsyncSuccess(response));
        },
      )
      .catch(
        (error) => {
          this.activeDevicesFetchAsync.set(objKey, handleAsyncError(error));
        },
      );
  }

  fetchConnectedDeviceCount(year, month) {
    const objKey = `${year}${month}`;
    resetAsync(this.connectedDevicesFetchAsync.get(objKey), true);
    return axios
      .get(`${API_USER_DEVICES_SEEN}/${year}/${month}`)
      .then(
        (response) => {
          this.connectedDevices.set(objKey, response.data);
          this.connectedDevicesFetchAsync.set(objKey, handleAsyncSuccess(response));
        },
      )
      .catch(
        (error) => {
          this.connectedDevicesFetchAsync.set(objKey, handleAsyncError(error));
        },
      );
  }

  setUsageInitial(startTime, monthsCount) {
    for (let i = 0; i <= monthsCount; i += 1) {
      const startTimeTmp = moment(startTime).add(i, 'months');
      const objKey = startTimeTmp.format('YYYYMM');
      this.activatedDevices.set(objKey, {});
      this.activeDevices.set(objKey, {});
      this.connectedDevices.set(objKey, {});
      this.activatedDevicesFetchAsync.set(objKey, {});
      this.activeDevicesFetchAsync.set(objKey, {});
      this.connectedDevicesFetchAsync.set(objKey, {});
      resetAsync(this.activatedDevicesFetchAsync.get(objKey));
      resetAsync(this.activeDevicesFetchAsync.get(objKey));
      resetAsync(this.connectedDevicesFetchAsync.get(objKey));
    }
  }

  _deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  logout() {
    this.ifLogout = true;
  }
}
