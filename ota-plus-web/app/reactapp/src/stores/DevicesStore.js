import { observable, computed } from 'mobx';
import axios from 'axios';
import { 
    API_DEVICES_SEARCH,
    API_DEVICES_DEVICE_DETAILS,
    API_DEVICES_CREATE, 
    API_DEVICES_RENAME,
    API_DEVICES_UPDATES_LOGS,
    API_PACKAGES_SEARCH
} from '../config';
import { 
    resetAsync,
    handleAsyncSuccess, 
    handleAsyncError 
} from '../utils/Common';
import _ from 'underscore';

export default class DevicesStore {

    @observable devicesFetchAsync = {};
    @observable devicesOneFetchAsync = {};
    @observable devicesCreateAsync = {};
    @observable devicesRenameAsync = {};
    @observable devices = [];
    @observable devicesInitialTotalCount = null;
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
    
    constructor() {
        resetAsync(this.devicesFetchAsync);
        resetAsync(this.devicesOneFetchAsync);
        resetAsync(this.devicesCreateAsync);
        resetAsync(this.devicesRenameAsync);
        this.devicesLimit = 10;
    }

    fetchDevices(filter = '', groupId) {
        resetAsync(this.devicesFetchAsync, true);
        if(this.devicesFilter !== filter || this.devicesGroupFilter !== groupId) {
            this.devicesTotalCount = null;
            this.devicesCurrentPage = 0;
            this.devices = [];
            this.preparedDevices = [];
        }
        this.devicesFilter = filter;
        this.devicesGroupFilter = groupId;
        let apiAddress = `${API_DEVICES_SEARCH}?regex=${filter}&limit=${this.devicesLimit}&offset=${this.devicesCurrentPage*this.devicesLimit}`;
        if(groupId)
            apiAddress += `&groupId=${groupId}`;
        return axios.get(apiAddress)
            .then((response) => {
                this.devices = _.uniq(this.devices.concat(response.data.values), device => device.uuid);
                this._prepareDevices();
                if(this.devicesInitialTotalCount === null) {
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

    fetchDevice(id) {
        resetAsync(this.devicesOneFetchAsync, true);
        return axios.get(API_DEVICES_DEVICE_DETAILS + '/' + id + '?status=true')
            .then((response) => {
                this.device = response.data;
                this.devicesOneFetchAsync = handleAsyncSuccess(response);
            })
            .catch((error) => {
                this.devicesOneFetchAsync = handleAsyncError(error);
            });
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
        resetAsync(this.devicesOneFetchAsync);
        resetAsync(this.devicesCreateAsync);
        resetAsync(this.devicesRenameAsync);
        this.devices = [];
        this.devicesInitialTotalCount = null;
        this.devicesTotalCount = null;
        this.devicesCurrentPage = 0;
        this.preparedDevices = [];
        this.devicesFilter = '';
        this.devicesSort = 'asc';
        this.device = {};
        this.deviceQueue = [];
        this.deviceHistory = [];
        this.deviceUpdatesLogs = [];
    }

    _getDevice(id) {
        return _.findWhere(this.devices, {uuid: id});
    }

    _updateDeviceData(id, data) {
        let device = this._getDevice(id);
        if(device) {
            _.each(data, (value, attr) => {
                device[attr] = value;
            });
        }
        if(this.device)
            _.each(data, (value, attr) => {
                this.device[attr] = value;
            });
    }

    _prepareDevices(devicesSort = this.devicesSort) {
        this.devicesSort = devicesSort;
        let devices = this.devices;
        this.preparedDevices = devices.sort((a, b) => {
          let aName = a.deviceName;
          let bName = b.deviceName;
          if(devicesSort !== 'undefined' && devicesSort == 'desc')
            return bName.localeCompare(aName);
          else
            return aName.localeCompare(bName);
        });
    }

    @computed get devicesCount() {
        return this.devices.length;
    }

    @computed get lastDevices() {
        return _.sortBy(this.devices, (device) => {
            return device.createdAt;
        }).reverse().slice(0,10);
    }
}