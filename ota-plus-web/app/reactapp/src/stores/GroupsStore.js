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
    @observable groupsWizardFetchAsync = {};
    @observable groupsWizardLoadMoreFetchAsync = {};
    @observable groupsCreateAsync = {};
    @observable groupsRenameAsync = {};
    @observable groupsAddDeviceAsync = {};
    @observable groupsRemoveDeviceAsync = {};
    @observable groups = [];
    @observable wizardGroups = [];
    @observable filteredGroups = [];
    @observable preparedGroups = {};
    @observable preparedWizardGroups = {};
    @observable latestCreatedGroupId = null;
    @observable selectedGroup = {
        type: 'artificial',
        name: 'all'
    };

    @observable groupsCurrentPage = 0;
    @observable groupsTotalCount = null;
    @observable groupsLimit = 10;

    @observable activeFleet = null;
    @observable shouldLoadMore = true;

    @observable groupsWizardOffset = 0;
    @observable hasMoreGroups = 0;
    @observable groupsWizardLimit = 10;

    constructor() {
        resetAsync(this.groupsFetchAsync);
        resetAsync(this.groupsWizardFetchAsync);
        resetAsync(this.groupsWizardLoadMoreFetchAsync
            );
        resetAsync(this.groupsCreateAsync);
        resetAsync(this.groupsRenameAsync);
        resetAsync(this.groupsAddDeviceAsync);
        resetAsync(this.groupsRemoveDeviceAsync);
    }

    selectDefaultGroup() {
        this.selectedGroup = {
            type: 'artificial',
            name: 'all'
        };   
    }

    _filterGroups(fleetId) {
        this.filteredGroups = _.filter(this.groups, group => group.fleet_id === fleetId);
        // In order to prevent infinite scroll
        this.shouldLoadMore = false;
        this._prepareGroups(this.filteredGroups);
    }

    fetchGroups() {
        resetAsync(this.groupsFetchAsync, true);
        return axios.get(API_GROUPS_FETCH + '?limit=' + this.groupsLimit + '&offset=' + this.groupsCurrentPage * this.groupsLimit)
            .then(function (response) {
                let groups = response.data.values;
                if(groups.length) {
                    let after = _.after(groups.length, () => {
                        this.groups = _.uniq(this.groups.concat(groups), group => group.id);
                        this._prepareGroups(this.groups);
                        this._prepareGroupsWithFleets();
                        this.groupsFetchAsync = handleAsyncSuccess(response);
                    }, this);
                    _.each(groups, (group, index) => {
                        axios.get(API_GROUPS_DEVICES_FETCH + '/' + group.id + '/devices')
                            .then(function(resp) {
                                group.devices = resp.data;
                                after();
                            })
                            .catch(function() {
                                after();
                            });
                    });
                } else {
                    this.groups = _.uniq(this.groups.concat(groups), group => group.id);
                    this.groupsFetchAsync = handleAsyncSuccess(response);
                }
                this.groupsCurrentPage++;
                this.groupsTotalCount = response.data.total;
            }.bind(this))
            .catch(function (error) {
                this.groupsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchWizardGroups() {
        resetAsync(this.groupsWizardFetchAsync, true);

        this.groupsWizardOffset = 0;

        return axios.get(API_GROUPS_FETCH + '?limit=' + this.groupsWizardLimit + '&offset=' + this.groupsWizardOffset)
            .then(function (response) {
                let groups = response.data.values;
                if(groups.length) {
                    let after = _.after(groups.length, () => {
                        this.wizardGroups = groups;
                        this._prepareWizardGroups();
                        this.groupsWizardFetchAsync = handleAsyncSuccess(response);
                    }, this);
                    _.each(groups, (group, index) => {
                        axios.get(API_GROUPS_DEVICES_FETCH + '/' + group.id + '/devices')
                            .then(function(resp) {
                                group.devices = resp.data;
                                after();
                            })
                            .catch(function() {
                                after();
                            });
                    });
                } else {
                    this.wizardGroups = groups;
                    this.groupsWizardFetchAsync = handleAsyncSuccess(response);
                }
                this.hasMoreGroups = this.groupsWizardOffset < response.data.total;
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
                if(groups.length) {
                    let after = _.after(groups.length, () => {
                        this.wizardGroups = _.uniq(this.wizardGroups.concat(groups), group => group.id);
                        this._prepareWizardGroups();
                        this.groupsWizardLoadMoreFetchAsync = handleAsyncSuccess(response);
                    }, this);
                    _.each(groups, (group, index) => {
                        axios.get(API_GROUPS_DEVICES_FETCH + '/' + group.id + '/devices')
                            .then(function(resp) {
                                group.devices = resp.data;
                                after();
                            })
                            .catch(function() {
                                after();
                            });
                    });
                } else {
                    this.wizardGroups = _.uniq(this.wizardGroups.concat(groups), group => group.id);
                    this.groupsWizardLoadMoreFetchAsync = handleAsyncSuccess(response);
                }
                this.groupsWizardOffset = response.data.offset;
                this.hasMoreGroups = this.groupsWizardOffset < response.data.total;
            }.bind(this))
            .catch(function (error) {
                this.groupsWizardLoadMoreFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    createGroup(name) {
        resetAsync(this.groupsCreateAsync, true);
        return axios.post(API_GROUPS_CREATE + '?groupName=' + name)
            .then(function (response) {
                this.latestCreatedGroupId = response.data;
                this.groupsCurrentPage = 0;
                this.fetchGroups();
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
                this._updateGroupData(id, {groupName: name});
                this.selectedGroup = {
                    type: 'real',
                    name: name
                };
                if(this.activeFleet) {
                    this._prepareGroupsWithFleets();
                    this._filterGroups(this.activeFleet.id);
                } else {
                    this._prepareGroups(this.groups);
                }
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
        return axios.get(API_GROUPS_DEVICES_FETCH + '/' + groupId + '/devices')
            .then(function(resp) {
                const foundGroup = this._getGroup(groupId);
                if(foundGroup)
                    foundGroup.devices = resp.data;
            }.bind(this))
            .catch(function() {
            });
    }

    _reset() {
        resetAsync(this.groupsFetchAsync);
        resetAsync(this.groupsWizardFetchAsync);
        resetAsync(this.groupsWizardLoadMoreFetchAsync);
        resetAsync(this.groupsCreateAsync);
        resetAsync(this.groupsRenameAsync);
        resetAsync(this.groupsAddDeviceAsync);
        resetAsync(this.groupsRemoveDeviceAsync);
        this.groups = [];
        this.wizardGroups = [];
        this.filteredGroups = [];
        this.preparedGroups = {};
        this.preparedWizardGroups = {};
        this.latestCreatedGroupId = null;
        
        this.groupsCurrentPage = 0;
        this.groupsTotalCount = 0;

        this.groupsWizardOffset = 0;
        this.hasMoreGroups = false;

        this.shouldLoadMore = true;
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
            if(typeof preparedGroups[firstLetter] == 'undefined' || !preparedGroups[firstLetter] instanceof Array) {
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
            if(typeof preparedGroups[firstLetter] == 'undefined' || !preparedGroups[firstLetter] instanceof Array) {
                preparedGroups[firstLetter] = [];
            }
            preparedGroups[firstLetter].push(group);
        });
        this.preparedWizardGroups = preparedGroups;
    }

    _prepareGroupsWithFleets() {
        _.each(this.groups, group => {
            let groupLetters = group.groupName.substring(0, 3);
            switch(groupLetters) {
                case 'H34':
                    group.fleet_id = 'sedan';
                    break;
                case 'H35':
                    group.fleet_id = 'hatchback';
                    break;
                case 'H5S':
                    group.fleet_id = 'sport';
                    break;
                case 'H6W':
                    group.fleet_id = 'sw';
                    break;
                default:
                    group.fleet_id = 'eh0';
                    break;
            }
        });
    }

    _getGroup(id) {
        return _.findWhere(this.groups, {id: id});
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