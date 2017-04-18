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
    @observable groupsCreateAsync = {};
    @observable groupsRenameAsync = {};
    @observable groupsAddDeviceAsync = {};
    @observable groupsRemoveDeviceAsync = {};
    @observable groups = [];
    @observable preparedGroups = {};
    
    constructor() {
        resetAsync(this.groupsFetchAsync);
        resetAsync(this.groupsCreateAsync);
        resetAsync(this.groupsRenameAsync);
        resetAsync(this.groupsAddDeviceAsync);
        resetAsync(this.groupsRemoveDeviceAsync);
    }

    fetchGroups() {
        resetAsync(this.groupsFetchAsync, true);
        return axios.get(API_GROUPS_FETCH)
            .then(function (response) {
                let groups = response.data;
                if(groups.length) {
                    let after = _.after(groups.length, () => {
                        this.groups = groups;
                        this._prepareGroups();
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
                    this.groups = groups;
                    this.groupsFetchAsync = handleAsyncSuccess(response);
                }
            }.bind(this))
            .catch(function (error) {
                this.groupsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    createGroup(name) {
        resetAsync(this.groupsCreateAsync, true);
        return axios.post(API_GROUPS_CREATE + '?groupName=' + name)
            .then(function (response) {
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
        resetAsync(this.groupsCreateAsync);
        resetAsync(this.groupsRenameAsync);
        resetAsync(this.groupsAddDeviceAsync);
        resetAsync(this.groupsRemoveDeviceAsync);
        this.groups = [];
        this.preparedGroups = {};
    }

    _prepareGroups() {
        let groups = this.groups;
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

    _getGroup(id) {
        return _.findWhere(this.groups, {id: id});
    }

    _updateGroupData(id, data) {
        let group = this._getGroup(id);
        _.each(data, (value, attr) => {
            group[attr] = value;
        });
    }

    @computed get groupsCount() {
        return this.groups.length;
    }
}