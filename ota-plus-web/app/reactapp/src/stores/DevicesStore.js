import {observable, computed} from 'mobx';
import axios from 'axios';
import {
    API_DEVICES_SEARCH,
    API_DEVICES_DEVICE_DETAILS,
    API_DEVICES_DIRECTOR_DEVICE,
    API_DEVICES_CREATE,
    API_DEVICES_RENAME,
    API_DEVICES_UPDATES_LOGS,
    API_GET_MULTI_TARGET_UPDATE_INDENTIFIER,
    API_CREATE_MULTI_TARGET_UPDATE,
    API_FETCH_MULTI_TARGET_UPDATES
} from '../config';
import {
    resetAsync,
    handleAsyncSuccess,
    handleAsyncError
} from '../utils/Common';
import _ from 'underscore';

export default class DevicesStore {

    @observable devicesFetchAsync = {};
    @observable devicesUngroupedFetchAsync = {};
    @observable devicesInitialFetchAsync = {};
    @observable devicesRememberedFetchAsync = {};
    @observable devicesFetchAfterDragAndDropAsync = {};
    @observable devicesFetchAfterGroupCreationAsync = {};
    @observable devicesOneFetchAsync = {};
    @observable devicesDirectorAttributesFetchAsync = {};
    @observable devicesCreateAsync = {};
    @observable devicesRenameAsync = {};
    @observable multiTargetUpdateCreateAsync = {};
    @observable multiTargetUpdatesFetchAsync = {};
    @observable initialDevices = [];
    @observable devices = [];
    @observable devicesInitialTotalCount = null;
    @observable ungroupedDevicesInitialTotalCount = null;
    @observable devicesTotalCount = null;
    @observable devicesCurrentPage = 0;
    @observable preparedDevices = [];
    @observable devicesFilter = '';
    @observable devicesGroupFilter = null;
    @observable devicesSort = 'asc';
    @observable device = {};
    @observable deviceQueue = [];
    @observable deviceHistory = [];
    @observable deviceUpdatesLogs = [];
    @observable onlineDevices = [];
    @observable stepsHistory = [];
    @observable multiTargetUpdates = {};

    constructor() {
        resetAsync(this.devicesFetchAsync);
        resetAsync(this.devicesUngroupedFetchAsync);
        resetAsync(this.devicesInitialFetchAsync);
        resetAsync(this.devicesRememberedFetchAsync);
        resetAsync(this.devicesFetchAfterDragAndDropAsync);
        resetAsync(this.devicesFetchAfterGroupCreationAsync);
        resetAsync(this.devicesOneFetchAsync);
        resetAsync(this.devicesDirectorAttributesFetchAsync);
        resetAsync(this.devicesCreateAsync);
        resetAsync(this.devicesRenameAsync);
        resetAsync(this.multiTargetUpdateCreateAsync);
        resetAsync(this.multiTargetUpdatesFetchAsync);
        this.devicesLimit = 30;
    }

    addStepToHistory(step) {
        this.stepsHistory.push(step);
    }

    clearStepsHistory() {
        this.stepsHistory = [];
    }

    createMultiTargetUpdate(data, id) {
        let updateObject = this._prepareUpdateObject(data);
        resetAsync(this.multiTargetUpdateCreateAsync, true);
        return axios.post(API_GET_MULTI_TARGET_UPDATE_INDENTIFIER, updateObject)
            .then((response) => {
                let updateIdentifier = response.data;
                let status = null;
                if(updateIdentifier.length) {
                    let after = _.after(status === 'success', () => {
                        this.fetchMultiTargetUpdates(id);
                        this.multiTargetUpdateCreateAsync = handleAsyncSuccess(response);
                    }, this);
                    axios.put(API_CREATE_MULTI_TARGET_UPDATE + '/' + id + '/multi_target_update/' + updateIdentifier)
                        .then(function(multiTargetResponse) {
                            status = 'success';
                            after();
                        })
                        .catch(function() {
                            status = 'error';
                            after();
                        });
                }
            })
            .catch((error) => {
                this.multiTargetUpdateCreateAsync = handleAsyncError(error);
            });
    }

    fetchMultiTargetUpdates(id) {
        resetAsync(this.multiTargetUpdatesFetchAsync, true);
        return axios.get(API_FETCH_MULTI_TARGET_UPDATES + '/' + id + '/queue')
            .then((response) => {
                this.multiTargetUpdates[id] = response.data;
                this.multiTargetUpdatesFetchAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.multiTargetUpdatesFetchAsync = handleAsyncError(error);
            });
    }

    _prepareUpdateObject(data) {
        return {
            targets: {
                [data.hardwareId]: {
                    to: {
                        target: data.target,
                        checksum: {
                            method: "sha256",
                            hash: data.hash
                        },
                        targetLength: data.target.length
                    }
                }
            }
        }
    }

    fetchInitialDevices() {
        resetAsync(this.devicesInitialFetchAsync, true);
        let apiAddress = `${API_DEVICES_SEARCH}`;
        return axios.get(apiAddress)
            .then((response) => {
                this.initialDevices = response.data.values;
                this._countOnlineDevices();
                this.devicesInitialFetchAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.devicesInitialFetchAsync = handleAsyncError(error);
            });
    }

    fetchDevices(filter = '', groupId) {
        resetAsync(this.devicesFetchAsync, true);
        if (this.devicesFilter !== filter || this.devicesGroupFilter !== groupId) {
            this.devicesTotalCount = null;
            this.devicesCurrentPage = 0;
            this.devices = [];
            this.preparedDevices = [];
        }
        this.devicesFilter = filter;
        this.devicesGroupFilter = groupId;
        let apiAddress = `${API_DEVICES_SEARCH}?regex=${filter}&limit=${this.devicesLimit}&offset=${this.devicesCurrentPage * this.devicesLimit}`;
        if (groupId && groupId === 'ungrouped')
            apiAddress += `&ungrouped=true`;
        else if (groupId)
            apiAddress += `&groupId=${groupId}`;
        return axios.get(apiAddress)
            .then((response) => {
                this.devices = _.uniq(this.devices.concat(response.data.values), device => device.uuid);
                this._prepareDevices();

                if (this.devicesInitialTotalCount === null && groupId !== 'ungrouped') {
                    this.devicesInitialTotalCount = response.data.total;
                }
                if (this.ungroupedDevicesInitialTotalCount === null && groupId === 'ungrouped') {
                    this.ungroupedDevicesInitialTotalCount = response.data.total;
                }

                this.devicesCurrentPage++;
                this.devicesTotalCount = response.data.total;
                this.devicesFetchAsync = handleAsyncSuccess(response);

            })
            .catch((error) => {
                this.devicesFetchAsync = handleAsyncError(error);
            });
    }

    fetchUngroupedDevicesCount() {
        resetAsync(this.devicesUngroupedFetchAsync, true);
        let apiAddress = `${API_DEVICES_SEARCH}?ungrouped=true`;
        return axios.get(apiAddress)
            .then((response) => {
                this.ungroupedDevicesInitialTotalCount = response.data.total;
                this.devicesUngroupedFetchAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.devicesUngroupedFetchAsync = handleAsyncError(error);
            });
    }

    fetchRememberedDevices(filter = '', groupId) {
        resetAsync(this.devicesRememberedFetchAsync, true);
        if (this.devicesFilter !== filter || this.devicesGroupFilter !== groupId) {
            this.devicesTotalCount = null;
            this.devicesCurrentPage = 0;
            this.devices = [];
            this.preparedDevices = [];
        }
        this.devicesFilter = filter;
        this.devicesGroupFilter = groupId;
        let apiAddress = `${API_DEVICES_SEARCH}?regex=${filter}&limit=${this.devicesLimit}&offset=${this.devicesCurrentPage * this.devicesLimit}`;
        if (groupId && groupId === 'ungrouped')
            apiAddress += `&ungrouped=true`;
        else if (groupId)
            apiAddress += `&groupId=${groupId}`;
        return axios.get(apiAddress)
            .then((response) => {
                this.devices = _.uniq(this.devices.concat(response.data.values), device => device.uuid);
                this._prepareDevices();
                if (this.devicesInitialTotalCount === null) {
                    this.devicesInitialTotalCount = response.data.total;
                }
                this.devicesCurrentPage++;
                this.devicesTotalCount = response.data.total;
                this.devicesRememberedFetchAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.devicesRememberedFetchAsync = handleAsyncError(error);
            });
    }

    fetchDevicesAfterDragAndDrop(groupId) {
        resetAsync(this.devicesFetchAfterDragAndDropAsync, true);
        this.devicesTotalCount = null;
        this.devicesCurrentPage = 0;
        this.devices = [];
        this.preparedDevices = [];
        let apiAddress = `${API_DEVICES_SEARCH}?regex=&limit=${this.devicesLimit}&offset=${this.devicesCurrentPage * this.devicesLimit}`;
        if (groupId && groupId === 'ungrouped')
            apiAddress += `&ungrouped=true`;
        else if (groupId)
            apiAddress += `&groupId=${groupId}`;
        return axios.get(apiAddress)
            .then((response) => {
                this.devices = response.data.values;
                this._prepareDevices();
                if (this.devicesInitialTotalCount === null) {
                    this.devicesInitialTotalCount = response.data.total;
                }
                this.devicesCurrentPage++;
                this.devicesTotalCount = response.data.total;
                this.devicesFetchAfterDragAndDropAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.devicesFetchAfterDragAndDropAsync = handleAsyncError(error);
            });
    }

    fetchDevicesAfterGroupCreation() {
        this.devices = [];
        this.preparedDevices = [];
    }

    fetchDevice(id, fetchTimes = null) {
        resetAsync(this.devicesOneFetchAsync, true);
        let that = this;
        return axios.all([
            axios.get(API_DEVICES_DEVICE_DETAILS + '/' + id + '?status=true'),
            axios.get(API_DEVICES_DIRECTOR_DEVICE + '/' + id, {
                validateStatus: function (status) {
                    return status === 200 || status === 404;
                },
            })
        ])
            .then(axios.spread(function (legacy, director) {
                that.device = legacy.data;
                if (director.data.code !== 'missing_device') {
                    that.device.isDirector = true;
                    let primary = _.filter(director.data, (data, index) => {
                        return data.primary;
                    });
                    let secondary = _.filter(director.data, (data, index) => {
                        return !data.primary;
                    });
                    that.device.directorAttributes = {
                        primary: _.first(primary),
                        secondary: secondary
                    };
                }
                this.devicesOneFetchAsync = handleAsyncSuccess(legacy);
            }))
            .catch((error) => {
                this.devicesOneFetchAsync = handleAsyncError(error);
            });
    }

    fetchDirectorAttributes(id) {
        let device = this._getDevice(id);
        if(!_.isEmpty(this.device) && this.device.uuid === id) {
            resetAsync(this.devicesDirectorAttributesFetchAsync, true);
            return axios.get(API_DEVICES_DIRECTOR_DEVICE + '/' + id)
                .then((response) => {
                    let primary = _.filter(response.data, (data, index) => {
                        return data.primary;
                    });
                    let secondary = _.filter(response.data, (data, index) => {
                        return !data.primary;
                    });
                    this.device.directorAttributes = {
                        primary: _.first(primary),
                        secondary: secondary
                    };
                    this.devicesDirectorAttributesFetchAsync = handleAsyncSuccess(response);
                })
                .catch((error) => {
                    this.devicesDirectorAttributesFetchAsync = handleAsyncError(error);
                });
        } else if(device) {
            resetAsync(this.devicesDirectorAttributesFetchAsync, true);
            return axios.get(API_DEVICES_DIRECTOR_DEVICE + '/' + id)
                .then((response) => {
                    let primary = _.filter(response.data, (data, index) => {
                        return data.primary;
                    });
                    let secondary = _.filter(response.data, (data, index) => {
                        return !data.primary;
                    });
                    device.directorAttributes = {
                        primary: _.first(primary),
                        secondary: secondary
                    };
                    this.devicesDirectorAttributesFetchAsync = handleAsyncSuccess(response);
                })
                .catch((error) => {
                    this.devicesDirectorAttributesFetchAsync = handleAsyncError(error);
                });
        } 
    }

    createDevice(data) {
        resetAsync(this.devicesCreateAsync, true);
        return axios.post(API_DEVICES_CREATE, data)
            .then((response) => {
                this.devicesCreateAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.devicesCreateAsync = handleAsyncError(error);
            });
    }

    renameDevice(id, data) {
        resetAsync(this.devicesRenameAsync, true);
        return axios.put(API_DEVICES_RENAME + '/' + id, data)
            .then((response) => {
                this.devicesRenameAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.devicesRenameAsync = handleAsyncError(error);
            });
    }

    _reset() {
        resetAsync(this.devicesFetchAsync);
        resetAsync(this.devicesUngroupedFetchAsync);
        resetAsync(this.devicesInitialFetchAsync);
        resetAsync(this.devicesRememberedFetchAsync);
        resetAsync(this.devicesFetchAfterDragAndDropAsync);
        resetAsync(this.devicesFetchAfterGroupCreationAsync);
        resetAsync(this.devicesOneFetchAsync);
        resetAsync(this.devicesDirectorAttributesFetchAsync);
        resetAsync(this.devicesCreateAsync);
        resetAsync(this.devicesRenameAsync);
        resetAsync(this.multiTargetUpdateCreateAsync);
        resetAsync(this.multiTargetUpdatesFetchAsync);
        this.devices = [];
        this.initialDevices = [];
        this.devicesInitialTotalCount = null;
        this.ungroupedDevicesInitialTotalCount = null;
        this.devicesTotalCount = null;
        this.devicesCurrentPage = 0;
        this.preparedDevices = [];
        this.devicesFilter = '';
        this.devicesSort = 'asc';
        this.device = {};
        this.deviceQueue = [];
        this.deviceHistory = [];
        this.deviceUpdatesLogs = [];
        this.stepsHistory = [];
        this.multiTargetUpdates = {};
    }

    _getDevice(id) {
        return _.findWhere(this.devices, {uuid: id});
    }

    _updateDeviceData(id, data) {
        let currentOnlineDeviceUuids = this.onlineDevices.map(field => field.uuid);
        let device = this._getDevice(id);
        if (!_.isEmpty(this.device)) {
            if (this.device.uuid === id) {
                _.each(data, (value, attr) => {
                    this.device[attr] = value;
                });
                if (!_.includes(currentOnlineDeviceUuids, this.device.uuid)) {
                    this.onlineDevices.push(this.device);
                }
            }
        } else if (device) {
            _.each(data, (value, attr) => {
                device[attr] = value;
            });
            if (!_.includes(currentOnlineDeviceUuids, device.uuid)) {
                this.onlineDevices.push(device);
            }
        }
    }

    _prepareDevices(devicesSort = this.devicesSort) {
        this.devicesSort = devicesSort;
        let devices = this.devices;
        this.preparedDevices = devices.sort((a, b) => {
            let aName = a.deviceName;
            let bName = b.deviceName;
            if (devicesSort !== 'undefined' && devicesSort == 'desc')
                return bName.localeCompare(aName);
            else
                return aName.localeCompare(bName);
        });
    }

    _countOnlineDevices() {
        let currentOnlineDeviceUuids = this.onlineDevices.map(field => field.uuid);
        _.each(this.initialDevices, (device, index) => {
            if (device.deviceStatus === "UpToDate" && !_.includes(currentOnlineDeviceUuids, device.uuid)) {
                this.onlineDevices.push(device);
            }
        });
    }

    @computed get devicesCount() {
        return this.devices.length;
    }

    @computed get lastDevices() {
        return _.sortBy(this.devices, (device) => {
            return device.createdAt;
        }).reverse().slice(0, 10);
    }
}
