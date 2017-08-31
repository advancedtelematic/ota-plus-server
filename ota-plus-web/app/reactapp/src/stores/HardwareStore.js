import { observable } from 'mobx';
import axios from 'axios';
import { 
    API_ECUS_FETCH,
    API_ECUS_PUBLIC_KEY_FETCH,
    API_HARDWARE_IDS_FETCH
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
    @observable hardwareIdsFetchAsync = {};
    @observable hardware = {};
    @observable publicKey = {};
    @observable hardwareIds = [];
    @observable hardwareIdsLimit = 1000;
    @observable hardwareIdsCurrentPage = 0;

    constructor() {
        resetAsync(this.hardwareFetchAsync);
        resetAsync(this.hardwarePublicKeyFetchAsync);
    }

    fetchHardware(deviceId) {
        resetAsync(this.hardwareFetchAsync, true);
        return axios.get(`${API_ECUS_FETCH}/${deviceId}/system_info`)
            .then(function (response) {
                let data = response.data;
                if(typeof data === 'string') {
                    data = JSON.parse(data);
                }
                this.hardware[deviceId] = data;
                this.hardwareFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.hardwareFetchAsync = handleAsyncError(error);
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

    fetchHardwareIds() {
        resetAsync(this.hardwareIdsFetchAsync, true);
        return axios.get(`${API_HARDWARE_IDS_FETCH}` + '?limit=' + this.hardwareIdsLimit + '&offset=' + this.hardwareIdsCurrentPage * this.hardwareIdsLimit)
            .then(function (response) {
                this.hardwareIds = response.data.values;
                this.hardwareIdsFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.hardwareIdsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    _reset() {
        resetAsync(this.hardwareFetchAsync);
        resetAsync(this.hardwareFetchWsAsync);
        resetAsync(this.hardwarePublicKeyFetchAsync);
        resetAsync(this.hardwareIdsFetchAsync);
        this.hardware = {};
        this.publicKey = {};
        this.hardwareIdsCurrentPage = 0;
    }

    _resetPublicKey() {
        resetAsync(this.hardwarePublicKeyFetchAsync);
        this.publicKey = {};
    }
}