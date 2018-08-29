import { observable } from 'mobx';
import axios from 'axios';
import {
    API_FEATURES_FETCH
} from '../config';
import {
    resetAsync,
    handleAsyncSuccess,
    handleAsyncError
} from '../utils/Common';
import _ from 'underscore';

export default class FeaturesStore {

    @observable featuresFetchAsync = {};
    @observable features = [];
    @observable clientId = null;
    @observable alphaPlusEnabled = true;

    constructor() {
        resetAsync(this.featuresFetchAsync);
    }

    resetFeaturesFetchAsync(isFetching = false) {
        this.featuresFetchAsync = {
            isFetching: isFetching,
            status: null
        }
    }

    fetchFeatures() {
        resetAsync(this.featuresFetchAsync, true);
        return axios.get(API_FEATURES_FETCH)
            .then(function (response) {
                this.features = response.data;
                if (_.contains(response.data, 'alphaplus')) {
                    this.alphaPlusEnabled = true;
                }
                this.featuresFetchAsync = handleAsyncSuccess(response);
            }.bind(this))
            .catch(function (error) {
                this.featuresFetchAsync = handleAsyncError(error);
            }.bind(this));
    }

    _reset() {
        resetAsync(this.featuresFetchAsync);
    }
}
