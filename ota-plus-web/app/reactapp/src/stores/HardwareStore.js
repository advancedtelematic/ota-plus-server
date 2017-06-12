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

    fetchPublicKey(deviceId, ecuId) {
        resetAsync(this.hardwarePublicKeyFetchAsync, true);
        // return axios.get(`${API_ECUS_PUBLIC_KEY_FETCH}/${deviceId}/ecus/public_key/ecu_serial=${ecuId}`)
        //     .then(function (response) {
        //         this.publicKey = response.data;
        //         this.hardwarePublicKeyFetchAsync = handleAsyncSuccess(response);
        //     }.bind(this))
        //     .catch(function (error) {
        //         this.hardwarePublicKeyFetchAsync = handleAsyncError(error);
        //     }.bind(this));
        setTimeout(() => {
            this.publicKey = {
                "keytype": "RSA",
                "keyval": {
                    "public": `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0
FPqri0cb2JZfXJ/DgYSF6vUpwmJG8wVQZKjeGcjDOL5UlsuusFncCzWBQ7RKNUSesmQRMSGkVb1/
3j+skZ6UtW+5u09lHNsj6tQ51s1SPrCBkedbNf0Tp0GbMJDyR4e9T04ZZwIDAQAB
-----END PUBLIC KEY-----`
                }
            };
            this.hardwarePublicKeyFetchAsync = handleAsyncSuccess({});
        }, 2000);
    }

    _reset() {
        resetAsync(this.hardwareFetchAsync);
        resetAsync(this.hardwarePublicKeyFetchAsync);
        this.hardware = {};
        this.publicKey = {};
    }

    _resetPublicKey() {
        resetAsync(this.hardwarePublicKeyFetchAsync);
        this.publicKey = {};
    }
}