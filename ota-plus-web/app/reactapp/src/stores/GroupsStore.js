/** @format */

import { observable, computed } from 'mobx';
import axios from 'axios';
import _ from 'lodash';
import { API_GROUPS_FETCH, API_GROUPS_CREATE, API_GROUPS_RENAME, API_GROUPS_DEVICES_FETCH, API_GROUPS_ADD_DEVICE, API_GROUPS_REMOVE_DEVICE, API_DEVICES_SEARCH } from '../config';
import { resetAsync, handleAsyncSuccess, handleAsyncError } from '../utils/Common';

export default class GroupsStore {
  @observable groupsFetchAsync = {};
  @observable groupsLoadMoreFetchAsync = {};
  @observable groupsCreateFetchAsync = {};
  @observable groupsWizardFetchAsync = {};
  @observable groupsWizardLoadMoreFetchAsync = {};
  @observable expressionForSelectedGroupFetchAsync = {};
  @observable groupsCreateAsync = {};
  @observable groupsRenameAsync = {};
  @observable groupsAddDeviceAsync = {};
  @observable groupsRemoveDeviceAsync = {};
  @observable groupsFetchDevicesAsync = {};
  @observable numberOfDevicesByExpressionAsync = {};
  @observable smartGroups = [];
  @observable classicGroups = [];
  @observable groups = [];
  @observable wizardGroups = [];
  @observable filteredGroups = [];
  @observable preparedGroups = {};
  @observable preparedWizardGroups = {};
  @observable latestCreatedGroupId = null;
  @observable numberOfDevicesByExpression = 0;
  @observable selectedGroup = {
    type: 'artificial',
    groupName: 'all',
  };

  @observable groupsLimit = 10;

  @observable groupsOffset = 0;
  @observable hasMoreGroups = false;

  @observable groupsWizardOffset = 0;
  @observable groupsWizardLimit = 10;
  @observable hasMoreWizardGroups = false;

  constructor() {
    resetAsync(this.groupsFetchAsync);
    resetAsync(this.groupsLoadMoreFetchAsync);
    resetAsync(this.groupsCreateFetchAsync);
    resetAsync(this.groupsWizardFetchAsync);
    resetAsync(this.groupsWizardLoadMoreFetchAsync);
    resetAsync(this.expressionForSelectedGroupFetchAsync);
    resetAsync(this.groupsCreateAsync);
    resetAsync(this.groupsRenameAsync);
    resetAsync(this.groupsAddDeviceAsync);
    resetAsync(this.groupsRemoveDeviceAsync);
    resetAsync(this.groupsFetchDevicesAsync);
  }

  @computed get groupsCount() {
    return this.groups.length;
  }

  selectDefaultGroup() {
    this.selectedGroup = {
      type: 'artificial',
      groupName: 'all',
    };
  }

  fetchGroups(async = 'groupsFetchAsync') {
    resetAsync(this[async], true);
    this.groupsOffset = 0;

    return axios
      .get(`${API_GROUPS_FETCH}?limit=${this.groupsLimit}&offset=${this.groupsOffset}`)
      .then(response => {
        const groups = response.data.values;
        if (groups.length) {
          const after = _.after(
            groups.length,
            () => {
              this.groups = groups;
              this.classicGroups = _.filter(groups, group => group.groupType === 'static');
              this.smartGroups = _.filter(groups, group => group.groupType === 'dynamic');
              this._prepareGroups(this.groups);
              this[async] = handleAsyncSuccess(response);
            },
            this,
          );
          _.each(groups, group => {
            axios
              .get(`${API_GROUPS_DEVICES_FETCH}/${group.id}/devices`)
              .then(resp => {
                group.devices = resp.data;
                after();
              })
              .catch(() => {
                after();
              });
          });
        } else {
          this.groups = groups;
          this[async] = handleAsyncSuccess(response);
        }
        this.hasMoreGroups = this.groupsOffset < response.data.total;
      })
      .catch(error => {
        this[async] = handleAsyncError(error);
      });
  }

  loadMoreGroups() {
    resetAsync(this.groupsLoadMoreFetchAsync, true);
    return axios
      .get(`${API_GROUPS_FETCH}?limit=${this.groupsLimit}&offset=${this.groupsOffset + this.groupsLimit}`)
      .then(response => {
        const groups = response.data.values;
        if (groups.length) {
          const after = _.after(
            groups.length,
            () => {
              this.groups = _.uniq(this.groups.concat(groups), group => group.id);
              this.classicGroups = _.uniq(_.filter(this.classicGroups.concat(groups), group => group.groupType === 'static'), group => group.id);
              this.smartGroups = _.uniq(_.filter(this.smartGroups.concat(groups), group => group.groupType === 'dynamic'), group => group.id);
              this._prepareGroups(this.groups);
              this.groupsLoadMoreFetchAsync = handleAsyncSuccess(response);
            },
            this,
          );
          _.each(groups, group => {
            axios
              .get(`${API_GROUPS_DEVICES_FETCH}/${group.id}/devices`)
              .then(resp => {
                group.devices = resp.data;
                after();
              })
              .catch(() => {
                after();
              });
          });
        } else {
          this.groups = _.uniq(this.groups.concat(groups), group => group.id);
          this.groupsLoadMoreFetchAsync = handleAsyncSuccess(response);
        }
        this.groupsOffset = response.data.offset;
        this.hasMoreGroups = this.groupsOffset < response.data.total;
      })
      .catch(error => {
        this.groupsLoadMoreFetchAsync = handleAsyncError(error);
      });
  }

  fetchWizardGroups() {
    resetAsync(this.groupsWizardFetchAsync, true);

    this.groupsWizardOffset = 0;

    return axios
      .get(`${API_GROUPS_FETCH}?limit=${this.groupsWizardLimit}&offset=${this.groupsWizardOffset}`)
      .then(response => {
        const groups = response.data.values;
        if (groups.length) {
          const after = _.after(
            groups.length,
            () => {
              this.wizardGroups = groups;
              this._prepareWizardGroups();
              this.groupsWizardFetchAsync = handleAsyncSuccess(response);
            },
            this,
          );
          _.each(groups, group => {
            axios
              .get(`${API_GROUPS_DEVICES_FETCH}/${group.id}/devices`)
              .then(resp => {
                group.devices = resp.data;
                after();
              })
              .catch(() => {
                after();
              });
          });
        } else {
          this.wizardGroups = groups;
          this.groupsWizardFetchAsync = handleAsyncSuccess(response);
        }
        this.hasMoreWizardGroups = this.groupsWizardOffset < response.data.total;
      })
      .catch(error => {
        this.groupsWizardFetchAsync = handleAsyncError(error);
      });
  }

  loadMoreWizardGroups() {
    resetAsync(this.groupsWizardLoadMoreFetchAsync, true);
    return axios
      .get(`${API_GROUPS_FETCH}?limit=${this.groupsWizardLimit}&offset=${this.groupsWizardOffset + this.groupsWizardLimit}`)
      .then(response => {
        const groups = response.data.values;
        if (groups.length) {
          const after = _.after(
            groups.length,
            () => {
              this.wizardGroups = _.uniq(this.wizardGroups.concat(groups), group => group.id);
              this._prepareWizardGroups();
              this.groupsWizardLoadMoreFetchAsync = handleAsyncSuccess(response);
            },
            this,
          );
          _.each(groups, group => {
            axios
              .get(`${API_GROUPS_DEVICES_FETCH}/${group.id}/devices`)
              .then(resp => {
                group.devices = resp.data;
                after();
              })
              .catch(() => {
                after();
              });
          });
        } else {
          this.wizardGroups = _.uniq(this.wizardGroups.concat(groups), group => group.id);
          this.groupsWizardLoadMoreFetchAsync = handleAsyncSuccess(response);
        }
        this.groupsWizardOffset = response.data.offset;
        this.hasMoreWizardGroups = this.groupsWizardOffset < response.data.total;
      })
      .catch(error => {
        this.groupsWizardLoadMoreFetchAsync = handleAsyncError(error);
      });
  }

  createGroup(data) {
    resetAsync(this.groupsCreateAsync, true);
    return axios
      .post(API_GROUPS_CREATE, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        this.latestCreatedGroupId = response.data;
        this.fetchGroups('groupsCreateFetchAsync');
        this.groupsCreateAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.groupsCreateAsync = handleAsyncError(error);
      });
  }

  renameGroup(id, name) {
    resetAsync(this.groupsRenameAsync, true);
    return axios
      .put(`${API_GROUPS_RENAME}/${id}/rename?groupName=${name}`)
      .then(response => {
        this.groupsRenameAsync = handleAsyncSuccess(response);
        this._updateGroupData(id, { groupName: name });
        this.selectedGroup = {
          type: 'real',
          groupName: name,
        };

        this._prepareGroups(this.groups);
      })
      .catch(error => {
        this.groupsRenameAsync = handleAsyncError(error);
      });
  }

  addDeviceToGroup(groupId, deviceId) {
    resetAsync(this.groupsAddDeviceAsync, true);
    return axios
      .post(`${API_GROUPS_ADD_DEVICE}/${groupId}/devices/${deviceId}`)
      .then(response => {
        this.groupsAddDeviceAsync = handleAsyncSuccess(response);
        this.fetchDevicesForGroup(groupId);
      })
      .catch(error => {
        this.groupsAddDeviceAsync = handleAsyncError(error);
      });
  }

  removeDeviceFromGroup(groupId, deviceId) {
    resetAsync(this.groupsRemoveDeviceAsync, true);
    return axios
      .delete(`${API_GROUPS_REMOVE_DEVICE}/${groupId}/devices/${deviceId}`)
      .then(response => {
        this.groupsRemoveDeviceAsync = handleAsyncSuccess(response);
        this.fetchDevicesForGroup(groupId);
      })
      .catch(error => {
        this.groupsRemoveDeviceAsync = handleAsyncError(error);
      });
  }

  //to check - are this two functions below necessary? cannot be one?
  fetchDevicesForGroup(groupId) {
    resetAsync(this.groupsFetchDevicesAsync, true);
    return axios
      .get(`${API_GROUPS_DEVICES_FETCH}/${groupId}/devices`)
      .then(response => {
        const foundGroup = this._getGroup(groupId);
        if (foundGroup) {
          foundGroup.devices = response.data;
        }
        this.groupsFetchDevicesAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.groupsFetchDevicesAsync = handleAsyncError(error);
      });
  }

  fetchDevicesForSelectedGroup(groupId) {
    return axios
      .get(`${API_GROUPS_DEVICES_FETCH}/${groupId}/devices`)
      .then(resp => {
        this.selectedGroup.devices = resp.data;
      })
      .catch(() => {});
  }

  //for smartGroup creation wizard
  fetchNumberOfDevicesByExpression(expression, async = 'numberOfDevicesByExpressionAsync') {
    return axios
      .get(API_DEVICES_SEARCH + '/count?expression=' + expression)
      .then(response => {
        this.numberOfDevicesByExpression = response.data;
        this[async] = handleAsyncSuccess(response);
      })
      .catch(error => {
        this[async] = handleAsyncError(error);
      });
  }

  fetchExpressionForSelectedGroup(groupId) {
    resetAsync(this.expressionForSelectedGroupFetchAsync, true);
    return axios
      .get(`${API_GROUPS_DEVICES_FETCH}/${groupId}`)
      .then(response => {
        this.selectedGroup.expression = response.data.expression;
        this.expressionForSelectedGroupFetchAsync = handleAsyncSuccess(response);
      })
      .catch(error => {
        this.expressionForSelectedGroupFetchAsync = handleAsyncError(error);
      });
  }

  _reset() {
    resetAsync(this.groupsFetchAsync);
    resetAsync(this.groupsLoadMoreFetchAsync);
    resetAsync(this.groupsCreateFetchAsync);
    resetAsync(this.groupsWizardFetchAsync);
    resetAsync(this.groupsWizardLoadMoreFetchAsync);
    resetAsync(this.expressionForSelectedGroupFetchAsync);

    resetAsync(this.groupsCreateAsync);
    resetAsync(this.groupsRenameAsync);
    resetAsync(this.groupsAddDeviceAsync);
    resetAsync(this.groupsRemoveDeviceAsync);
    resetAsync(this.groupsFetchDevicesAsync);
    resetAsync(this.numberOfDevicesByExpressionAsync);

    this.smartGroups = [];
    this.classicGroups = [];
    this.groups = [];
    this.wizardGroups = [];
    this.filteredGroups = [];
    this.preparedGroups = {};
    this.preparedWizardGroups = {};
    this.latestCreatedGroupId = null;

    this.groupsOffset = 0;
    this.hasMoreGroups = false;

    this.groupsWizardOffset = 0;
    this.hasMoreWizardGroups = false;
  }

  _prepareGroups(groups) {
    const preparedGroups = {};
    groups
      .slice()
      .sort((a, b) => {
        const aName = a.groupName;
        const bName = b.groupName;
        return aName.charAt(0) % 1 === 0 && bName.charAt(0) % 1 !== 0 ? 1 : aName.localeCompare(bName);
      })
      .forEach(group => {
        const { groupName } = group;
        let firstLetter = groupName.charAt(0).toUpperCase();
        firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
        if (typeof preparedGroups[firstLetter] === 'undefined' || !(preparedGroups[firstLetter] instanceof Array)) {
          preparedGroups[firstLetter] = [];
        }
        preparedGroups[firstLetter].push(group);
      });
    this.preparedGroups = preparedGroups;
  }

  _prepareWizardGroups() {
    const groups = this.wizardGroups;
    const preparedGroups = {};
    groups
      .slice()
      .sort((a, b) => {
        const aName = a.groupName;
        const bName = b.groupName;
        return aName.charAt(0) % 1 === 0 && bName.charAt(0) % 1 !== 0 ? 1 : aName.localeCompare(bName);
      })
      .forEach(group => {
        const { groupName } = group;
        let firstLetter = groupName.charAt(0).toUpperCase();
        firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
        if (typeof preparedGroups[firstLetter] === 'undefined' || !(preparedGroups[firstLetter] instanceof Array)) {
          preparedGroups[firstLetter] = [];
        }
        preparedGroups[firstLetter].push(group);
      });
    this.preparedWizardGroups = preparedGroups;
  }

  _getGroup(id) {
    return _.find(this.groups, { id });
  }

  _updateGroupData(id, data) {
    const group = this._getGroup(id);
    _.each(data, (value, attr) => {
      group[attr] = value;
    });
  }

  _getGroupDevices(group) {
    return group.devices.values;
  }

  _getGroupDevicesCount(group) {
    return group.devices.total;
  }
}
