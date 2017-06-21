import { observable } from 'mobx';
import axios from 'axios';
import { 
    API_ECUS_FETCH,
    API_ECUS_PUBLIC_KEY_FETCH,
} from '../config';
import { 
    resetAsync,
    handleAsyncSuccess, 
    handleAsyncError 
} from '../utils/Common';

export default class HardwareStore {

    @observable hardwareFetchAsync = {};
    @observable hardwareFetchWsAsync = {};
    @observable hardwarePublicKeyFetchAsync = {};
    @observable hardware = {};
    @observable publicKey = {};

    constructor() {
        resetAsync(this.hardwareFetchAsync);
        resetAsync(this.hardwarePublicKeyFetchAsync);
    }

    fetchHardware(deviceId) {
        resetAsync(this.hardwareFetchAsync, true);
        return axios.get(`${API_ECUS_FETCH}/${deviceId}/system_info`)
            .then(function (response) {
                this.hardware[deviceId] = response.data;
                this.hardwareFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.hardwareFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchHardwareWs(deviceId) {
        resetAsync(this.hardwareFetchWsAsync, true);
        return axios.get(`${API_ECUS_FETCH}/${deviceId}/system_info`)
            .then(function (response) {
                this.hardware[deviceId] = response.data;
                this.hardwareFetchWsAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.hardwareFetchWsAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchPublicKey(deviceId, ecuId) {
        resetAsync(this.hardwarePublicKeyFetchAsync, true);
        return axios.get(`${API_ECUS_PUBLIC_KEY_FETCH}/${deviceId}/ecus/public_key?ecu_serial=${ecuId}`)
            .then(function (response) {
                this.publicKey = response.data;
                this.hardwarePublicKeyFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.hardwarePublicKeyFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    _reset() {
        resetAsync(this.hardwareFetchAsync);
        resetAsync(this.hardwareFetchWsAsync);
        resetAsync(this.hardwarePublicKeyFetchAsync);
        this.hardware = {};
        this.publicKey = {};
    }

    _resetPublicKey() {
        resetAsync(this.hardwarePublicKeyFetchAsync);
        this.publicKey = {};
    }
}