import { observable, computed } from 'mobx';
import axios from 'axios';
import {
    API_GROUPS_FETCH,
    API_GROUPS_CREATE,
    API_GROUPS_RENAME,
    API_GROUPS_DEVICES_FETCH,
    API_GROUPS_ADD_DEVICE,
    API_GROUPS_REMOVE_DEVICE,
} from '../config';
import {
    resetAsync,
    handleAsyncSuccess,
    handleAsyncError
} from '../utils/Common';
import _ from 'underscore';

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
    @observable smartGroups = [];
    @observable classicGroups = [];
    @observable groups = [];
    @observable wizardGroups = [];
    @observable filteredGroups = [];
    @observable preparedGroups = {};
    @observable preparedWizardGroups = {};
    @observable latestCreatedGroupId = null;
    @observable selectedGroup = {
        type: 'artificial',
        groupName: 'all'
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

    selectDefaultGroup() {
        this.selectedGroup = {
            type: 'artificial',
            groupName: 'all'
        };
    }


    fetchGroups(async = 'groupsFetchAsync') {
        resetAsync(this[async], true);
        this.groupsOffset = 0;

        return axios.get(API_GROUPS_FETCH + '?limit=' + this.groupsLimit + '&offset=' + this.groupsOffset)
            .then(function (response) {
                let groups = response.data.values;
                if (groups.length) {
                    let after = _.after(groups.length, () => {
                        this.groups = groups;
                        this.classicGroups = _.filter(groups, group => group.groupType === 'static');
                        this.smartGroups = _.filter(groups, group => group.groupType === 'dynamic');
                        this._prepareGroups(this.groups);
                        this[async] = handleAsyncSuccess(response);
                    }, this);
                    _.each(groups, (group, index) => {
                        axios.get(API_GROUPS_DEVICES_FETCH + '/' + group.id + '/devices')
                            .then(function (resp) {
                                group.devices = resp.data;
                                after();
                            })
                            .catch(function () {
                                after();
                            });
                    });
                } else {
                    this.groups = groups;
                    this[async] = handleAsyncSuccess(response);
                }
                this.hasMoreGroups = this.groupsOffset < response.data.total;
            }.bind(this))
            .catch(function (error) {
                this[async] = handleAsyncError(error);
            }.bind(this));
    }



    loadMoreGroups() {
        resetAsync(this.groupsLoadMoreFetchAsync, true);
        return axios.get(API_GROUPS_FETCH + '?limit=' + this.groupsLimit + '&offset=' + (this.groupsOffset + this.groupsLimit))
            .then(function (response) {
                let groups = response.data.values;
                if (groups.length) {
                    let after = _.after(groups.length, () => {
                        this.groups = _.uniq(this.groups.concat(groups), group => group.id);
                        this.classicGroups = _.uniq(_.filter(this.classicGroups.concat(groups), group => group.groupType === 'static'), group => group.id);
                        this.smartGroups = _.uniq(_.filter(this.smartGroups.concat(groups), group => group.groupType === 'dynamic'), group => group.id);
                        this._prepareGroups(this.groups);
                        this.groupsLoadMoreFetchAsync = handleAsyncSuccess(response);
                    }, this);
                    _.each(groups, (group, index) => {
                        axios.get(API_GROUPS_DEVICES_FETCH + '/' + group.id + '/devices')
                            .then(function (resp) {
                                group.devices = resp.data;
                                after();
                            })
                            .catch(function () {
                                after();
                            });
                    });
                } else {
                    this.groups = _.uniq(this.groups.concat(groups), group => group.id);
                    this.groupsLoadMoreFetchAsync = handleAsyncSuccess(response);
                }
                this.groupsOffset = response.data.offset;
                this.hasMoreGroups = this.groupsOffset < response.data.total;
            }.bind(this))
            .catch(function (error) {
                this.groupsLoadMoreFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchWizardGroups() {
        resetAsync(this.groupsWizardFetchAsync, true);

        this.groupsWizardOffset = 0;

        return axios.get(API_GROUPS_FETCH + '?limit=' + this.groupsWizardLimit + '&offset=' + this.groupsWizardOffset)
            .then(function (response) {
                let groups = response.data.values;
                if (groups.length) {
                    let after = _.after(groups.length, () => {
                        this.wizardGroups = groups;
                        this._prepareWizardGroups();
                        this.groupsWizardFetchAsync = handleAsyncSuccess(response);
                    }, this);
                    _.each(groups, (group, index) => {
                        axios.get(API_GROUPS_DEVICES_FETCH + '/' + group.id + '/devices')
                            .then(function (resp) {
                                group.devices = resp.data;
                                after();
                            })
                            .catch(function () {
                                after();
                            });
                    });
                } else {
                    this.wizardGroups = groups;
                    this.groupsWizardFetchAsync = handleAsyncSuccess(response);
                }
                this.hasMoreWizardGroups = this.groupsWizardOffset < response.data.total;
            }.bind(this))
            .catch(function (error) {
                this.groupsWizardFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    loadMoreWizardGroups() {
        resetAsync(this.groupsWizardLoadMoreFetchAsync, true);
        return axios.get(API_GROUPS_FETCH + '?limit=' + this.groupsWizardLimit + '&offset=' + (this.groupsWizardOffset + this.groupsWizardLimit))
            .then(function (response) {
                let groups = response.data.values;
                if (groups.length) {
                    let after = _.after(groups.length, () => {
                        this.wizardGroups = _.uniq(this.wizardGroups.concat(groups), group => group.id);
                        this._prepareWizardGroups();
                        this.groupsWizardLoadMoreFetchAsync = handleAsyncSuccess(response);
                    }, this);
                    _.each(groups, (group, index) => {
                        axios.get(API_GROUPS_DEVICES_FETCH + '/' + group.id + '/devices')
                            .then(function (resp) {
                                group.devices = resp.data;
                                after();
                            })
                            .catch(function () {
                                after();
                            });
                    });
                } else {
                    this.wizardGroups = _.uniq(this.wizardGroups.concat(groups), group => group.id);
                    this.groupsWizardLoadMoreFetchAsync = handleAsyncSuccess(response);
                }
                this.groupsWizardOffset = response.data.offset;
                this.hasMoreWizardGroups = this.groupsWizardOffset < response.data.total;
            }.bind(this))
            .catch(function (error) {
                this.groupsWizardLoadMoreFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    createGroup(data) {
        resetAsync(this.groupsCreateAsync, true);
        return axios.post(API_GROUPS_CREATE, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                this.latestCreatedGroupId = response.data;
                this.fetchGroups('groupsCreateFetchAsync');
                this.groupsCreateAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.groupsCreateAsync = handleAsyncError(error);
            }.bind(this));
    }

    renameGroup(id, name) {
        resetAsync(this.groupsRenameAsync, true);
        return axios.put(API_GROUPS_RENAME + '/' + id + '/rename?groupName=' + name)
            .then(function (response) {
                this.groupsRenameAsync = handleAsyncSuccess(response);
                this._updateGroupData(id, { groupName: name });
                this.selectedGroup = {
                    type: 'real',
                    groupName: name
                };

                this._prepareGroups(this.groups);

            }.bind(this))
            .catch(function (error) {
                this.groupsRenameAsync = handleAsyncError(error);
            }.bind(this));
    }

    addDeviceToGroup(groupId, deviceId) {
        resetAsync(this.groupsAddDeviceAsync, true);
        return axios.post(API_GROUPS_ADD_DEVICE + '/' + groupId + '/devices/' + deviceId)
            .then(function (response) {
                this.groupsAddDeviceAsync = handleAsyncSuccess(response);
                this.fetchDevicesForGroup(groupId);
            }.bind(this))
            .catch(function (error) {
                this.groupsAddDeviceAsync = handleAsyncError(error);
            }.bind(this));
    }

    removeDeviceFromGroup(groupId, deviceId) {
        resetAsync(this.groupsRemoveDeviceAsync, true);
        return axios.delete(API_GROUPS_REMOVE_DEVICE + '/' + groupId + '/devices/' + deviceId)
            .then(function (response) {
                this.groupsRemoveDeviceAsync = handleAsyncSuccess(response);
                this.fetchDevicesForGroup(groupId);
            }.bind(this))
            .catch(function (error) {
                this.groupsRemoveDeviceAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchDevicesForGroup(groupId) {
        resetAsync(this.groupsFetchDevicesAsync, true);
        return axios.get(API_GROUPS_DEVICES_FETCH + '/' + groupId + '/devices')
            .then(function (resp) {
                const foundGroup = this._getGroup(groupId);
                if (foundGroup) {
                    foundGroup.devices = resp.data;
                }
                this.groupsFetchDevicesAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.groupsFetchDevicesAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchDevicesForSelectedGroup(groupId) {
        return axios.get(API_GROUPS_DEVICES_FETCH + '/' + groupId + '/devices')
            .then(function (resp) {
                this.selectedGroup.devices = resp.data;
            }.bind(this))
            .catch(function () {
            });
    }

    fetchExpressionForSelectedGroup(groupId) {
        resetAsync(this.expressionForSelectedGroupFetchAsync, true);
        return axios.get(API_GROUPS_DEVICES_FETCH + '/' + groupId)
            .then((response) => {
                this.selectedGroup.expression = response.data.expression
                this.expressionForSelectedGroupFetchAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
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
        let preparedGroups = {};
        groups.sort((a, b) => {
            let aName = a.groupName;
            let bName = b.groupName;
            return (aName.charAt(0) % 1 === 0 && bName.charAt(0) % 1 !== 0) ? 1 : aName.localeCompare(bName);
        }).forEach((group) => {
            let groupName = group.groupName;
            let firstLetter = groupName.charAt(0).toUpperCase();
            firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
            if (typeof preparedGroups[firstLetter] == 'undefined' || !preparedGroups[firstLetter] instanceof Array) {
                preparedGroups[firstLetter] = [];
            }
            preparedGroups[firstLetter].push(group);
        });
        this.preparedGroups = preparedGroups;
    }

    _prepareWizardGroups() {
        const groups = this.wizardGroups;
        let preparedGroups = {};
        groups.sort((a, b) => {
            let aName = a.groupName;
            let bName = b.groupName;
            return (aName.charAt(0) % 1 === 0 && bName.charAt(0) % 1 !== 0) ? 1 : aName.localeCompare(bName);
        }).forEach((group) => {
            let groupName = group.groupName;
            let firstLetter = groupName.charAt(0).toUpperCase();
            firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
            if (typeof preparedGroups[firstLetter] == 'undefined' || !preparedGroups[firstLetter] instanceof Array) {
                preparedGroups[firstLetter] = [];
            }
            preparedGroups[firstLetter].push(group);
        });
        this.preparedWizardGroups = preparedGroups;
    }



    _getGroup(id) {
        return _.findWhere(this.groups, { id: id });
    }

    _updateGroupData(id, data) {
        let group = this._getGroup(id);
        _.each(data, (value, attr) => {
            group[attr] = value;
        });
    }

    _getGroupDevices(group) {
        return group.devices.values;
    }

    @computed get groupsCount() {
        return this.groups.length;
    }
}