import { observable } from 'mobx';
import axios from 'axios';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { 
    API_PROVISIONING_STATUS, 
    API_PROVISIONING_ACTIVATE,
    API_PROVISIONING_DETAILS,
    API_PROVISIONING_KEYS_FETCH,
    API_PROVISIONING_KEY_CREATE,
    API_FEATURES_TREEHUB_ACTIVATE
} from '../config';
import { 
    resetAsync, 
    handleAsyncSuccess, 
    handleAsyncError 
} from '../utils/Common';
import _ from 'underscore';

export default class ProvisioningStore {

    @observable provisioningStatusFetchAsync = {};
    @observable provisioningActivateAsync = {};
    @observable provisioningDetailsFetchAsync = {};
    @observable provisioningKeysFetchAsync = {};
    @observable provisioningKeyCreateAsync = {};
    @observable provisioningStatus = {};
    @observable provisioningDetails = {};
    @observable initialProvisioningKeys = [];
    @observable provisioningKeys = [];
    @observable provisioningKeysSort = 'asc';
    @observable preparedProvisioningKeys = [];

    constructor() {
        resetAsync(this.provisioningStatusFetchAsync);
        resetAsync(this.provisioningActivateAsync);
        resetAsync(this.provisioningDetailsFetchAsync);
        resetAsync(this.provisioningKeysFetchAsync);
        resetAsync(this.provisioningKeyCreateAsync);
    }

    _filterProvisioningKeys(filter) {
        let searchResults = [];
        let found = _.each(this.initialProvisioningKeys, function(key, index) {
            return key.description.indexOf(filter) >= 0 ? searchResults.push(key) : null
        });
        this.provisioningKeys = searchResults;
        this._prepareProvisioningKeys();
    }

    _prepareProvisioningKeys(sort = this.provisioningKeysSort) {
        this.provisioningKeysSort = sort;
        let keys = this.provisioningKeys;

        this.preparedProvisioningKeys = keys.sort((a, b) => {
            let aName = a.description;
            let bName = b.description;
            if(sort !== 'undefined' && sort == 'desc')
                return bName.localeCompare(aName);
            else
                return aName.localeCompare(bName);
        });
    }

    fetchProvisioningStatus() {
        resetAsync(this.provisioningStatusFetchAsync, true);
        return axios.get(API_PROVISIONING_STATUS)
            .then(function (response) {
                this.provisioningStatus = response.data;
                if(response.data.active) {
                    this.fetchProvisioningDetails();
                    this.fetchProvisioningKeys();
                }
                this.provisioningStatusFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.provisioningStatusFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    activateProvisioning() {
        resetAsync(this.provisioningActivateAsync, true);
        return axios.put(API_PROVISIONING_ACTIVATE)
            .then(function (response) {
                this.fetchProvisioningStatus();
                this.provisioningActivateAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.provisioningActivateAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchProvisioningDetails() {
        resetAsync(this.provisioningDetailsFetchAsync, true);
        return axios.get(API_PROVISIONING_DETAILS)
            .then(function (response) {
                this.provisioningDetails = response.data;
                this.provisioningDetailsFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.provisioningDetailsFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchProvisioningKeys() {
        resetAsync(this.provisioningKeysFetchAsync, true);
        return axios.get(API_PROVISIONING_KEYS_FETCH)
            .then(function (response) {
                this.initialProvisioningKeys = response.data;
                this.provisioningKeys = response.data;
                this._prepareProvisioningKeys();
                this.provisioningKeysFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.provisioningKeysFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    createProvisioningKey(data) {
        resetAsync(this.provisioningKeyCreateAsync, true);
        return axios.post(API_PROVISIONING_KEY_CREATE, data)
            .then(function (response) {
                this.fetchProvisioningKeys();
                this.provisioningKeyCreateAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.provisioningKeyCreateAsync = handleAsyncError(error);
            }.bind(this));
    }

    downloadProvisioningKeyBundle(keyUuid) {
        return axios.all([
                axios.get(API_PROVISIONING_KEYS_FETCH + '/' + keyUuid, { responseType: 'arraybuffer' }),
                axios.get(API_FEATURES_TREEHUB_ACTIVATE + '/config')])
            .then(axios.spread(function (provResp, treehubResp) {
                var zip = new JSZip();
                zip.file("autoprov.url", this.provisioningDetails.uri);
                zip.file("autoprov_credentials.p12", provResp.data, { binary: true });
                zip.file("treehub.json", JSON.stringify(treehubResp.data, null, 2));
                zip.generateAsync({type: "blob"})
                    .then(function (content) {
                        FileSaver.saveAs(content, "credentials.zip");
                    }
                );
            }.bind(this)))
            .catch(function (error) {
                handleAsyncError(error);
            }.bind(this));
    }

    _reset() {
        resetAsync(this.provisioningStatusFetchAsync);
        resetAsync(this.provisioningActivateAsync);
        resetAsync(this.provisioningDetailsFetchAsync);
        resetAsync(this.provisioningKeysFetchAsync);
        resetAsync(this.provisioningKeyCreateAsync);
        this.provisioningStatus = {};
        this.provisioningDetails = {};
        this.initialProvisioningKeys = [];
        this.provisioningKeys = [];
        this.provisioningKeysSort = 'asc';
        this.preparedProvisioningKeys = [];
    }
}
