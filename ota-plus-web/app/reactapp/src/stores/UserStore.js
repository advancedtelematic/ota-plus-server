/** @format */

import Cookies from 'js-cookie';
import { observable } from 'mobx';
import axios from 'axios';
import encodeUrl from 'encodeurl';
import moment from 'moment';
import _ from 'lodash';

import {
  API_NAMESPACE_SETUP_STEPS,
  API_ORGANIZATIONS,
  API_ORGANIZATIONS_USERS,
  API_USER_DETAILS,
  API_USER_UPDATE,
  API_USER_CHANGE_PASSWORD,
  API_USER_ACTIVE_DEVICE_COUNT,
  API_USER_DEVICES_SEEN,
  API_USER_CONTRACTS,
  API_USER_DEFAULT_ORGANIZATION,
  API_USER_ORGANIZATIONS,
  API_USER_ORGANIZATIONS_GET_USERS,
  ORGANIZATION_NAMESPACE_COOKIE,
  API_UI_FEATURES,
  FEATURE_CATEGORIES,
  UI_FEATURES,
  equalIgnoreCase
} from '../config';

import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';
import * as contracts from '../../contracts';
import {
  HTTP_CODE_400_BAD_REQUEST,
  HTTP_CODE_429_TOO_MANY_REQUESTS,
  HTTP_CODE_503_SERVICE_UNAVAILABLE,
  HTTP_CODE_202_ACCEPTED
} from '../constants/httpCodes';
import { DEVICE_ACTIVATED_DATE_DATA_FORMAT, USAGE_DATE_DATA_FORMAT } from '../constants/datesTimesConstants';
import { sendAction } from '../helpers/analyticsHelper';
import {
  OTA_ENVIRONMENT_LEAVE,
  OTA_ENVIRONMENT_LEAVE_EMPTY,
  OTA_ENVIRONMENT_REMOVE_MEMBER
} from '../constants/analyticsActions';

export default class UserStore {
  @observable userFetchAsync = {};

  @observable canEditEnv = false;

  @observable contractsFetchAsync = {};

  @observable contractsAcceptAsync = {};

  @observable currentOrganization = {};

  @observable maxEnvReached = false;

  @observable showEnvDetails = false;

  @observable environmentsAddMember = false;

  @observable environmentsCreateEnvironment = false;

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

  @observable uiFeatures = [];

  @observable currentEnvUIFeatures = {};

  @observable currentEnvUIFeaturesCategorized = {};

  constructor() {
    this.activatedDevices = observable.map();
    this.activeDevices = observable.map();
    this.connectedDevices = observable.map();
    this.activatedDevicesFetchAsync = observable.map();
    this.activeDevicesFetchAsync = observable.map();
    this.connectedDevicesFetchAsync = observable.map();
    this.createEnvironmentAsync = observable.map();
    this.deleteMemberFromOrganizationAsync = observable.map();
    this.editOrganizationNameAsync = observable.map();
    this.getCurrentOrganizationAsync = observable.map();
    this.getOrganizationsAsync = observable.map();
    this.getOrganizationUsersAsync = observable.map();
    this.getUIFeaturesAsync = observable.map();
    this.addUserToOrganizationAsync = observable.map();
    this.toggleFeatureOnAsync = observable.map();
    this.toggleFeatureOffAsync = observable.map();
    resetAsync(this.userFetchAsync);
    resetAsync(this.userUpdateAsync);
    resetAsync(this.userChangePasswordAsync);
    resetAsync(this.contractsFetchAsync);
    resetAsync(this.contractsAcceptAsync);
    resetAsync(this.createEnvironmentAsync);
    resetAsync(this.deleteMemberFromOrganizationAsync);
    resetAsync(this.editOrganizationNameAsync);
    resetAsync(this.getCurrentOrganizationAsync);
    resetAsync(this.getOrganizationsAsync);
    resetAsync(this.getOrganizationUsersAsync);
    resetAsync(this.getUIFeaturesAsync);
    resetAsync(this.addUserToOrganizationAsync);
  }

  createEnvironment = async (name) => {
    resetAsync(this.createEnvironmentAsync, true);
    try {
      const response = await axios.post(API_USER_ORGANIZATIONS, { name });
      this.getOrganizations();
      this.createEnvironmentAsync = handleAsyncSuccess(response);
    } catch (error) {
      if (error.response.status === HTTP_CODE_400_BAD_REQUEST) {
        this.maxEnvReached = true;
      }
      this.createEnvironmentAsync = handleAsyncError(error);
    }
  };

  deleteMemberFromOrganization = async (email, refetchMembers, namespace = this.currentOrganization.namespace) => {
    resetAsync(this.deleteMemberFromOrganizationAsync, true);
    try {
      const encodedEmail = encodeURIComponent(email);
      if (equalIgnoreCase(email, this.user.email)) {
        sendAction(this.userOrganizationUsers.length === 1 ? OTA_ENVIRONMENT_LEAVE_EMPTY : OTA_ENVIRONMENT_LEAVE);
      } else {
        sendAction(OTA_ENVIRONMENT_REMOVE_MEMBER);
      }
      const response = await axios.delete(`${API_ORGANIZATIONS_USERS(namespace)}?email=${encodedEmail}`);
      this.getOrganizations();
      this.deleteMemberFromOrganizationAsync = handleAsyncSuccess(response);
      if (refetchMembers) {
        this.getOrganizationUsers(namespace);
      }
    } catch (error) {
      this.deleteMemberFromOrganizationAsync = handleAsyncError(error);
    }
  }

  editOrganizationName = async (name, namespace) => {
    resetAsync(this.editOrganizationNameAsync, true);
    try {
      const url = encodeUrl(`${API_ORGANIZATIONS}/${namespace}`);
      const response = await axios.patch(url, { name });
      this.editOrganizationNameAsync = handleAsyncSuccess(response);
      this.getOrganization(namespace);
      this.getOrganizations();
    } catch (error) {
      this.editOrganizationNameAsync = handleAsyncError(error);
    }
  };

  getOrganization = async (namespace = this.userOrganizationNamespace) => {
    resetAsync(this.getCurrentOrganizationAsync, true);
    try {
      const response = await axios.get(encodeUrl(`${API_ORGANIZATIONS}/${namespace}`));
      const { data } = response;
      this.currentOrganization = data;
      this.getCurrentOrganizationAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.getCurrentOrganizationAsync = handleAsyncError(error);
    }
  };

  getOrganizations = async () => {
    resetAsync(this.getOrganizationsAsync, true);
    try {
      const response = await axios.get(API_USER_ORGANIZATIONS);
      const responseData = response.data;
      this.userOrganizations = responseData;
      const namespaceCookie = Cookies.get(ORGANIZATION_NAMESPACE_COOKIE);
      let userOrganization;
      // we have to get organization based on cookie (if it exists) or default one by isDefault flag
      if (namespaceCookie) {
        userOrganization = responseData.find(organization => organization.namespace === namespaceCookie);
      } else {
        const { data } = await axios.get(API_USER_DEFAULT_ORGANIZATION);
        userOrganization = data;
        Cookies.set(ORGANIZATION_NAMESPACE_COOKIE, userOrganization.namespace);
      }
      this.userOrganizationName = userOrganization.name;
      this.userOrganizationNamespace = userOrganization.namespace;
      this.getOrganizationsAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.getOrganizationsAsync = handleAsyncError(error);
    }
  };

  getOrganizationUsers = async (namespace = this.userOrganizationNamespace) => {
    resetAsync(this.getOrganizationUsersAsync, true);
    try {
      const response = await axios.get(encodeUrl(API_USER_ORGANIZATIONS_GET_USERS(namespace)));
      const { data } = response;
      this.userOrganizationUsers = data;
      this.getOrganizationUsersAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.getOrganizationUsersAsync = handleAsyncError(error);
    }
  };

  getUIFeatures = async (
    namespace = this.userOrganizationNamespace,
    email = this.user.email,
    notInitial,
    resetUserUIFeatures
  ) => {
    resetAsync(this.getUIFeaturesAsync, true);
    try {
      const encodedEmail = encodeURIComponent(email);
      const response = await axios.get(encodeUrl(`${API_UI_FEATURES(namespace)}?email=${encodedEmail}`));
      const { data } = response;
      const categorizedData = {
        [FEATURE_CATEGORIES.ACCESS]: [],
        [FEATURE_CATEGORIES.CREDENTIALS]: [],
        [FEATURE_CATEGORIES.ENVIRONMENT]: [],
        [FEATURE_CATEGORIES.DEVICE]: [],
        [FEATURE_CATEGORIES.CUSTOM_FIELD]: [],
        [FEATURE_CATEGORIES.SOFTWARE]: [],
        [FEATURE_CATEGORIES.UPDATE]: [],
        [FEATURE_CATEGORIES.CAMPAIGN]: [],
      };
      data.forEach((el) => {
        if (el.id === UI_FEATURES.MANAGE_FEATURE_ACCESS) {
          categorizedData[FEATURE_CATEGORIES.ACCESS].push(el);
        }
        if (el.id === UI_FEATURES.ACCESS_CREDS) {
          categorizedData[FEATURE_CATEGORIES.CREDENTIALS].push(el);
        }
        if ([UI_FEATURES.ADD_MEMBER, UI_FEATURES.REMOVE_MEMBER, UI_FEATURES.RENAME_ENV].includes(el.id)) {
          categorizedData[FEATURE_CATEGORIES.ENVIRONMENT].push(el);
        }
        if ([
          UI_FEATURES.CREATE_DEVICE_GROUP,
          UI_FEATURES.RENAME_DEVICE,
          UI_FEATURES.SET_AUTO_UPDATE,
          UI_FEATURES.LAUNCH_SINGLE_DEVICE_UPDATE,
          UI_FEATURES.DELETE_DEVICE
        ].includes(el.id)) {
          categorizedData[FEATURE_CATEGORIES.DEVICE].push(el);
        }
        if ([
          UI_FEATURES.EDIT_CUSTOM_FIELD_VALUE,
          UI_FEATURES.DELETE_CUSTOM_FIELD,
          UI_FEATURES.RENAME_CUSTOM_FIELD,
          UI_FEATURES.UPLOAD_FILE_CUSTOM_FIELDS,
        ].includes(el.id)) {
          categorizedData[FEATURE_CATEGORIES.CUSTOM_FIELD].push(el);
        }
        if ([
          UI_FEATURES.DELETE_SOFTWARE_VERSION,
          UI_FEATURES.DELETE_SOFTWARE,
          UI_FEATURES.UPLOAD_SOFTWARE,
          UI_FEATURES.EDIT_SOFTWARE_COMMENT,
        ].includes(el.id)) {
          categorizedData[FEATURE_CATEGORIES.SOFTWARE].push(el);
        }
        if (el.id === UI_FEATURES.CREATE_SOFTWARE_UPDATE) {
          categorizedData[FEATURE_CATEGORIES.UPDATE].push(el);
        }
        if ([
          UI_FEATURES.CANCEL_CAMPAIGN,
          UI_FEATURES.CREATE_CAMPAIGN,
          UI_FEATURES.RETRY_FAILED_UPDATE,
        ].includes(el.id)) {
          categorizedData[FEATURE_CATEGORIES.CAMPAIGN].push(el);
        }
      });
      if (!notInitial) {
        this.uiFeatures = data;
      } else {
        this.currentEnvUIFeatures = { ...this.currentEnvUIFeatures, [email]: data };
        this.currentEnvUIFeaturesCategorized = { ...this.currentEnvUIFeaturesCategorized, [email]: categorizedData };
      }
      if (resetUserUIFeatures) {
        this.uiFeatures = data;
      }
      this.getUIFeaturesAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.getUIFeaturesAsync = handleAsyncError(error);
    }
  };

  toggleFeatureOn = async (namespace, email, id) => {
    resetAsync(this.toggleFeatureOnAsync, true);
    try {
      const encodedEmail = encodeURIComponent(email);
      const response = await axios.post(encodeUrl(`${API_UI_FEATURES(namespace)}/${id}?email=${encodedEmail}`));
      this.getUIFeatures(namespace, email, true, equalIgnoreCase(this.user.email, email));
      this.toggleFeatureOnAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.toggleFeatureOnAsync = handleAsyncError(error);
    }
  };

  toggleFeatureOff = async (namespace, email, id) => {
    resetAsync(this.toggleFeatureOffAsync, true);
    try {
      const encodedEmail = encodeURIComponent(email);
      const response = await axios.delete(encodeUrl(`${API_UI_FEATURES(namespace)}/${id}?email=${encodedEmail}`));
      this.getUIFeatures(namespace, email, true, equalIgnoreCase(this.user.email, email));
      this.toggleFeatureOffAsync = handleAsyncSuccess(response);
    } catch (error) {
      this.toggleFeatureOffAsync = handleAsyncError(error);
    }
  };

  addUserToOrganization = (email, namespace) => {
    resetAsync(this.addUserToOrganizationAsync, true);
    return axios.post(API_ORGANIZATIONS_USERS(namespace), { email })
      .then((response) => {
        this.getOrganizationUsers(namespace);
        this.getOrganizations();
        this.addUserToOrganizationAsync = handleAsyncSuccess(response);
      })
      .catch((error) => {
        this.addUserToOrganizationAsync = handleAsyncError(error);
      });
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
          const { response: { status } } = error;
          this.userFetchAsync = handleAsyncError(error);
          if (status === HTTP_CODE_429_TOO_MANY_REQUESTS || status === HTTP_CODE_503_SERVICE_UNAVAILABLE) {
            throw new Error();
          }
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

  checkIfAccountActive = async () => {
    try {
      const { status } = await axios.get(API_NAMESPACE_SETUP_STEPS);
      if (status === HTTP_CODE_202_ACCEPTED) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
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
    const objKey = startTime.format(DEVICE_ACTIVATED_DATE_DATA_FORMAT);
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
    const objKey = startTime.format(DEVICE_ACTIVATED_DATE_DATA_FORMAT);
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
      const objKey = startTimeTmp.format(USAGE_DATE_DATA_FORMAT);
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
