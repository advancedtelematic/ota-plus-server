import { observable, isObservableArray } from 'mobx';
import axios from 'axios';
import _ from 'underscore';
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
    @observable hardware = [];
    @observable filteredHardware = [];
    @observable publicKey = {};
    @observable hardwareIds = [];
    @observable hardwareIdsLimit = 1000;
    @observable hardwareIdsCurrentPage = 0;
    @observable hardwareFilter = '';

    constructor() {
        resetAsync(this.hardwareFetchAsync);
        resetAsync(this.hardwarePublicKeyFetchAsync);
    }

    fetchHardware(deviceId) {
        resetAsync(this.hardwareFetchAsync, true);
        return axios.get(`${API_ECUS_FETCH}/${deviceId}/system_info`)
            .then(function (response) {
                this._prepareHardware(response.data);
                this.hardwareFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.hardwareFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    _filterHardware(filter) {
        let searchResults = [];
        _.each(this.hardware, (objects, index) => {
            _.each(objects, (value, property) => {
                property += ':';
                if(value.toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0 || property.toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
                    searchResults.push({
                        [property]: value,
                        id: this.hardware[index].id,
                        showId: this.hardware[index].id.toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0,
                        name: this.hardware[index].name,
                    });
                }
            });
        });
        searchResults = _.groupBy(searchResults, (prop) => {
            return prop.id;
        });
        this._prepareFilteredHardware(searchResults);
    }

    _prepareFilteredHardware(searchResults) {
        let pairs = [];
        _.each(searchResults, (properties, id) => {
            _.each(properties, (value, property) => {
                pairs.push(value);
            });
        });
        pairs = _.groupBy(pairs, (prop) => {
            return prop.id;
        });
        let final = [];
        _.each(pairs, (pair, id) => {
            let convert = {};
            _.each(pair, (obj, index) => {
                _.each(obj, (o, i) => {
                    convert[i] = o;
                });
            });
            final.push(convert);
        });
        this.filteredHardware = final;
    }

    _capitalize(string) {
        return string.toUpperCase();
    }

    _prepareHardware(data) {
        let that = this;
        let pairs = {};
        if(_.isArray(data)) {
            _.each(data, (obj, index) => {
                let name = obj.description ? this._capitalize(obj.description) : this._capitalize(obj.class);
                obj.name = name;
                if(obj.capabilities) {
                    _.each(obj.capabilities, (value, property) => {
                        obj[property] = value;
                    });
                }
                if(obj.configuration) {
                    _.each(obj.configuration, (value, property) => {
                        obj[property] = value;
                    });
                }
                that.hardware.push(obj);
                that.filteredHardware.push(obj);
                if(obj.children) {
                    that._prepareHardware(obj.children);
                }
            });
        } else {
            _.each(data, (value, property) => {
                pairs[property] = value;
                pairs['name'] = data.description ? this._capitalize(data.description) : this._capitalize(data.class);
                if(property === 'children') {
                    that._prepareHardware(data.children);
                }
            });
            that.hardware.push(pairs);
            that.filteredHardware.push(pairs);
        }
        that.hardware = _.sortBy(that.hardware, 'name');
        that.filteredHardware = _.sortBy(that.filteredHardware, 'name');
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
        this.hardware = [];
        this.filteredHardware = [];
        this.publicKey = {};
        this.hardwareIdsCurrentPage = 0;
    }

    _resetPublicKey() {
        resetAsync(this.hardwarePublicKeyFetchAsync);
        this.publicKey = {};
    }
}