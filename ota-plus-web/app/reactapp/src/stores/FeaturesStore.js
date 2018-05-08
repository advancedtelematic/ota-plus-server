import { observable } from 'mobx';
import axios from 'axios';
import { 
    API_FEATURES_FETCH, 
    API_FEATURES_TREEHUB_ACTIVATE, 
    API_FEATURES_FILE_UPLOADER_ACTIVATE,
    API_FEATURES_FILE_UPLOADER_CLIENT_ID_GET
} from '../config';
import { 
    resetAsync, 
    handleAsyncSuccess, 
    handleAsyncError 
} from '../utils/Common';
import _ from 'underscore';

export default class FeaturesStore {

    @observable featuresFetchAsync = {};
    @observable featuresTreehubActivateAsync = {};
    @observable featuresFileUploaderActivateAsync = {};
    @observable featuresClientIdFetchAsync = {};
    @observable features = [];
    @observable clientId = null;
    @observable alphaPlusEnabled = false;
    
    constructor() {
        resetAsync(this.featuresFetchAsync);
        resetAsync(this.featuresTreehubActivateAsync);
        resetAsync(this.featuresFileUploaderActivateAsync);
        resetAsync(this.featuresClientIdFetchAsync);
    }

    resetFeaturesFetchAsync(isFetching = false) {
        this.featuresFetchAsync = {
            isFetching: isFetching,
            status: null
        }
    }

    resetFeaturesTreehubActivateAsync(isFetching = false) {
        this.featuresTreehubActivateAsync = {
            isFetching: isFetching,
            status: null
        }
    }

    fetchFeatures() {
        resetAsync(this.featuresFetchAsync, true);
        return axios.get(API_FEATURES_FETCH)
            .then(function (response) {
                this.features = response.data;
                if(_.contains(response.data, 'alphaplus')) {
                    this.alphaPlusEnabled = true;
                }
                this.featuresFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.featuresFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    activateTreehub() {
        resetAsync(this.featuresTreehubActivateAsync);
        return axios.put(API_FEATURES_TREEHUB_ACTIVATE)
            .then(function (response) {
                this.featuresTreehubActivateAsync = handleAsyncSuccess(response);
                this.fetchFeatures();
            }.bind(this))
            .catch(function (error) {
                this.featuresTreehubActivateAsync = handleAsyncError(error);
            }.bind(this));
    }

    activateFileUploader() {
        resetAsync(this.featuresFileUploaderActivateAsync);
        return axios.put(API_FEATURES_FILE_UPLOADER_ACTIVATE)
            .then(function (response) {
                this.featuresFileUploaderActivateAsync = handleAsyncSuccess(response);
                this.fetchFeatures();
            }.bind(this))
            .catch(function (error) {
                this.featuresFileUploaderActivateAsync = handleAsyncError(error);
            }.bind(this));
    }

    fetchClientId() {
        resetAsync(this.featuresClientIdFetchAsync, true);
        return axios.get(API_FEATURES_FILE_UPLOADER_CLIENT_ID_GET)
            .then(function (response) {
                this.clientId = response.data.client_id;
                this.featuresClientIdFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.featuresClientIdFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    _reset() {
        resetAsync(this.featuresFetchAsync);
        resetAsync(this.featuresTreehubActivateAsync);
        resetAsync(this.featuresFileUploaderActivateAsync);
        resetAsync(this.featuresClientIdFetchAsync);
    }
}