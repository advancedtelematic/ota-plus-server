import { observable, computed } from 'mobx';
import axios from 'axios';
import moment from 'moment';
import _ from 'underscore';
import { 
    API_USER_DETAILS,
    API_USER_UPDATE,
    API_USER_CHANGE_PASSWORD,
    API_USER_ACTIVE_DEVICE_COUNT,
    API_USER_DEVICES_SEEN,
} from '../config';
import { 
    resetAsync, 
    handleAsyncSuccess, 
    handleAsyncError 
} from '../utils/Common';

export default class UserStore {

    @observable userFetchAsync = {};
    @observable userUpdateAsync = {};
    @observable userChangePasswordAsync = {};
    @observable userActiveDeviceCountFetch = {};
    @observable user = {};
    @observable ifLogout = false;
    
    constructor() {
        this.activatedDevices = observable.map();
        this.activeDevices = observable.map();
        this.connectedDevices = observable.map();
        this.activatedDevicesFetchAsync = observable.map();
        this.activeDevicesFetchAsync = observable.map();
        this.connectedDevicesFetchAsync = observable.map();
        resetAsync(this.userFetchAsync);
        resetAsync(this.userUpdateAsync);
        resetAsync(this.userChangePasswordAsync);
    }

    fetchUser() {
        resetAsync(this.userFetchAsync, true);
        return axios.get(API_USER_DETAILS)
            .then(function (response) {
                this.user = response.data;
                this.userFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.userFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    updateUser(data) {
        resetAsync(this.userChangePasswordAsync);
        resetAsync(this.userUpdateAsync, true);
        return axios.put(API_USER_UPDATE, data)
            .then(function (response) {
                this.fetchUser();
                this.userUpdateAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.userUpdateAsync = handleAsyncError(error);
            }.bind(this));
    }

    changePassword() {
        resetAsync(this.userUpdateAsync);
        resetAsync(this.userChangePasswordAsync, true);
        return axios.post(API_USER_CHANGE_PASSWORD)
            .then(function (response) {
                this.userChangePasswordAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.userChangePasswordAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchActivatedDeviceCount(startTime, endTime) {
        const objKey = startTime.format('YYYYMM');
        resetAsync(this.activatedDevicesFetchAsync.get(objKey), true);
        return axios.get(API_USER_ACTIVE_DEVICE_COUNT + '?start=' + encodeURIComponent(startTime.toISOString()) + '&end=' + encodeURIComponent(endTime.toISOString()))
            .then(function (response) {
                this.activatedDevices.set(objKey, response.data);
                this.activatedDevicesFetchAsync.set(objKey, handleAsyncSuccess(response));
            }.bind(this))
            .catch(function (error) {
                this.activatedDevicesFetchAsync.set(objKey, handleAsyncError(error));
            }.bind(this))
    }

    fetchActiveDeviceCount(startTime, endTime) {
        const objKey = startTime.format('YYYYMM');
        resetAsync(this.activeDevicesFetchAsync.get(objKey), true);
        return axios.get(API_USER_ACTIVE_DEVICE_COUNT + '?start=' + encodeURIComponent(new Date(0).toISOString()) + '&end=' + encodeURIComponent(endTime.toISOString()))
            .then(function (response) {
                this.activeDevices.set(objKey, response.data);
                this.activeDevicesFetchAsync.set(objKey, handleAsyncSuccess(response));
            }.bind(this))
            .catch(function (error) {
                this.activeDevicesFetchAsync.set(objKey, handleAsyncError(error));
            }.bind(this))
    }

    fetchConnectedDeviceCount(year, month) {
        const objKey = year + '' + month;
        resetAsync(this.connectedDevicesFetchAsync.get(objKey), true);
        return axios.get(API_USER_DEVICES_SEEN + '/' + year + '/' + month)
            .then(function (response) {
                this.connectedDevices.set(objKey, response.data);
                this.connectedDevicesFetchAsync.set(objKey, handleAsyncSuccess(response));
            }.bind(this))
            .catch(function (error) {
                this.connectedDevicesFetchAsync.set(objKey, handleAsyncError(error));
            }.bind(this))
    }

    _setUsageInitial(startTime, monthsCount) {
        for(var i = 0; i <= monthsCount; i++) {
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

    _deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    _logout() {
        this._deleteCookie('systemReady');
        this.ifLogout = true;
    }
}