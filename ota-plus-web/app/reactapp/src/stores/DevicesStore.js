import {observable, computed, extendObservable} from 'mobx';
import axios from 'axios';
import {
    API_DEVICES_SEARCH,
    API_DEVICES_NETWORK_INFO,
    API_DIRECTOR_DEVICES_SEARCH,
    API_DEVICES_DEVICE_DETAILS,
    API_DEVICES_DIRECTOR_DEVICE,
    API_DEVICES_CREATE,
    API_DEVICES_RENAME,
    API_GET_MULTI_TARGET_UPDATE_INDENTIFIER,
    API_CREATE_MULTI_TARGET_UPDATE,
    API_FETCH_MULTI_TARGET_UPDATES,
    API_CANCEL_MULTI_TARGET_UPDATE
} from '../config';
import {
    resetAsync,
    handleAsyncSuccess,
    handleAsyncError
} from '../utils/Common';
import _ from 'underscore';

export default class DevicesStore {

    @observable devicesFetchAsync = {};
    @observable deviceFleetsFetchAsync = {};
    @observable devicesOneFetchAsync = {};
    @observable devicesOneNetworkInfoFetchAsync = {};
    @observable devicesCountFetchAsync = {};
    @observable devicesDirectorAttributesFetchAsync = {};
    @observable devicesDirectorHashesFetchAsync = {};
    @observable devicesCreateAsync = {};
    @observable devicesRenameAsync = {};
    @observable mtuCreateAsync = {};
    @observable mtuFetchAsync = {};
    @observable mtuCancelAsync = {};

    @observable devices = [];
    @observable devicesInitialTotalCount = null;
    @observable devicesTotalCount = null;
    @observable devicesCurrentPage = 0;
    @observable preparedDevices = [];
    @observable devicesFilter = '';
    @observable devicesGroupFilter = null;
    @observable devicesSort = 'asc';
    @observable device = {};
    @observable deviceNetworkInfo = {
        local_ipv4: null,
        mac: null,
        hostname: null
    };
    @observable multiTargetUpdates = [];
    @observable multiTargetUpdatesSaved = [];
    @observable directorDevicesCount = 0;
    @observable directorDevicesIds = [];
    @observable deviceFleets = [];

    constructor() {
        resetAsync(this.devicesFetchAsync);
        resetAsync(this.deviceFleetsFetchAsync);
        resetAsync(this.devicesOneFetchAsync);
        resetAsync(this.devicesCountFetchAsync);
        resetAsync(this.devicesDirectorAttributesFetchAsync);
        resetAsync(this.devicesDirectorHashesFetchAsync);
        resetAsync(this.devicesCreateAsync);
        resetAsync(this.devicesRenameAsync);
        resetAsync(this.mtuCreateAsync);
        resetAsync(this.mtuFetchAsync);
        resetAsync(this.mtuCancelAsync);
        this.devicesLimit = 30;
    }

    fetchDeviceFleets() {
        resetAsync(this.deviceFleetsFetchAsync, true);
        this.deviceFleets = [
            {
                id: 1,
                name: 'HR2',
                icon_default: '/assets/img/icons/vehicle_01--default.svg',
                icon_active: '/assets/img/icons/vehicle_01--active.svg',
            },
            {
                id: 2,
                name: 'HR3',
                icon_default: '/assets/img/icons/vehicle_02--default.svg',
                icon_active: '/assets/img/icons/vehicle_02--active.svg',
            },
            {
                id: 3,
                name: 'HR4',
                icon_default: '/assets/img/icons/vehicle_03--default.svg',
                icon_active: '/assets/img/icons/vehicle_03--active.svg',
            },
            {
                id: 4,
                name: 'HR5',
                icon_default: '/assets/img/icons/vehicle_04--default.svg',
                icon_active: '/assets/img/icons/vehicle_04--active.svg',
            },
            {
                id: 5,
                name: 'HR6',
                icon_default: '/assets/img/icons/vehicle_05--default.svg',
                icon_active: '/assets/img/icons/vehicle_05--active.svg',
            }
        ];
        this.deviceFleetsFetchAsync = handleAsyncSuccess(this.deviceFleets);
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
                this.devicesCurrentPage++;
                this.devicesTotalCount = response.data.total;
                this.devicesFetchAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.devicesFetchAsync = handleAsyncError(error);
            });
    }

    _increaseDeviceInitialTotalCount() {
        this.devicesInitialTotalCount++;
    }

    fetchDevice(id) {
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

    fetchDeviceNetworkInfo(id, isFromWs = false) {
        if(this.device.uuid === id) {
            resetAsync(this.devicesOneNetworkInfoFetchAsync, true);
            return axios.get(API_DEVICES_NETWORK_INFO + '/' + id + '/system_info/network')
                .then((response) => {
                    this.deviceNetworkInfo = response.data;
                    this.devicesOneNetworkInfoFetchAsync = handleAsyncSuccess(response);
                })
                .catch((error) => {
                    this.devicesOneNetworkInfoFetchAsync = handleAsyncError(error);
                });
        }
    }

    createMultiTargetUpdate(data, id) {
        let updateObject = this._prepareUpdateObject(data);
        resetAsync(this.mtuCreateAsync, true);
        return axios.post(API_GET_MULTI_TARGET_UPDATE_INDENTIFIER, updateObject)
            .then((response) => {
                let updateIdentifier = response.data;
                let status = null;
                if(updateIdentifier.length) {
                    let after = _.after(status === 'success', () => {
                        this.fetchMultiTargetUpdates(id);
                        this.mtuCreateAsync = handleAsyncSuccess(response);
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
                this.mtuCreateAsync = handleAsyncError(error);
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
                        targetLength: data.targetLength
                    },
                    targetFormat: data.targetFormat,
                    generateDiff: data.generateDiff
                }
            }
        }
    }

    fetchMultiTargetUpdates(id) {
        resetAsync(this.mtuFetchAsync, true);
        return axios.get(API_FETCH_MULTI_TARGET_UPDATES + '/' + id + '/queue')
            .then((response) => {
                let data = response.data;
                _.each(data, (item, index) => {
                    item.device = id;
                });
                this.multiTargetUpdates = response.data;
                this.multiTargetUpdatesSaved = _.uniq(this.multiTargetUpdates.concat(response.data), item => item.device);
                this.mtuFetchAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.mtuFetchAsync = handleAsyncError(error);
            });
    }

    cancelMtuUpdate(data) {
        resetAsync(this.mtuCancelAsync, true);
        return axios.post(API_CANCEL_MULTI_TARGET_UPDATE, data)
            .then(function(response) {
                this.mtuCancelAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function(error) {
                this.mtuCancelAsync = handleAsyncError(error);
            }.bind(this));
    }    

    fetchDevicesCount() {
        resetAsync(this.devicesCountFetchAsync, true);
        let that = this;
        return axios.all([
            axios.get(API_DEVICES_SEARCH),
            axios.get(API_DIRECTOR_DEVICES_SEARCH),
        ])
            .then(axios.spread(function (all, director) {
                let allDevicesCount = all.data.total;
                that.directorDevicesCount = director.data.total;
                that.directorDevicesIds = director.data.values;
                that.devicesCountFetchAsync = handleAsyncSuccess(all);
            }))
            .catch((error) => {
                that.devicesCountFetchAsync = handleAsyncError(error);
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
                    extendObservable(this.device, {
                        directorAttributes: {
                            primary: _.first(primary),
                            secondary: secondary
                        }
                    });
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
                    extendObservable(device, {
                        directorAttributes: {
                            primary: _.first(primary),
                            secondary: secondary
                        }
                    });
                    this.devicesDirectorAttributesFetchAsync = handleAsyncSuccess(response);
                })
                .catch((error) => {
                    this.devicesDirectorAttributesFetchAsync = handleAsyncError(error);
                });
        }
    }

    fetchPrimaryAndSecondaryFilepaths(id) {
        resetAsync(this.devicesDirectorHashesFetchAsync, true);
        return axios.get(API_DEVICES_DIRECTOR_DEVICE + '/' + id)
            .then((response) => {
                let filepaths = _.map(response.data, (item, i) => {
                    return item.image.filepath;
                });
                this.devicesDirectorHashesFetchAsync = handleAsyncSuccess(response);
                return filepaths;
            })
            .catch((error) => {
                this.devicesDirectorHashesFetchAsync = handleAsyncError(error);
            });
    }

    _getPrimaryFilepath() {
        return this.device.directorAttributes.primary.image.filepath;
    }

    _getPrimarySerial() {
        return this.device.directorAttributes.primary.id;
    }

    _getPrimaryHardwareId() {
        return this.device.directorAttributes.primary.hardwareId;
    }

    _getSecondaryFilepathsBySerial(serial) {
        let filepaths = [];
        _.map(this.device.directorAttributes.secondary, (secondary, index) => {
            if(secondary.id === serial) {
                filepaths.push(secondary.image.filepath);
            }
        })
        return filepaths;
    }

    _getPrimaryByHardwareId(hardwareId) {
        if(this.device.directorAttributes.primary.hardwareId === hardwareId) {
            return this.device.directorAttributes.primary;
        }
        return null;
    }

    _getSecondaryBySerial(serial) {
        let secondaryObject = {};
        _.each(this.device.directorAttributes.secondary, (secondary, index) => {
            if(secondary.id === serial) {
                secondaryObject = secondary;
            }
        });
        return secondaryObject;
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
                this.fetchDevicesCount();
            })
            .catch((error) => {
                this.devicesRenameAsync = handleAsyncError(error);
            });
    }

    _reset() {
        resetAsync(this.devicesFetchAsync);
        resetAsync(this.deviceFleetsFetchAsync);
        resetAsync(this.devicesOneFetchAsync);
        resetAsync(this.devicesOneNetworkInfoFetchAsync);
        resetAsync(this.devicesCountFetchAsync);
        resetAsync(this.devicesDirectorAttributesFetchAsync);
        resetAsync(this.devicesDirectorHashesFetchAsync);
        resetAsync(this.devicesCreateAsync);
        resetAsync(this.devicesRenameAsync);
        resetAsync(this.mtuCreateAsync);
        resetAsync(this.mtuFetchAsync);
        resetAsync(this.mtuCancelAsync);
        this.devices = [];
        this.devicesInitialTotalCount = null;
        this.devicesTotalCount = null;
        this.devicesCurrentPage = 0;
        this.preparedDevices = [];
        this.devicesFilter = '';
        this.devicesSort = 'asc';
        this.device = {};
        this.deviceNetworkInfo = {
            ip: null,
            mac: null,
            hostname: null
        };
        this.multiTargetUpdates = [];
        this.multiTargetUpdatesSaved = [];
        this.directorDevicesCount = 0;
        this.directorDevicesIds = [];
    }

    _getDevice(id) {
        return _.findWhere(this.devices, {uuid: id});
    }

    _updateDeviceData(id, data) {
        let device = this._getDevice(id);
        if (!_.isEmpty(this.device)) {
            if (this.device.uuid === id) {
                _.each(data, (value, attr) => {
                    this.device[attr] = value;
                });
            }
        } else if (device) {
            _.each(data, (value, attr) => {
                device[attr] = value;
            });
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

    @computed get lastDevices() {
        return _.sortBy(this.devices, (device) => {
            return device.createdAt;
        }).reverse().slice(0, 10);
    }
}
